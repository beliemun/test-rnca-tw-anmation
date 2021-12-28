import React from "react";
import { StatusBar } from "expo-status-bar";

import AnimationTest from "./AnimationTest";
import DragTest from "./DragTest";

const App = () => {
  return (
    <>
      <StatusBar style="auto" />
      <DragTest />
      {/* <AnimationTest /> */}
    </>
  );
};

export default App;
