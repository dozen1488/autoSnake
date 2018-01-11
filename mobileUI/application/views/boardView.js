import React from "react";
import { PropTypes } from "prop-types";
import { StyleSheet, Text, View } from "react-native";

export default class BoardView extends React.Component{
    
    static propTypes = {
        board: PropTypes.array,
        actions: PropTypes.object
    };
    
    render() {
        return (
            <View>
                <Text> Hello World </Text>
            </View>
        );
    }
}

