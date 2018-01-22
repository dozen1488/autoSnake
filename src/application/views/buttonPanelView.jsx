import React from "react";
import Button from "./buttonView";

export default function ButtonPanel({ buttonArray }) {
    return (
        <div style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between"
        }}>
            {buttonArray.map(
                (buttonData, i) => <Button key={i} {...buttonData}/>
            )}
        </div>
    );
}
