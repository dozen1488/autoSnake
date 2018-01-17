import PropTypes from "prop-types";
import React, { PureComponent } from "react";
import { View, Dimensions } from "react-native";

import * as Styles from "./styles/boardView";
import Square from "./squareView";
import RenderReadme from "./readmeView";
import ButtonPanel from "./buttonPanelView";

class RenderBoard extends PureComponent {
    render() {
        const { board, actions } = this.props;
        const rows = board.get(0).size;

        const edgeSize = Dimensions.get("window").width / rows;

        return (
            <View style={Styles.columnBoardView}>
                {board.map((arr, row) =>
                    (<View key={row} style={Styles.rowBoardView}>
                        {arr.map((none, column) => {
                            const status = board.get(column).get(rows - row - 1);

                            return (
                                <Square
                                    key={column}
                                    status={status}
                                    x={column}
                                    y={rows - row - 1}
                                    actions={actions}
                                    style={{
                                        width: edgeSize,
                                        height: edgeSize
                                    }}
                                />
                            );
                        })}
                    </View>)
                )}
            </View>
        );
    }
}


RenderBoard.propTypes = {
    rows: PropTypes.number,
    columns: PropTypes.number,
    board: PropTypes.object,
    actions: PropTypes.objectOf(PropTypes.func),
};

export default class RootComponent extends PureComponent {
    render() {
        return (
            <View>
                <RenderReadme/>
                <ButtonPanel
                    actions={this.props.actions}
                    isPaused={this.props.gameState.isPaused}
                    toggleState={this.props.toggleState}
                />
                <RenderBoard {...this.props}/>
            </View>
        );
    }
}
