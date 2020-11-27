"use strict";

const Address = require("../operations/address.js");
const AreaResult = require("../operations/result.js");
const { distanceInKmBetweenEarthCoordinates } = require("../utils/utils.js");

const calculateNearCities = async message => {
  try {
    if (message === undefined) return;
    const nearCities = [];
    const body = JSON.parse(message.content);
    console.log(
      `Calculating near cities of ${body.guid} within ${body.distance}`
    );
    let { result, error } = await Address.getCityByGUID(body.from);
    if (error) throw new Error(error);
    const from = result;

    if (result === undefined)
      throw new Error(`No object find with ${body.from}`);
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

    while (await cities.hasNext()) {
      let city = await cities.next();
      let distance = distanceInKmBetweenEarthCoordinates(
        from.latitude,
        from.longitude,
        city.latitude,
        city.longitude
      );

      if (distance <= body.distance) {
        let { guid, longitude, latitude, address, tags } = city;
        nearCities.push({ guid, longitude, latitude, address, tags });
      }
    }

    ({ result, error } = await AreaResult.insertOrUpdateResult({
      requestId: body.requestId,
      from: body.from,
      distance: body.distance,
      unit: "km",
      cities: nearCities
    }));


    if (error) throw new Error(error);

    return result;
    
  } catch (error) {
    await AreaResult.insertOrUpdateResult({
      // requestId: body.requestId || null,
      // distance: body.distance || null,
      // from: body.from || null,
      error: error
    });

    console.error(error);
  }
};

module.exports = { calculateNearCities };
