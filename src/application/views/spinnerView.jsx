import React from "react";

import RenderReadme from "./readmeView";

import "./styles/spinnerVIew.css";

export default function renderSpinner() {
    return (
        <div id="root-container">
            <RenderReadme/>
            <div className="fulfilling-bouncing-circle-spinner">
                <div className="circle"></div>
                <div className="orbit"></div>
            </div>
        </div>
    );
}
