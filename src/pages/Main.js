import React, { useState } from "react";
import { styled } from "@mui/system";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

const StyledButton = styled(Button)`
  background-color: green;
  width: 150px;
  height: 50px;
  border: none;
  border-radius: 10px;
  color: white;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
`;

function MainPage() {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = () => {
    if (inputValue) {
      new Notification("Input Value", {
        body: inputValue,
      });
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <TextField
        label="Input"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <Button variant="contained" onClick={handleSubmit}>Submit</Button>
    </Box>
  );

}

export default MainPage;
