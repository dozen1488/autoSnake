const {Layer, Network} = require('synaptic');

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

module.exports = generateNetwork;