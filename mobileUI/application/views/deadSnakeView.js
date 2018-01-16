import React, { PureComponent } from "react";
import { View, Text } from "react-native";

import RenderReadme from "./readmeView";

export default class DeadSnakeComponent extends PureComponent {
    render() {
        return (
            <View>
                <RenderReadme/>
                <Text> Snake has died </Text>
            </View>
        );
    }
}
