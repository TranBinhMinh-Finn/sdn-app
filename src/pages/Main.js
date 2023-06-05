import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from '@mui/material/CardActions';
import Grid from "@mui/material/Grid";
import Typography from '@mui/material/Typography';
import { MinDistanceRoute } from '../utils/FlowRuleUtils'
function MainPage() {
  const [inputValue, setInputValue] = useState(60);

  const handleSubmit = () => {
    MinDistanceRoute(parseInt(inputValue))
    .then(
        alert("Add flow successful")
    ).catch(
        err => alert("Add flow unsuccessful")
    )
  };

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
        <Button variant="contained" onClick={handleSubmit}>Set Default Flow</Button>
      </CardActions>
    </Card>
    </Grid>
  );
}

export default MainPage;
