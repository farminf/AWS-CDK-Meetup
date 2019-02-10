/* eslint-disable react/jsx-filename-extension */
import React, { Component } from "react";
import "./App.css";

const App = props => {
  const callAPI = async () => {
    const result = await fetch(process.env.REACT_APP_API_ROOT);
    const response = await result.json();
    console.log(response);
  };

  return (
    <div className="main_div">
      <button className="button" onClick={callAPI}>
        Call API
      </button>
    </div>
  );
};

export default App;
