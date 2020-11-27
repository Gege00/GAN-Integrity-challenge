"use strict";

const Address = require("./address.js");
const AreaResult = require("./result.js");
const { distanceInKmBetweenEarthCoordinates } = require("../utils/utils.js");

const calculateNearCities = async message => {
  try {


    console.log(
      `Calculating near cities of ${message.from} within ${message.distance}`
    );


    let { result, error } = await Address.getCityByGUID(message.from);
    if (error) throw new Error(error);
    const from = result;

    if (result === undefined)
      throw new Error(`No object find with ${message.from}`);
    // Address.getCityCursor.pipe(
    //
    //   new stream.Writable({
    //     objectMode: true,
    //     write: function(city, _, callback) {
    //
    //
    //
    //     }
    //   })

    const cities = await Address.getCityCursor();
    const nearCities =[];
    while (await cities.hasNext()) {
      let city = await cities.next();
      let distance = distanceInKmBetweenEarthCoordinates(
        from.latitude,
        from.longitude,
        city.latitude,
        city.longitude
      );

      if (distance <= message.distance) {
        let { guid, longitude, latitude, address, tags } = city;
        nearCities.push({ guid, longitude, latitude, address, tags });
      }
    }

    ({ result, error } = await AreaResult.insertOrUpdateResult({
      requestId: message.requestId,
      from: message.from,
      distance: message.distance,
      unit: "km",
      cities: nearCities
    }));


    if (error) throw new Error(error);

    return {error};

  } catch (error) {
    await AreaResult.insertOrUpdateResult({
      // requestId: body.requestId || null,
      // distance: body.distance || null,
      // from: body.from || null,
      error: error
    });

    console.error(error);
    return {error}
  }
};

module.exports = { calculateNearCities };
