import { useEffect, useState } from "react";
import SwaggerClient from "swagger-client";
import spec from "../spec/api.json";

function App() {
  const [serverMessage, setServerMessage] = useState(null);

  useEffect(() => {
    (async () => {
      // TODO provide client instance globally
      const client = await new SwaggerClient({ spec });

      const response = await client.apis.users.listUsers();

      if (response.ok) {
        setServerMessage(response.body);
      }
    })();
  }, []);

  return (
    <>
      <h1>Hello World</h1>
      {serverMessage && <p>{serverMessage.users[0].email}</p>}
    </>
  );
}

export default App;
