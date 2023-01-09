import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "../src/App.jsx";
import { rest } from "msw";
import TestRenderer from "react-test-renderer";
import { developmentBaseUrl } from "../mock/conf.js";

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
});
