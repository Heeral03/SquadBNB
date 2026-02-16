import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Allow external access via ngrok
    allowedHosts: [
          'localhost',
          '.ngrok-free.app',                     // wildcard for all ngrok .app domains
          '.ngrok-free.dev',                     // wildcard for .dev domains (your current one is .dev)
          'devon-actinometric-longingly.ngrok-free.dev '  // exact hostname (without https://)
        ],

    // Expose to all network interfaces (required for ngrok tunnel)
    host: true,

    // Enable CORS for dev (helps with any fetch/origin issues in Telegram)
    cors: true,

    // Optional: Strict port so it doesn't change
    strictPort: true,

    // Optional: HMR (hot module reload) over websocket - sometimes helps with tunnels
    hmr: {
      clientPort: 5173,  // or omit if not needed
    },
  }
})