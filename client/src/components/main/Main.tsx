import React from "react";
import { Routes, Route } from "react-router-dom";

const Main: React.FC = () => {
  return (
    <main className="bg-blue-500">
      <div className="container">
        <div className="Main-wrapper">
          <Routes>
            <Route path="/" element={<div>I AM HOME</div>} />
            <Route path="/test" element={<div>I AM TEST</div>} />
          </Routes>
        </div>
      </div>
    </main>
  );
};

export default Main;
