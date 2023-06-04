import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css';

function App() {
  const [data, setData] = useState();
  const [error, setError] = useState();
  const header = {
    Authorization: 'Basic b25vczpyb2Nrcw==',
    mode: 'no-cors',
  }
  const config = {
      headers: header
  }
  useEffect(() => {
    axios.get("http://192.168.58.128:8181/onos/v1/devices", {
      headers: header
    })
      .then((response) => {
        setData(response.data);
        console.log(data)
        setError(null);
      })
      .catch(setError);
  }, []);

  return (
    <div>
        <p>
          {JSON.stringify(data)}
        </p>
      
    </div>
  );
}

export default App;
