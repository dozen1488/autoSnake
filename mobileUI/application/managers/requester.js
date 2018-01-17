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
        if (callback) {
            fetch(
                URLS.GET_NETWORK,
            ).then(
                (res) => {
                    res.json()
                        .then(res => callback(res));
                }
            );

            return;
        } else {
            return fetch(URLS.GET_NETWORK)
                .then((res) => res.json());
        }
    }
}

const HOST = "http://192.168.14.52:3002";

const URLS = {
    APPLY_IMAGES: `${HOST}/applyImages`,
    GET_NETWORK: `${HOST}/getNetwork`
};

export default new Requester();
