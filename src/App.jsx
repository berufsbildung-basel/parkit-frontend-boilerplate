import { useEffect, useState } from "react";
import SwaggerClient from "swagger-client";
import spec from "../spec/api.json";

function App() {
  const [serverMessage, setServerMessage] = useState(null);

  useEffect(() => {
    (async () => {
      // TODO provide client instance globally
      const client = await new SwaggerClient({ spec });

      client.apis.users
        .listUsers()
        .then((response) => {
          if (response.ok) {
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
