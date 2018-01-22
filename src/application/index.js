import "./index.html";
import "./index.css";

import React from "react";
import ReactDOM from "react-dom";

import { Store } from "./stores/store";
import BoardComponent from "./components/board";

ReactDOM.render(<BoardComponent
    store={Store}
/>, document.getElementById("Application"));
