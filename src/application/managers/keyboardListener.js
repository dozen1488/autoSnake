import _ from "lodash";

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
        document.removeEventListener("keydown", this._listener);
    }

}

export default new KeyboardListener();
