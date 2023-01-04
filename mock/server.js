// import apiDefinition from '../../spec/api.json'
import {setupServer} from "msw/node";
import {rest} from "msw";

export function getMockHandler(additionalHandler) {
  return async (req, res, ctx) => {
    const additionalHandlerResult = await additionalHandler(req, res, ctx)

    if (additionalHandlerResult) {
      return additionalHandlerResult
    }

    return res(ctx.status(200), ctx.body("The API response works!"))
  }
}

export function setupMockServer() {
  console.log('using mock server')
  const mockServer = setupServer(rest.all('http://localhost:1234/*', getMockHandler(() => {})));
  mockServer.listen()
  mockServer.printHandlers();
  return mockServer;
}
