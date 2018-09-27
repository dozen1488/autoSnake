'use strict';

const isEqual = require('lodash/isEqual');

function mergeImages(currentImages, nextImages) {
    const imagesForConcat = [];
    // nextImages.forEach(newImage => {
    //     const sameImage = currentImages.find(image => isEqual(image.image, newImage.image));
    //     if (sameImage) {
    //         if (newImage.decision == sameImage.decision) {
    //             sameImage.result = (sameImage.result < newImage.result) ? newImage.result : sameImage.result;
    //         } else {
    //             if (sameImage.result > newImage.result) {
    //                 sameImage.result = newImage.result;
    //                 sameImage.decision = newImage.decision;
    //             }
    //         }
    //     } else {
    //         imagesForConcat.push(newImage);
    //     }
    // });

    return currentImages.concat(nextImages);
}

module.exports = mergeImages;
