/* eslint-env jasmine */

import Promise from "bluebird";
import generateNetwork from "../../../crossPlatformModels/generateNetwork";

const radiusOfVisionForNetwork = 1;

class Requester {
    sendImages() {
        return fetch(Promise.resolve());
    }

    receiveNetwork(callback) {
        return Promise.delay(
                Math.round(Math.random() * 1000)
            ).then(() =>
                callback(generateNetwork(radiusOfVisionForNetwork))
            );
    }
}

export default new Requester();
