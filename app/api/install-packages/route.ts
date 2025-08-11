import { NextRequest, NextResponse } from 'next/server';
import { Sandbox } from 'e2b';

declare global {
  var activeSandbox: any;
  var sandboxData: any;
}

export async function POST(request: NextRequest) {
  try {
    const { packages, sandboxId } = await request.json();
    
    if (!packages || !Array.isArray(packages) || packages.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Packages array is required' 
      }, { status: 400 });
    }
    
    // Validate and deduplicate package names
    const validPackages = Array.from(new Set(packages))
      .filter(pkg => pkg && typeof pkg === 'string' && pkg.trim() !== '')
      .map(pkg => pkg.trim());
    
    if (validPackages.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No valid package names provided'
      }, { status: 400 });
    }
    
    // Log if duplicates were found
    if (packages.length !== validPackages.length) {
      console.log(`[install-packages] Cleaned packages: removed ${packages.length - validPackages.length} invalid/duplicate entries`);
      console.log(`[install-packages] Original:`, packages);
      console.log(`[install-packages] Cleaned:`, validPackages);
    }
    
    // Try to get sandbox - either from global or reconnect
    let sandbox = global.activeSandbox;
    
    if (!sandbox && sandboxId) {
      console.log(`[install-packages] Reconnecting to sandbox ${sandboxId}...`);
      const E2B_API_KEY = process.env.E2B_API_KEY;
      if (!E2B_API_KEY) {
        console.error('E2B_API_KEY not found in environment variables');
        return NextResponse.json({
          success: false,
          error: 'E2B API key not configured',
          code: 'MISSING_E2B_KEY'
        }, { status: 401 });
      }
      if (!/^e2b_/.test(E2B_API_KEY)) {
        console.error('E2B_API_KEY appears malformed. It should start with "e2b_"');
        return NextResponse.json({
          success: false,
          error: 'Invalid E2B API key format. It should start with "e2b_"',
          code: 'MALFORMED_E2B_KEY'
        }, { status: 401 });
      }
      try {
        sandbox = await Sandbox.connect(sandboxId, { apiKey: E2B_API_KEY });
        global.activeSandbox = sandbox;
        console.log(`[install-packages] Successfully reconnected to sandbox ${sandboxId}`);
      } catch (error: any) {
        const message = String(error?.message || error);
        const isUnauthorized = message.includes('401') || /unauthor/i.test(message) || /invalid api key/i.test(message);
        console.error(`[install-packages] Failed to reconnect to sandbox:`, error);
        return NextResponse.json({ 
          success: false, 
          error: isUnauthorized ? 'E2B authorization failed. Check E2B_API_KEY.' : `Failed to reconnect to sandbox: ${message}`,
          code: isUnauthorized ? 'E2B_UNAUTHORIZED' : 'E2B_CONNECT_FAILED'
        }, { status: isUnauthorized ? 401 : 500 });
      }
    }
    
    if (!sandbox) {
      return NextResponse.json({ 
        success: false, 
        error: 'No active sandbox available' 
      }, { status: 400 });
    }
    
    console.log('[install-packages] Installing packages:', packages);
    
    // Create a response stream for real-time updates
    const encoder = new TextEncoder();
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();
    
    // Function to send progress updates
    const sendProgress = async (data: any) => {
      const message = `data: ${JSON.stringify(data)}\n\n`;
      await writer.write(encoder.encode(message));
    };
    
    // Start installation in background
    (async (sandboxInstance) => {
      try {
        await sendProgress({ 
          type: 'start', 
          message: `Installing ${validPackages.length} package${validPackages.length > 1 ? 's' : ''}...`,
          packages: validPackages 
        });
        
        // Kill any existing Vite process first
        await sendProgress({ type: 'status', message: 'Stopping development server...' });
        
        await sandboxInstance.runCode(`
import subprocess
import os
import signal

# Try to kill any existing Vite process
try:
    with open('/tmp/vite-process.pid', 'r') as f:
        pid = int(f.read().strip())
        os.kill(pid, signal.SIGTERM)
        print("Stopped existing Vite process")
except:
    print("No existing Vite process found")
        `);
        
        // Check which packages are already installed
        await sendProgress({ 
          type: 'status', 
          message: 'Checking installed packages...' 
        });
        
        const checkResult = await sandboxInstance.runCode(`
import os
import json

os.chdir('/home/user/app')

# Read package.json to check installed packages
try:
    with open('package.json', 'r') as f:
        package_json = json.load(f)
    
    dependencies = package_json.get('dependencies', {})
    dev_dependencies = package_json.get('devDependencies', {})
    all_deps = {**dependencies, **dev_dependencies}
    
    # Check which packages need to be installed
    packages_to_check = ${JSON.stringify(validPackages)}
    already_installed = []
    need_install = []
    
    for pkg in packages_to_check:
        # Handle scoped packages
        if pkg.startswith('@'):
            pkg_name = pkg
        else:
            # Extract package name without version
            pkg_name = pkg.split('@')[0]
        
        if pkg_name in all_deps:
            already_installed.append(pkg_name)
        else:
            need_install.append(pkg)
    
    print(f"Already installed: {already_installed}")
    print(f"Need to install: {need_install}")
    print(f"NEED_INSTALL:{json.dumps(need_install)}")
    
except Exception as e:
    print(f"Error checking packages: {e}")
    print(f"NEED_INSTALL:{json.dumps(packages_to_check)}")
        `);
        
        // Parse packages that need installation
        let packagesToInstall = validPackages;
        
        // Check if checkResult has the expected structure
        if (checkResult && checkResult.results && checkResult.results[0] && checkResult.results[0].text) {
          const outputLines = checkResult.results[0].text.split('\n');
          for (const line of outputLines) {
            if (line.startsWith('NEED_INSTALL:')) {
              try {
                packagesToInstall = JSON.parse(line.substring('NEED_INSTALL:'.length));
              } catch (e) {
                console.error('Failed to parse packages to install:', e);
              }
            }
          }
        } else {
          console.error('[install-packages] Invalid checkResult structure:', checkResult);
          // If we can't check, just try to install all packages
          packagesToInstall = validPackages;
        }
        
        
        if (packagesToInstall.length === 0) {
          await sendProgress({ 
            type: 'success', 
            message: 'All packages are already installed',
            installedPackages: [],
            alreadyInstalled: validPackages
          });
          return;
        }
        
        // Install only packages that aren't already installed
        const packageList = packagesToInstall.join(' ');
        // Only send the npm install command message if we're actually installing new packages
        await sendProgress({ 
          type: 'info', 
          message: `Installing ${packagesToInstall.length} new package(s): ${packagesToInstall.join(', ')}`
        });
        
        const installResult = await sandboxInstance.runCode(`
import subprocess
import os

os.chdir('/home/user/app')

# Run npm install with output capture
packages_to_install = ${JSON.stringify(packagesToInstall)}
cmd_args = ['npm', 'install', '--legacy-peer-deps'] + packages_to_install

print(f"Running command: {' '.join(cmd_args)}")

process = subprocess.Popen(
    cmd_args,
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
    text=True
)

# Stream output
while True:
    output = process.stdout.readline()
    if output:
        print(output.strip())
    err = process.stderr.readline()
    if err:
        print(err.strip())
    if output == '' and err == '' and process.poll() is not None:
        break

return_code = process.wait()
print(f"INSTALL_EXIT_CODE:{return_code}")
        `);
        
        // Parse exit code
        let exitCode = 0;
        if (installResult && installResult.results && installResult.results[0] && installResult.results[0].text) {
          const out = installResult.results[0].text;
          const match = out.match(/INSTALL_EXIT_CODE:(\d+)/);
          if (match) {
            exitCode = parseInt(match[1], 10);
          }
        }
        
        if (exitCode !== 0) {
          await sendProgress({ type: 'error', message: `npm install failed with code ${exitCode}` });
        } else {
          await sendProgress({ type: 'success', message: 'Packages installed successfully', installedPackages: packagesToInstall });
        }
      } catch (e: any) {
        await sendProgress({ type: 'error', message: e?.message || 'Failed during installation' });
      } finally {
        try { await writer.close(); } catch {}
      }
    })(sandbox);

    return new Response(stream.readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
      },
    });
  } catch (error: any) {
    console.error('[install-packages] Error:', error);
    return NextResponse.json({ success: false, error: error?.message || 'Unknown error' }, { status: 500 });
  }
}