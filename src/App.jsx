import { useEffect, useState } from "react";
import SwaggerClient from "swagger-client";
import spec from "@berufsbildung-basel/parkit-spec/api.yml";
import { developmentBaseUrl } from "../mock/conf.js";

function App() {
  const [serverMessage, setServerMessage] = useState(null);

  useEffect(() => {
    (async () => {
      // TODO provide client instance globally, and set correct servers in prod
      const client = await new SwaggerClient({
        spec: {
          ...spec,
          servers: [
            { url: `${developmentBaseUrl}/api`, description: "Test server" },
          ],
        },
      });

      client.apis.users
        .listUsers()
        .then((response) => {
          if (response?.ok) {
            setServerMessage(response.body.users[0].email);
          }
        })
        .catch((e) => {
          setServerMessage(
            `An error occurred: ${e.statusCode} - ${e.response.statusText}`
          );
        });
    })();
  }, []);

  return (
    <>
      <h1>Hello World</h1>
      {serverMessage && <p>{serverMessage}</p>}
    </>
  );
}

export default App;
