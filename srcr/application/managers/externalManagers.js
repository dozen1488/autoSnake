const URLS = {
    APPLY_IMAGES: "/applyImages",
    GET_NETWORK: "/getNetwork"
};

class Impulser {
    constructor(frequency = 1000) {
        this.frequency = frequency;
    }

    isImpulsing() {
        return !!this.timer;
    }
    
    startImpulsing(action) {
        this.timer = setInterval(action, this.frequency);
    }

    stopImpulsing() {
        clearInterval(this.timer);
        this.timer = null;
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
        this._code = code;
        this._listener = null;
    }

    startListening(callback) {
        this._listener = document
            .addEventListener("keydown", (event) => {
                if (event.code === this._code) {
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
