const { Layer, Network } = require("synaptic");
const _ = require("lodash");

const learningConfiguration = {
    learningRate: 0.1,
    epochMaxNumber: 2000,
    maxIterationNumber: 5000,
    radiusOfVision: 1
};

function trainNetwork(
    images = [], {
        maxIterationNumber,
        radiusOfVision,
        learningRate,
        epochMaxNumber
    } = learningConfiguration
) {
    const myNetwork = generateNetwork(radiusOfVision);

    let epochNumber = 0;
    do {
        for (let i = 0, border = (maxIterationNumber > images.length)
            ? images.length : maxIterationNumber;
            i < border;
            i++
        ) {
            if (!images[i]) continue;
            const { image, result, decision } = images[i];
            if (
                _.isUndefined(image) ||
                _.isUndefined(result) ||
                _.isUndefined(decision)
            )
                continue;
            let networkDecision = myNetwork.activate(image);
            switch (result) {
                //  Result was wrong
                case -1:
                    //  Rise all inputs, except decision
                    networkDecision = [1, 1, 1];
                    networkDecision[decision + 1] = 0;
                    break;
                // Result was right
                case 1:
                    //  Rise input, equals to decision
                    networkDecision = [0, 0, 0];
                    networkDecision[decision + 1] = 1;
                    break;
            }

            myNetwork.propagate(learningRate, networkDecision);
        }
    } while (
        !checkDecisions(images, myNetwork) &&
        epochNumber++ <= epochMaxNumber
    );
    if (!checkDecisions(images, myNetwork)) {
        console.log("Network untrainable");
    }

    return myNetwork.toJSON();
}

function generateNetwork(n) {
    const size = (n * 2 + 1) * (n * 2 + 1);
    const inputLayer = new Layer(size);
    const hiddenLayer = new Layer(size);
    const outputLayer = new Layer(3);

    inputLayer.project(hiddenLayer);
    hiddenLayer.project(outputLayer);

    return new Network({
        input: inputLayer,
        hidden: [hiddenLayer],
        output: outputLayer
    });
}

module.exports = trainNetwork;

function checkDecisions(images, network) {
    const results = images.map(image => {
        const decision = getTurn(image.image, network);
        switch (image.result) {
            case -1:
                return decision !== image.decision;
            case 1:
                return decision === image.decision;
        }

        return true;
    });

    // 1 - decision are right, 0 - some are wrong
    return !_.reduce(results, (res, val) => {
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
