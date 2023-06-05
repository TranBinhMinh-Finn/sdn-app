import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from '@mui/material/CardActions';
import Grid from "@mui/material/Grid";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Typography from '@mui/material/Typography';
import { MinDistanceRoute } from '../utils/FlowRuleUtils'
import { getDevices, getHosts, postBatchFlows } from "../utils/NetworkUtils";

function MainPage() {
  const [inputValue, setInputValue] = useState(60);

  const [deviceId, setDeviceId] = useState();
  const [portOut, setPortOut] = useState();
  const [destinationMac, setDestinationMac] = useState();
  const [timeout, setTimeout] = useState(60);
  const [hosts, setHosts] = useState([]);
  const [devices, setDevices] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectCount, setSelectCount] = useState(0);

  const updateFieldChanged = index => e => {
    console.log('index: ' + index);
    console.log('property name: '+ e.target.name);
    let newArr = [...selectedOptions]; // copying the old datas array
    // a deep copy is not needed as we are overriding the whole object below, and not setting a property of it. this does not mutate the state.
    newArr[index] = e.target.value; // replace e.target.value with whatever you want to change it to
    console.log(newArr)
    setSelectedOptions(newArr);
  }
  
  useEffect(() => {
    const retrieve = async () => {
        const hostsList = await getHosts();
        const devicesList = await getDevices();
        setHosts(hostsList.data.hosts);
        setDevices(devicesList.data.devices);
    }
    retrieve()
  }, []);

  useEffect(() => {
    console.log('selectedOptions is updated:', selectedOptions);
  }, [selectedOptions]);
  
  const addSelectElement = () => {
    setSelectCount(selectCount + 1);
    selectedOptions.push(hosts[0].mac);
  };

  const handleSubmitDefault = () => {
    MinDistanceRoute(parseInt(inputValue))
    .then(
        alert("Add flow successful")
    ).catch(
        err => alert("Add flow unsuccessful")
    )
  };

  const handleSubmitFlow = () => {
    const allResults = selectedOptions.flat();
    console.log(allResults)
  }

  return (
    <Grid container justifyContent="center" alignItems="center" style={{ minHeight: "100vh" }}>
    <Card sx={{ maxWidth: 345 }}>
      <CardContent>
        <Typography variant="h5" component="div">
            Default Flow (Dijkstra)
        </Typography>
    </CardContent>
    <CardContent>
        <TextField
            label="Delay"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
        />
    </CardContent>
    <CardActions>
        <Button variant="contained" onClick={handleSubmitDefault}>Set Default Flow</Button>
      </CardActions>
    </Card>
    <Card>
        <CardContent>
        <Typography variant="h5" component="div">
            Add Flow
        </Typography>
        </CardContent>
        <CardContent>
        {selectedOptions.map((selectedOption, index) => (
        <div key={index}>
          <Select
            value={selectedOptions[index]}
            onChange={updateFieldChanged(index)}
          >
            {hosts.map(host => (
                <MenuItem key = {host.mac} value={host.mac}>Host: {host.mac}</MenuItem>
            ))}
            {devices.map(device => (
                <MenuItem key = {device.id} value={device.id}>Device: {device.id}</MenuItem>
            ))}
          </Select>
        </div>
        ))}
        </CardContent>
        <CardActions>
            <Button variant="contained" onClick={addSelectElement}>
                Add to Flow
            </Button>
            <Button variant="contained" onClick={handleSubmitFlow}>Submit</Button>
        </CardActions>
    </Card>
    </Grid>
  );
}

export default MainPage;
