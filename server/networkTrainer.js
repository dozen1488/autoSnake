const _ = require("lodash");
const { radiusOfVisionForNetwork } = require("../config.json");
const generateNetwork = require("../crossPlatformModels/generateNetwork");

function trainNetwork(network, images = require("./images.json")) {
    const myNetwork = network || generateNetwork(
        radiusOfVisionForNetwork,
        radiusOfVisionForNetwork
    );

    const learningRate = 0.1;
    let img = 0;
    let tryNumber = 20;
    if (images.length > 0) {
        do {
            for (let i = 0; i < 2000; i++) {
                let networkDecision = myNetwork.activate(images[img].image);
                const result = images[img].result;
                if (result < 0) {
                    //  Result was wrong
                    networkDecision = [1, 1, 1];
                    networkDecision[images[img].decision + 1] = 0;
                    //  Rise all inputs, except decision
                } else if (result > 0) {
                    // Result was right
                    networkDecision = [0, 0, 0];
                    networkDecision[images[img].decision + 1] = 1;
                    //  Rise input, equals to decision
                }
                myNetwork.propagate(learningRate, networkDecision);

                if (++img >= images.length) {
                    img = 0;
                }
            }
        } while (checkDesitions(images, myNetwork) && --tryNumber !== 0);
        if (tryNumber === 0) {
            console.log("Network untrainable");
        }
    }

    return myNetwork;
}

module.exports = trainNetwork;

function checkDesitions(images, network) {
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

    return _.reduce(results, (res, val) => {
        return res + !val;
    }, 0);
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
