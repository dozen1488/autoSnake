import _ from "lodash";

class Impulser {

    constructor() {
        this._timers = [];
    }

    isImpulsing() {
        return (this._timers.length > 0);
    }

    startImpulsing(action, frequency = 1000) {
        const timer = setInterval(action, frequency);
        this._timers.push(timer);

        return timer;
    }

    stopImpulsing(timer) {
        if (!timer) {
            this._timers.forEach(t => clearInterval(t));
            this._timers = [];

            return true;
        }
        const foundTimer = this._timers.find(t => t === timer);
        if (foundTimer) {
            clearInterval(foundTimer);
            _.remove(this._timers, t => t === foundTimer);

            return true;
        } else {
            return false;
        }
    }
}

export default new Impulser();
