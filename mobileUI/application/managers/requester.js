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

const URLS = {
    APPLY_IMAGES: "http://192.168.14.52/applyImages",
    GET_NETWORK: "http://192.168.14.52/getNetwork"
};

export default new Requester();
