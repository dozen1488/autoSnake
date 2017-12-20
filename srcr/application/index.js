import "./index.html";
import "./index.css";

import React from "react";
import ReactDOM from "react-dom";

import BoardComponent from "./components/board";

ReactDOM.render(<BoardComponent
    x={20}
    y={20}
    radiusOfVisionForNetwork={1}
/>, document.getElementById("Application"));
