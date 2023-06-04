import {useState, useEffect} from 'react'
import axios from 'axios'
import './App.css';
import {getDevices} from "./utils/NetworkUtils";

function App() {
    const [data, setData] = useState();
    useEffect(() => {
        getDevices().then((res) => {
            setData(res.data);
        }).catch((err) => {});
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
