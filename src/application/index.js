import "./index.html";
import "./index.css";

import React from "react";
import ReactDOM from "react-dom";

import store from "./stores/store";
import BoardComponent from "./components/board";

ReactDOM.render(<BoardComponent
    store={store}
/>, document.getElementById("Application"));
