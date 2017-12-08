import {impulseBoard, networkReady} from '../actions/actions';
import {Network} from 'synaptic';

class Impulser {
    constructor(frequency = 1000) {
        this.frequency = frequency;
    }

    startImpulsing(action) {
        this.timer = setInterval(action, this.frequency);
    }

    stopImpulsing() {
        clearInterval(this.timer);
    }
}

class Requester {

    sendImages(images) {
        return fetch(
            '/applyImages', 
            {
                method: 'POST',
                body: JSON.stringify(images),
                headers: {
                    "Content-type": "application/json"
                }
            }
        ).then(() => console.log('ok'));
    }

    receiveNetwork(callback) {
        return fetch(
            '/getNetwork',
        ).then(
            (res) => {
                res
                    .json()
                    .then(res => callback(Network.fromJSON(res)))
            }
        );
    }

}

const imp = new Impulser();
const reg = new Requester();
export {
    imp as Impulser,
    reg as Requester
};