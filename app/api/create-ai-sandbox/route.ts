import { NextResponse } from 'next/server';
import { Sandbox } from '@e2b/code-interpreter';
import type { SandboxState } from '@/types/sandbox';
import { appConfig } from '@/config/app.config';

// Store active sandbox globally
declare global {
  var activeSandbox: any;
  var sandboxData: any;
  var existingFiles: Set<string>;
  var sandboxState: SandboxState;
}

export async function POST() {
  let sandbox: any = null;

  try {
    console.log('[create-ai-sandbox] Creating base sandbox...');
    
    // Kill existing sandbox if any
    if (global.activeSandbox) {
      console.log('[create-ai-sandbox] Killing existing sandbox...');
      try {
        await global.activeSandbox.kill();
      } catch (e) {
        console.error('Failed to close existing sandbox:', e);
      }
      global.activeSandbox = null;
    }
    
    // Clear existing files tracking
    if (global.existingFiles) {
      global.existingFiles.clear();
    } else {
      global.existingFiles = new Set<string>();
    }

    // Create base sandbox - we'll set up Vite ourselves for full control
    console.log(`[create-ai-sandbox] Creating base E2B sandbox with ${appConfig.e2b.timeoutMinutes} minute timeout...`);

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
      sandbox = await Sandbox.create({ 
        apiKey: E2B_API_KEY,
        timeoutMs: appConfig.e2b.timeoutMs
      });
    } catch (err: any) {
      const message = String(err?.message || err);
      const isUnauthorized = message.includes('401') || /unauthor/i.test(message) || /invalid api key/i.test(message);
      console.error('[create-ai-sandbox] Sandbox.create failed:', err);
      return NextResponse.json({
        success: false,
        error: isUnauthorized ? 'E2B authorization failed. Check E2B_API_KEY.' : `Failed to create sandbox: ${message}`,
        code: isUnauthorized ? 'E2B_UNAUTHORIZED' : 'E2B_CREATE_FAILED'
      }, { status: isUnauthorized ? 401 : 500 });
    }
    
    const sandboxId = (sandbox as any).sandboxId || Date.now().toString();
    const host = (sandbox as any).getHost(appConfig.e2b.vitePort);
    
    console.log(`[create-ai-sandbox] Sandbox created: ${sandboxId}`);
    console.log(`[create-ai-sandbox] Sandbox host: ${host}`);

    // Set up a basic Vite React app using Python to write files
    console.log('[create-ai-sandbox] Setting up Vite React app...');
    
    // Write all files in a single Python script to avoid multiple executions
    const setupScript = `
import os
import json

print('Setting up React app with Vite and Tailwind...')

# Create directory structure
os.makedirs('/home/user/app/src', exist_ok=True)

# Package.json
package_json = {
    "name": "sandbox-app",
    "version": "1.0.0",
    "type": "module",
    "scripts": {
        "dev": "vite --host",
        "build": "vite build",
        "preview": "vite preview"
    },
    "dependencies": {
        "react": "^18.2.0",
        "react-dom": "^18.2.0"
    },
    "devDependencies": {
        "@vitejs/plugin-react": "^4.0.0",
        "vite": "^4.3.9",
        "tailwindcss": "^3.3.0",
        "postcss": "^8.4.31",
        "autoprefixer": "^10.4.16"
    }
}

with open('/home/user/app/package.json', 'w') as f:
    json.dump(package_json, f, indent=2)
print('✓ package.json')

# Vite config for E2B - with allowedHosts
vite_config = """import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// E2B-compatible Vite configuration
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    hmr: false,
    allowedHosts: ['.e2b.app', 'localhost', '127.0.0.1']
  }
})"""

with open('/home/user/app/vite.config.js', 'w') as f:
    f.write(vite_config)
print('✓ vite.config.js')

# Tailwind config - standard without custom design tokens
tailwind_config = """/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}"""

with open('/home/user/app/tailwind.config.js', 'w') as f:
    f.write(tailwind_config)
print('✓ tailwind.config.js')

# PostCSS config
postcss_config = """export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}"""

with open('/home/user/app/postcss.config.js', 'w') as f:
    f.write(postcss_config)
print('✓ postcss.config.js')

# Index.html
index_html = """<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Sandbox App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>"""

with open('/home/user/app/index.html', 'w') as f:
    f.write(index_html)
print('✓ index.html')

# Main.jsx
main_jsx = """import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)"""

with open('/home/user/app/src/main.jsx', 'w') as f:
    f.write(main_jsx)
print('✓ src/main.jsx')

# App.jsx with explicit Tailwind test
app_jsx = """function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="text-center max-w-2xl">
        <p className="text-lg text-gray-400">
          Sandbox Ready<br/>
          Start building your React app with Vite and Tailwind CSS!
        </p>
      </div>
    </div>
  )
}

export default App"""

with open('/home/user/app/src/App.jsx', 'w') as f:
    f.write(app_jsx)
print('✓ src/App.jsx')

# Index.css with explicit Tailwind directives
index_css = """@tailwind base;
@tailwind components;
@tailwind utilities;

/* Force Tailwind to load */
@layer base {
  :root {
    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-text-size-adjust: 100%;
  }
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
  background-color: rgb(17 24 39);
}"""

with open('/home/user/app/src/index.css', 'w') as f:
    f.write(index_css)
print('✓ src/index.css')

print('\nAll files created successfully!')
`;

    // Execute the setup script
    await sandbox.runCode(setupScript);
    
    // Install dependencies
    console.log('[create-ai-sandbox] Installing dependencies...');
    await sandbox.runCode(`
import subprocess
import sys

print('Installing npm packages...')
result = subprocess.run(
    ['npm', 'install'],
    capture_output=True,
    text=True,
    cwd='/home/user/app'
)
print(result.stdout)
print(result.stderr)
if result.returncode != 0:
    raise SystemExit(result.returncode)
`);

    // Start Vite server
    console.log('[create-ai-sandbox] Starting Vite server...');
    await sandbox.runCode(`
import subprocess
import os

print('Starting Vite dev server...')

# Start the server in background and save PID
process = subprocess.Popen(['npm', 'run', 'dev'], cwd='/home/user/app')
with open('/tmp/vite-process.pid', 'w') as f:
    f.write(str(process.pid))
print('Vite dev server started with PID:', process.pid)
`);

    // Expose Vite port
    try {
      await sandbox.allowPort(appConfig.e2b.vitePort);
      console.log('[create-ai-sandbox] Port allowed:', appConfig.e2b.vitePort);
    } catch (e) {
      console.warn('[create-ai-sandbox] allowPort failed (non-fatal):', e);
    }

    // Cache references
    global.activeSandbox = sandbox;
    const sandboxId = (sandbox as any).sandboxId || Date.now().toString();
    const host = (sandbox as any).getHost(appConfig.e2b.vitePort);

    // Set timeout to auto-kill sandbox after timeout
    setTimeout(async () => {
      try {
        await sandbox.kill();
        console.log(`[create-ai-sandbox] Sandbox ${sandboxId} terminated due to timeout`);
      } catch (e) {
        console.error('Failed to terminate sandbox after timeout:', e);
      }
    }, appConfig.e2b.timeoutMs);

    return NextResponse.json({
      success: true,
      id: sandboxId,
      host,
      vitePort: appConfig.e2b.vitePort,
      timeoutMs: appConfig.e2b.timeoutMs
    });

  } catch (error: any) {
    console.error('[create-ai-sandbox] Error:', error);
    return NextResponse.json({
      success: false,
      error: error?.message || 'Unknown error creating sandbox'
    }, { status: 500 });
  }
}