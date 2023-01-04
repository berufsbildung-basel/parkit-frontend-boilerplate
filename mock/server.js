import {setupServer} from "msw/node";
import {rest} from "msw";
import {OpenAPIBackend} from "openapi-backend";
import path, {dirname} from "path";
import {fileURLToPath} from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const api = new OpenAPIBackend({ definition: path.join(__dirname, '..', 'spec', 'api.yaml') });
api.register('notFound', (c, res, ctx) => {
  console.log("Not Found")
  return res(ctx.status(404));
});
api.register('notImplemented', async (c, res, ctx) => {
  const { status, mock } = api.mockResponseForOperation(c.operation.operationId);
  console.log("Not Implemented")
  ctx.status(status);
  return res(ctx.json(mock));
});

export function setupMockServer() {
  console.log('using mock server')
  const mockServer = setupServer(rest.all('http://localhost:1234/*', async (req, res, ctx) => {
    console.log(`Handling ${req.url.pathname}`)
    return api.handleRequest(
      {
        path: req.url.pathname.replace(/^\/api/, ''),
        query: req.url.search,
        method: req.method,
        body: req.bodyUsed ? await req.json() : null,
        headers: {...req.headers.raw},
      },
      res,
      ctx,
    );
  }));
  mockServer.listen()
  mockServer.printHandlers();
  return mockServer;
}
