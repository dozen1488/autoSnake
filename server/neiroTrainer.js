const {Layer, Network} = require('synaptic');
const _ = require('lodash');

function trainNetwork(images = require('./images.json')) {
    const myNetwork = generateNetwork(3);
    
    const learningRate = 0.1;
    let img = 0;
    for (let i = 0; i < 200; i++) {
        myNetwork.activate(images[img].image);
        let resultArray = [0, 0, 0];
        switch(images[img].result) {
            case -1:
                resultArray[images[img].decision + 1] = -1;
            break;
            case 1:
                resultArray[images[img].decision + 1] = 1;
            break;
        }
        myNetwork.propagate(learningRate, resultArray);    
    
        if(++img >= images.length) {
            img = 0;
        }
    }
    return myNetwork.toJSON();
}

function generateNetwork(n){
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