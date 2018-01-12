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

const URLS = {
    APPLY_IMAGES: "/applyImages",
    GET_NETWORK: "/getNetwork"
};

export default new Requester();
