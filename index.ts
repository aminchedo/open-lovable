import 'dotenv/config'
import { Sandbox } from '@e2b/code-interpreter'

const apiKey = process.env.E2B_API_KEY
if (!apiKey) {
  console.error('E2B_API_KEY is not set. Please set it in .env or your environment. Get a key at https://e2b.dev/dashboard?tab=keys')
  process.exit(1)
}

if (!/^e2b_/.test(apiKey)) {
  console.error('E2B_API_KEY appears malformed. It should start with "e2b_". Get a valid key at https://e2b.dev/dashboard?tab=keys')
  process.exit(1)
}

try {
  const sbx = await Sandbox.create() // By default the sandbox is alive for 5 minutes
  const execution = await sbx.runCode('print("hello world")') // Execute Python inside the sandbox
  console.log(execution.logs)

  const files = await sbx.files.list('/')
  console.log(files)
} catch (error) {
  console.error('Failed to start E2B Sandbox:', error)
  process.exit(1)
}