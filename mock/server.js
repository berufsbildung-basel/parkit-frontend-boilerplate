import { setupServer } from "msw/node";
import { rest } from "msw";
import { OpenAPIBackend } from "openapi-backend";
import path, { dirname } from "path";
import { fileURLToPath } from "node:url";
import { developmentBaseUrl } from "./conf.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const api = new OpenAPIBackend({
  definition: path.join(
    __dirname,
    "..",
    "node_modules",
    "@berufsbildung-basel",
    "parkit-spec",
    "api.yml"
  ),
});
api.register("notFound", (c, res, ctx) => {
  return res(ctx.status(404));
});
api.register("notImplemented", async (c, res, ctx) => {
  const mockStatusCode = c.request.headers["x-test-response-code"];
  const mockStatusText = c.request.headers["x-test-response-text"];

  if (mockStatusCode) {
    return res(ctx.status(mockStatusCode, mockStatusText));
  }

  const { status, mock } = api.mockResponseForOperation(
    c.operation.operationId
  );
  ctx.status(status);
  return res(ctx.json(mock));
});

export function setupMockServer() {
  console.log("using mock server");
  const mockServer = setupServer(
    rest.all(`${developmentBaseUrl}/*`, async (req, res, ctx) => {
      return api.handleRequest(
        {
          path: req.url.pathname.replace(/^\/api/, ""),
          query: req.url.search,
          method: req.method,
          body: req.bodyUsed ? await req.json() : null,
          headers: { ...req.headers.raw() },
        },
        res,
        ctx
      );
    })
  );
  mockServer.listen();
  mockServer.printHandlers();
  return mockServer;
}
