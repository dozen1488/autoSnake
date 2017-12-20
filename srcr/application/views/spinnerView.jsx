import React from "react";
import "./styles/spinnerVIew.css";

export default function spinner() {
    return <div className="fulfilling-bouncing-circle-spinner">
        <div className="circle"></div>
        <div className="orbit"></div>
    </div>;
}
