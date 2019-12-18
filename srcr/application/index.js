import "./index.html";
import "./index.css";

import React from "react";
import ReactDOM from "react-dom";
import rotateMatrix from 'rotate-matrix';

import BoardComponent from "./components/board";
import { x, y } from "./sharedConstants/configuration.json";
import { radiusOfVisionForNetwork } from "../../config.json";

window.rotate = (arrays) => rotateMatrix(arrays, 3);

ReactDOM.render(<BoardComponent
    x={x}
    y={y}
    radiusOfVisionForNetwork={radiusOfVisionForNetwork}
/>, document.getElementById("Application"));
