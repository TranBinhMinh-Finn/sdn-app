import React, { useState, useEffect, useRef } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from '@mui/material/CardActions';
import Grid from "@mui/material/Grid";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Typography from '@mui/material/Typography';
import { MinDistanceRoute, AddCustomRule, showPath } from '../utils/FlowRuleUtils'
import { getDevices, getHosts, postBatchFlows } from "../utils/NetworkUtils";

function MainPage() {
  const [inputValue, setInputValue] = useState(60);

  const [deviceId, setDeviceId] = useState();
  const startDevice = useRef();
  const destinationDevice = useRef();
  const [path, setPath] = useState();
  const [hosts, setHosts] = useState([]);
  const [devices, setDevices] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectCount, setSelectCount] = useState(0);
  const src = useRef();
  const dst = useRef();
  const updateFieldChanged = index => e => {
    //console.log('index: ' + index);
    //console.log('property name: '+ e.target.name);
    let newArr = [...selectedOptions]; // copying the old datas array
    // a deep copy is not needed as we are overriding the whole object below, and not setting a property of it. this does not mutate the state.
    newArr[index] = e.target.value; // replace e.target.value with whatever you want to change it to
    //console.log(newArr)
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

  const removeElement = () => {
    let newArr = [...selectedOptions]; // copying the old datas array
    // a deep copy is not needed as we are overriding the whole object below, and not setting a property of it. this does not mutate the state.
    newArr.pop()// replace e.target.value with whatever you want to change it to
    //console.log(newArr)
    setSelectedOptions(newArr);
  }

  const handleSubmitDefault = () => {
    MinDistanceRoute(parseInt(inputValue))
    .then(
        alert("Add path successful")
    ).catch(
        err => alert("Add path failed")
    )
  };

  const handleSubmitFlow = () => {
    let input = [src.current.value]
    // console.log(input)
    let allResults = selectedOptions.flat();
    allResults.forEach((element) => {input.push(element)});
    // console.log(input)
    input.push(dst.current.value);
    AddCustomRule(input).then(
        res => res ? alert("Add path successful") : alert("Add path failed")
    ).catch(
        err => alert("Add path failed")
    );
  }

  const handleSubmitPaths = () => {
    console.log(startDevice.current)
    console.log(destinationDevice.current)
    showPath(startDevice.current.value, destinationDevice.current.value).then((res) => {
      // console.log(res);
      setPath(JSON.stringify(res));
    });
    // setPath(await )
  }

  return (
    <Grid container justifyContent="center" alignItems="center" style={{ minHeight: "100vh" }}>
    <Card sx={{ maxWidth: 345, margin: 10 }}>
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
            Add Custom Path
        </Typography>
        </CardContent>
        <CardContent>
          <div>
            <p>
              Source
            </p>
          <Select
            // value={selectedOptions[index]}
            // onChange={updateFieldChanged(index)}
            inputRef={src}
          >
            {
            hosts.map(host => (
                <MenuItem key = {host.mac} value={host.mac}>Host: {host.ipAddresses[0]}</MenuItem>
            ))
            }
          </Select>
          </div>
        
        <div>
          <p>
            Desination
          </p>
        <Select
            // value={selectedOptions[index]}
            // onChange={updateFieldChanged(index)}
            inputRef={dst}
          >
            {
            hosts.map(host => (
                <MenuItem key = {host.mac} value={host.mac}>Host: {host.ipAddresses[0]}</MenuItem>
            ))
            }
          </Select>
        </div>
        <div>
          <p>
            Path
          </p>
          {selectedOptions.map((selectedOption, index) => (
        <div key={index}>
          <Select
            value={selectedOptions[index]}
            onChange={updateFieldChanged(index)}
          >
            
            {devices.map(device => (
                <MenuItem key = {device.id} value={device.id}>Device: {device.id}</MenuItem>
            ))}
            {/* {
            hosts.map(host => (
                <MenuItem key = {host.mac} value={host.mac}>Host: {host.ipAddresses[0]}</MenuItem>
            ))
            } */}
          </Select>
        </div>
        ))}
        </div>
        
        </CardContent>
        <CardActions>
            <Button variant="contained" onClick={addSelectElement}>
                Add Device to Path
            </Button>
            <Button variant="contained" onClick={removeElement}>
                Remove
            </Button>
            <Button variant="contained" onClick={handleSubmitFlow}>Submit</Button>
        </CardActions>
    </Card>
    {/*
    <Card>
        <CardContent>
        <Typography variant="h5" component="div">
            Paths
        </Typography>
        </CardContent>
        <CardContent>
        <div>
        <Select
            inputRef={startDevice}
            // value={startDevice}
            // onChange={setStartDevice}
          >
            {devices.map(device => (
                <MenuItem key = {device.id} value={device.id}>Device: {device.id}</MenuItem>
            ))}
        </Select>
        </div>
        <div>
        <Select
          inputRef={destinationDevice}
            // value={destinationDevice}
            // onChange={setDestinationDevice}
          >
            {devices.map(device => (
                <MenuItem key = {device.id} value={device.id}>Device: {device.id}</MenuItem>
            ))}
          </Select>
        </div>
        
        </CardContent>
        <CardActions>
            <Button variant="contained" onClick={handleSubmitPaths}>
                Get Paths
            </Button>
        </CardActions>
        <CardContent>
            <Typography variant="p" component="div">
                {path}
            </Typography>
        </CardContent>
    </Card>
    */}
    </Grid>
  );
}

export default MainPage;
