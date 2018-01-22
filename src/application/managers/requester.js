class Requester {
    sendImages(images = [], radius = 1) {
        return fetch(
            URLS.APPLY_IMAGES,
            {
                method: "POST",
                body: JSON.stringify({ images, radius }),
                headers: {
                    "Content-type": "application/json"
                }
            }
        );
    }

    receiveNetwork(param1, param2) {
        const requestOptions = new URL(URLS.GET_NETWORK);
        if (param1 && typeof(param1) === "function") {
            requestOptions.searchParams.append("radiusOfVision", param2);
            fetch(requestOptions)
                .then(
                    (res) => {
                        res.json()
                            .then(res => param1(res));
                    }
                );

            return;
        } else {
            requestOptions.searchParams.append("radiusOfVision", param1);

            return fetch(requestOptions)
                .then((res) => res.json());
        }
    }
}

const URLS = {
    APPLY_IMAGES: "http://192.168.14.52:3002/applyImages",
    GET_NETWORK: "http://192.168.14.52:3002/getNetwork"
};

export default new Requester();
