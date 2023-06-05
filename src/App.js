import React from "react";
import MainPage from "./pages/Main";

function App() {
  React.useEffect(() => {
    Notification.requestPermission();
  }, []);

  return (
    <div>
      <MainPage />
    </div>
  );
}

export default App;
