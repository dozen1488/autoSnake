const { Layer, Network } = require("synaptic");
const _ = require("lodash");

function trainNetwork(images = require("./images.json")) {
    const myNetwork = generateNetwork(1);
    
    const learningRate = 0.1;
    let img = 0;
    let tryNumber = 20;
    do {
        for (let i = 0; i < 5000; i++) {
            let networkDecision = myNetwork.activate(images[img].image);
            switch (images[img].result) {
                //  Result was wrong
                case -1:
                    networkDecision = [1, 1, 1];
                    networkDecision[images[img].decision + 1] = 0;
                    //  Rise all inputs, except decision
                    break;
                // Result was right
                case 1:
                    networkDecision = [0, 0, 0];
                    networkDecision[images[img].decision + 1] = 1;
                    //  Rise input, equals to decision
                    break;
            }
            myNetwork.propagate(learningRate, networkDecision);
        
            if (++img >= images.length) {
                img = 0;
            }
        }
    } while (checkDesitions(images, myNetwork) && tryNumber-- !== 0);
    if (tryNumber === 0) {
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

function checkDesitions(images, network) {
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
