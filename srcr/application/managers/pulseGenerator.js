import {impulseBoard} from '../actions/actions';

class Impulser {
    constructor(frequency = 1000) {
        this.timer = setInterval(impulseBoard, frequency);
    }

    stopImpulsing() {
        clearInterval(this.timer);
    }
}

export default new Impulser();