import { createServer } from 'vite';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import {setupMockServer} from "../mock/server.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

async function setupViteDevServer() {
  const server = await createServer({
    configFile: path.join(__dirname, '..', 'vite.config.js'),
    root: path.join(__dirname, '..'),
    server: {
      port: 1234,
      proxy: {
        '/api': {
          target: 'http://localhost:1234/',
          rewrite: (path) => path.replace(/^\/api/, ''),
        }
      }
    },
  });

  await server.listen();

  server.printUrls();
}

await setupMockServer()
await setupViteDevServer()



