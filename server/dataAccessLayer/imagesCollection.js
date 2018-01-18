const Promise = require("bluebird");
const _ = require("lodash");

const collectionName = "images";

class ImagesCollection {
    constructor({
        databaseConnection
    }) {
        this.collection = databaseConnection.collection(collectionName);
    }

    async getImages() {
        try {
            const request = this.collection.find();
            const images = await Promise
                .promisify(
                    request.toArray, { context: request }
                )();

            return _.uniqWith(images, _.isEqual);
        } catch (error) {
            return [];
        }
    }

    async pushImages(images) {
        try {
            const request = this.collection;
            const result = await Promise
                .promisify(
                    request.insertMany,
                    { context: request }
                )(images);

            return result;
        } catch (error) {
            return {
                "acknowledged": true,
                "insertedIds": []
            };
        }
    }

}

module.exports = ImagesCollection;
