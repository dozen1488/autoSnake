import "./index.html";
import "./index.css";

import React from "react";
import ReactDOM from "react-dom";

import BoardComponent from "./components/board";
import { x, y, radiusOfVisionForNetwork } from "./sharedConstants/configuration.json";

ReactDOM.render(<BoardComponent
    x={x}
    y={y}
    radiusOfVisionForNetwork={radiusOfVisionForNetwork}
/>, document.getElementById("Application"));
