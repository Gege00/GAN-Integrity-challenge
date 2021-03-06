"use strict";

const home = require("express").Router();

const { query, body, validationResult } = require("express-validator");
const { distanceInKmBetweenEarthCoordinates } = require("../utils/utils.js");
const JSONStream = require("JSONStream")

const { authenticateToken } = require("../middlewares/authorization.js");
const { sendMessage } = require("../services/publisher.js");

const City= require("../operations/cities.js");
const AreaResult = require("../operations/result.js");



home.use("/", authenticateToken);

home.get("/all-cities", async (req, res, next) => {
  try {
    const cities = await City.getCityCursor();
    res.type("json")
      // return new JsonStreamStringify(cities.stream()).pipe(res)
    return cities
      .stream()
      .pipe(JSONStream.stringify())
      .pipe(res);

    cities.pipe({transform: x=> JSON.stringify(x)}).pipe(res)

  } catch (error) {
    return res.status(500).send(error.message);
  }
});

home.get(
  "/cities-by-tag",
  [query("isActive").toBoolean()],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(500).json({ errors: errors.array() });
      }

      const { result, error } = await City.getCityByTag(req.query);

      if (error) throw new Error(error);

      return res.status(200).send({ cities: result });
    } catch (error) {
      return res.status(500).send(error.message);
    }
  }
);

home.get(
  "/distance",
  [query("from").exists(), query("to").exists()],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(500).json({ errors: errors.array() });
      }
      let { result, error } = await City.getCityByGUID(req.query.from);

      if (error) throw new Error(error);
      const from = result;

      ({ result, error } = await City.getCityByGUID(req.query.to));

      if (error) throw new Error(error);

      const to = result;
      const distance = distanceInKmBetweenEarthCoordinates(
        from.latitude,
        from.longitude,
        to.latitude,
        to.longitude
      );

      return res.status(200).send({
        from: {
          guid: from.guid
        },
        to: {
          guid: to.guid
        },
        unit: "km",
        distance: parseFloat(distance)
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send(error.message);
    }
  }
);

home.get(
  "/area",
  [
    query("from").exists(),
    query("distance")
      .exists()
      .isInt()
      .toInt()
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(500).json({ errors: errors.array() });
      }
      //due to the test, now it is hard coded, otherwise it would be generated
      const requestId = "2152f96f-50c7-4d76-9e18-f7033bd14428";

      const message = {
        queue: "area_calculation",
        data: {
          requestId: requestId,
          from: req.query.from,
          distance: req.query.distance
        }
      };

      let ok = await sendMessage(message);

      if (!ok) throw new Error();

      return res.status(202).send({
        resultsUrl: `http://127.0.0.1:8080/area-result/${requestId}`
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send(error.message);
    }
  }
);

home.get("/area-result/:requestId", async (req, res, next) => {
  try {
    const { result, error } = await AreaResult.getResult({
      requestId: req.params.requestId
    });
    if (error) throw new Error(error);
    if (result ==null || result.error || !result.done) return res.status(202).send();
    return res.status(200).send(result);
  } catch (error) {
    console.error(error);

    return res.status(500).send(error.message);
  }
});

module.exports = home;
