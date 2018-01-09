import React from "react";

import RednderReadme from "./readmeView";

import "./styles/spinnerVIew.css";

export default function renderSpinner() {
    return (
        <div id="root-container">
            <RednderReadme/>
            <div className="fulfilling-bouncing-circle-spinner">
                <div className="circle"></div>
                <div className="orbit"></div>
            </div>
        </div>
    );
}
