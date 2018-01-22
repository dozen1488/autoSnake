import React from "react";
import "./styles/buttonView.css";

export default function Button({innerText, onClickAction}) {
    return (
        <button className="button" onClick={onClickAction}>
            {innerText}
        </button>
    );
}
