import "./index.html";
import "./index.css";

import React from "react";
import ReactDOM from "react-dom";

import store from "./stores/store";
import initScript from "./initScript";
import BoardComponent from "./components/board";
import { x, y, radiusOfVisionForNetwork } from "./sharedConstants/configuration.json";

initScript(x, y, radiusOfVisionForNetwork);

ReactDOM.render(<BoardComponent
    store={store}
/>, document.getElementById("Application"));
