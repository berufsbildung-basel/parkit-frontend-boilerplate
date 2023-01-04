import { useEffect, useState } from 'react';
import { fetch } from 'cross-fetch';

// TODO make globally available
const baseURL = 'http://localhost:1234'

function App() {
  const [serverMessage, setServerMessage] = useState(null)

  useEffect(() => {
    (async () => {
      console.log('fetching');

      const res = await fetch(`${baseURL}/api/test`)
      console.log(res.status)
      const text = await res.text();
      console.log(text);
      setServerMessage(text);
    })();
  });

  return <>
    <h1>Hello World</h1>
    { serverMessage && <p>{serverMessage}</p> }
  </>
}

export default App
