import _ from "lodash";

const URLS = {
    APPLY_IMAGES: "/applyImages",
    GET_NETWORK: "/getNetwork"
};

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

class Requester {

    sendImages(images) {
        return fetch(
            URLS.APPLY_IMAGES,
            {
                method: "POST",
                body: JSON.stringify(images),
                headers: {
                    "Content-type": "application/json"
                }
            }
        );
    }

    receiveNetwork(callback) {
        return fetch(
            URLS.GET_NETWORK,
        ).then(
            (res) => {
                res
                    .json()
                    .then(res => callback(res));
            }
        );
    }

}

class KeyboardListener {
    constructor(code = "Space") {
        this._codes = [];
        this._codes.push(code);
        this._listener = null;
    }

    startListening(callback) {
        this._listener = document
            .addEventListener("keydown", (event) => {
                if (_.includes(this._codes, event.code)) {
                    callback(event.code);
                }
            }, true);
    }

    stopListening() {
        document.removeEventListener(this._listener);
    }

}

const imp = new Impulser();
const reg = new Requester();
const key = new KeyboardListener();

export {
    imp as Impulser,
    reg as Requester,
    key as KeyboardListener
};
