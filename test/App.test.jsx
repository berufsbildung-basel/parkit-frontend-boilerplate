import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "../src/App.jsx";
import { rest } from "msw";
import TestRenderer from "react-test-renderer";
import { developmentBaseUrl } from "../mock/conf.js";
import SwaggerClient from "swagger-client";
import spec from "@berufsbildung-basel/parkit-spec/api.yml";

const baseUrl = developmentBaseUrl;

describe("Example test", () => {
  it("Fetches content from the mock API", async () => {
    render(<App />);

    await screen.findByText("someuser@adobe.com");
  });

  it("Handles error response", async (ctx) => {
    render(<App />);

    ctx.server.use(
      rest.get(`${baseUrl}/api/users`, (req, res, ctx) => {
        return res.once(ctx.status(403, "Forbidden"));
      })
    );

    await expect(screen.findByText("someuser@adobe.com")).rejects.toThrow();
    await screen.findByText("An error occurred: 403 - Forbidden");
  });

  it("Example Snapshot Test", async () => {
    let app;
    await TestRenderer.act(async () => {
      app = TestRenderer.create(<App />);
    });

    expect(app.toJSON()).toMatchSnapshot();
  });

  it("Example POST request", async () => {
    const client = await new SwaggerClient({
      spec: {
        ...spec,
        servers: [
          { url: `${developmentBaseUrl}/api`, description: "Test server" },
        ],
      },
      requestInterceptor: (request) => {
        request.headers["authorization"] = `Basic ${btoa(
          "test@adobe.com:testPassword"
        )}`;
        return request;
      },
    });

    client.apis.vehicles
      .createVehicle(
        {},
        {
          requestBody: {
            license_plate_number: "BL12354",
            make: "Tesla",
            model: "Model S",
            vehicle_type: "car",
            ev: true,
          },
        }
      )
      .then((response) => {});
  });
});
