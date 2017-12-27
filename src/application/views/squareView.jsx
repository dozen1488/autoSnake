import React from "react";
import PropTypes from "prop-types";
import ImageUrls from "../sharedConstants/ImageUrls";

export default class Square extends React.PureComponent {

    static propTypes = {
        x: PropTypes.number,
        y: PropTypes.number,
        status: PropTypes.number,
        actions: PropTypes.object,
        stateUpdate: PropTypes.func
    }

    render() {
        return (
            <img src={ImageUrls[this.props.status]}
                draggable="false"
                onMouseOver={() => {
                    this.props.actions.onHover(this.props.x, this.props.y);
                }}
                onMouseDown={({ button }) => {
                    this.props.actions.onClick(this.props.x, this.props.y, button);
                }}
                onMouseUp={() => {
                    this.props.actions.onRelease();
                }}
            />
        );
    }
}
