import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from '@mui/material/CardActions';
import Grid from "@mui/material/Grid";
import Typography from '@mui/material/Typography';
import { MinDistanceRoute } from '../utils/FlowRuleUtils'
import { postBatchFlows } from "../utils/NetworkUtils";

function MainPage() {
  const [inputValue, setInputValue] = useState(60);

  const [deviceId, setDeviceId] = useState();
  const [portOut, setPortOut] = useState();
  const [destinationMac, setDestinationMac] = useState();
  const [timeout, setTimeout] = useState(60);

  const handleSubmitDefault = () => {
    MinDistanceRoute(parseInt(inputValue))
    .then(
        alert("Add flow successful")
    ).catch(
        err => alert("Add flow unsuccessful")
    )
  };

  const handleSubmitFlow = () => {
    let flows = [];
    flows.push({
        // appId: ONOS_APPID,
        priority: 10,
        isPermanent: false,
        timeout: isNaN(timeout) ? 60 : timeout,
        deviceId: deviceId,
        treatment: {
            instructions: [
                {
                    type: "OUTPUT",
                    port: portOut,
                },
            ],
        },
        selector: {
            criteria: [
                {
                    type: "ETH_DST",
                    mac: destinationMac,
                },
            ],
        },
    });
    postBatchFlows({ flows: flows });
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
            <TextField
                label="Device Id"
                value={deviceId}
                onChange={(e) => setDeviceId(e.target.value)}
            />
            <TextField
                label="Port"
                value={portOut}
                onChange={(e) => setPortOut(e.target.value)}
            />
            <TextField
                label="Destination MAC"
                value={destinationMac}
                onChange={(e) => setDestinationMac(e.target.value)}
            />
            <TextField
                label="Timeout"
                value={timeout}
                onChange={(e) => setTimeout(e.target.value)}
            />
        </CardContent>
        <CardActions>
            <Button variant="contained" onClick={handleSubmitFlow}>Add</Button>
        </CardActions>
    </Card>
    </Grid>
  );
}

export default MainPage;
