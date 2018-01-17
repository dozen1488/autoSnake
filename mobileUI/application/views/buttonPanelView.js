import React from "react";
import { View, Text } from "react-native";
import { Switch } from "react-native-switch";

export default class ButtonPanel extends React.PureComponent {
    render() {
        return (
            <View style={
                {
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "space-around",
                    padding: 10
                }
            }>
                <View style={{
                        flexDirection: "row",
                        justifyContent: "space-around"
                    }}>
                    <Text style={{ alignSelf: "center" }}>
                        Click produces:
                    </Text>
                    <Switch {
                        ...{
                            value: this.props.toggleState,
                            backgroundActive: "red",
                            backgroundInactive: "green",
                            activeText: "wall",
                            inActiveText: "food",
                            circleSize: 40,
                            onValueChange: this.props.actions.onToggle
                        }
                    }
                    />
                </View>
                <View style={{
                    flexDirection: "row",
                    justifyContent: "space-around"
                }}>
                    <Text style={{ alignSelf: "center" }}>
                        Game state to:
                    </Text>
                    <Switch {
                        ...{
                            value: this.props.isPaused,
                            backgroundActive: "red",
                            backgroundInactive: "green",
                            activeText: "Run",
                            inActiveText: "Stop",
                            circleSize: 40,
                            onValueChange: this.props.actions.spacePressed
                        }
                    } />
                </View>
            </View>
        );
    }
}
