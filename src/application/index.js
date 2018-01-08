import "./index.html";
import "./index.css";

import React from "react";
import ReactDOM from "react-dom";

import initScript from "./initScript";
import BoardComponent from "./components/board";
import { x, y, radiusOfVisionForNetwork } from "./sharedConstants/configuration.json";

initScript(x, y, radiusOfVisionForNetwork);

ReactDOM.render(<BoardComponent
    x={x}
    y={y}
    radiusOfVisionForNetwork={radiusOfVisionForNetwork}
/>, document.getElementById("Application"));
