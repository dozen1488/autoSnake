import React from "react";
import RednderReadme from "./readmeView";

export default function renderDeadSnake() {
    return (
        <div id="root-container">
            <RednderReadme/>
            <p className="readme-header">
                Snake has died. Refresh page please
            </p>
        </div>
    );
}
