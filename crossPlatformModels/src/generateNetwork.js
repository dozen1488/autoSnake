
const { NeuralNetwork } = require("brain.js");

function generateNetwork(n, m, framesNumber, actionNumber) {
    const size = framesNumber * ((n * 2 + 1) * (m * 2 + 1)) + actionNumber;

    const inputLayer = new Layer(size);
    const hiddenLayer1 = new Layer(size);
    const hiddenLayer2 = new Layer(size);
    const outputLayer = new Layer(1);

    inputLayer.project(hiddenLayer1);
    hiddenLayer1.project(hiddenLayer2);
    hiddenLayer2.project(outputLayer);

    return new Network({
        input: inputLayer,
        hidden: [hiddenLayer1, hiddenLayer2],
        output: outputLayer
    });
}

function generateStateNetwork(n, m, actionNumber) {
    const size = ((n * 2 + 1) * (m * 2 + 1)) + actionNumber + actionNumber;

    const config = {
        inputSize: size,
        outputSize: size - actionNumber,
        hiddenLayers: [size, size], // array of ints for the sizes of the hidden layers in the network
        activation: 'sigmoid', // supported activation types: ['sigmoid', 'relu', 'leaky-relu', 'tanh'],
        leakyReluAlpha: 0.001, // supported for activation type 'leaky-relu'
    }

    const network = new NeuralNetwork(config);
    network.initialize();
    
    return network;
}

function generateRewardNetwork(n, m, actionNumber) {
    const size = (n * 2 + 1) * (m * 2 + 1) + actionNumber + actionNumber;

    const config = {
        inputSize: size,
        outputSize: 1,
        hiddenLayers: [size, size], // array of ints for the sizes of the hidden layers in the network
        activation: 'sigmoid', // supported activation types: ['sigmoid', 'relu', 'leaky-relu', 'tanh'],
        leakyReluAlpha: 0.001, // supported for activation type 'leaky-relu'
    }

    const network = new NeuralNetwork(config);
    
    network.initialize();

    return network;
}

module.exports = { generateNetwork, generateRewardNetwork, generateStateNetwork };
