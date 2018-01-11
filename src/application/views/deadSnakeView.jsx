import React from "react";
import RenderReadme from "./readmeView";

export default function renderDeadSnake() {
    return (
        <div id="root-container">
            <RenderReadme/>
            <p className="readme-header">
                Snake has died. Refresh page please
            </p>
        </div>
    );
}
