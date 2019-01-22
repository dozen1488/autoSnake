const _ = require("lodash");
const { QLearner } = require('../crossPlatformModels/dist/qLearningClass');

function trainNetwork(qLearner) {
    qLearner.adjustNetwork();

    return qLearner.network;
}

module.exports = trainNetwork;

function isValidDesitions(images, network) {
    const results = images.map(image => {
        const decision = getTurn(image.image, network);
        const result = image.result;
        if (result < 0) {
            return decision !== image.decision;
        } else if (result > 0) {
            return decision === image.decision;
        }

        return true;
    });

    const numberOfErrors = _.reduce(
        results,
        (accum, val) => {
            return accum + !val;
        },
        0
    );

    return ((numberOfErrors / images.length) < 0.1);
}

function getTurn(image, network) {
    const networkAnswer = network.activate(image);

    //  Find an index of the most value in array
    const { index: resultIndex } = networkAnswer.reduce(
        ({ index, maxValue }, currValue, currIndex) => {
            if (currValue >= maxValue) {
                return {
                    index: currIndex,
                    maxValue: currValue
                };
            } else {
                return { index, maxValue };
            }
        }, {
            index: -1,
            maxValue: -Infinity
        }
    );

    //  Map value to turn
    return resultIndex - 1;
}
