"use strict";

const Address = require("./address.js");
const AreaResult = require("./result.js");
const { distanceInKmBetweenEarthCoordinates } = require("../utils/utils.js");


//not nice
//need this for error handling
let requestId;

const calculateNearCities = async message => {
  try {


    console.log(
      `Calculating near cities of ${message.from} within ${message.distance}`
    );
    requestId=message.requestId
    //preset the result
    let { result, error } = await AreaResult.insertOrUpdateResult({
      requestId: message.requestId,
      from: message.from,
      distance: message.distance,
      unit: "km",
      cities: [],
      done: false
    });

    ({result, error } = await Address.getCityByGUID(message.from));
    if (error) throw new Error(error);


    if (result === null)
          throw new Error(`No city found with guid ${message.from}`);
    const from = result;

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
      if(city.guid==from.guid) continue;
      let distance = distanceInKmBetweenEarthCoordinates(
        from.latitude,
        from.longitude,
        city.latitude,
        city.longitude
      );

      if (distance < message.distance) {
        let { guid, longitude, latitude, address, tags } = city;
        nearCities.push({ guid, longitude, latitude, address, tags });
      }
    }

    ({ result, error } = await AreaResult.insertOrUpdateResult({
      requestId: message.requestId,
      from: message.from,
      distance: message.distance,
      unit: "km",
      cities: nearCities,
      valid: true,
      error: null,
      done:true,
    }));


    if (error) throw new Error(error);

    return {result};

  } catch (error) {

    //don't know if good idea  to store the error in the results object
    await AreaResult.insertOrUpdateResult({
      requestId: requestId,
      error: error.message,
      valid: false,
      cities:[],
      done: true
    });

    console.error(error);
    return {error}
  }
};

module.exports = { calculateNearCities };
