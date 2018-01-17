import { Image, TouchableHighlight } from "react-native";
import PropTypes from "prop-types";
import React, { PureComponent } from "react";

import ImageUrls from "../sharedConstants/ImageUrls";

export default class Square extends PureComponent {

    static propTypes = {
        x: PropTypes.number,
        y: PropTypes.number,
        status: PropTypes.number,
        actions: PropTypes.object,
    }

    render() {
        return (
            <TouchableHighlight
                onPress={() => this.props.actions.onClick(this.props.x, this.props.y)}
            >
                <Image
                    source={ImageUrls[this.props.status]}
                    style={this.props.style}
                />
            </TouchableHighlight>
        );
    }
}
