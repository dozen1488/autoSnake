import React from "react";
import { fromJS } from "immutable";
import { StyleSheet, Text, View, Dimensions, ScrollView } from "react-native";

import store from "./application/stores/store";
import RootComponent from "./application/components/board"

export default class App extends React.Component {
    render() {
        return <ScrollView style={styles.container}>
            <RootComponent store={store}/>
        </ScrollView>;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff"
    },
});
