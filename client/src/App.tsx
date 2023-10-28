import React from "react";
// import Aside from "./components/aside/Aside";
import Header from "./components/header/Header";
// import Card from "./components/card/Card";
import Row from "./components/row/Row";
// import Main from "./components/main/Main";

const App: React.FC = () => {
  return (
    <div className="App">
      <div className="App-wrapper text-whiteRegular">
        {/* <Aside /> */}
        <Header />
        <div className="container">
          <div className="my-12">
            <Row />
          </div>
        </div>
        {/* <Main /> */}
      </div>
    </div>
  );
};

export default App;
