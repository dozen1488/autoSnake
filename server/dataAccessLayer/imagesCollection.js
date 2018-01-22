const Promise = require("bluebird");
const _ = require("lodash");

const config = require("../configuration.json");

class ImagesCollection {
    constructor({
        databaseConnection,
        radiusOfVision
    }) {
        this.collection = databaseConnection
            .collection(`${config.collectionName}${radiusOfVision}`);
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
            images = _.uniqWith(images, _.isEqual)
                .filter(({ result }) => result != 0);
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
