import React from "react";
// import Aside from "./components/aside/Aside";
import Header from "./components/header/Header";
// import { Main } from "./components/main/Main";

const App: React.FC = () => {
  return (
    <div className="App">
      <div className="App-wrapper text-whiteRegular">
        {/* <Aside /> */}
        <Header />
        {/* <Main /> */}
      </div>
    </div>
  );
};

export default App;
