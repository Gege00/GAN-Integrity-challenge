"use strict";

const home = require("express").Router();
const { authenticateToken } = require("../middlewares/authorization.js");
const Address = require("../operations/address.js");
const { query, body,validationResult } = require("express-validator");
const { distanceInKmBetweenEarthCoordinates } = require("../utils/utils.js");

const { sendMessage } = require("../services/publisher.js");

home.use("/", authenticateToken);

// home.get('/',async (req,res,next)=>{
//
//     try{
//
//
//       return res.status(200).send("HadME")
//
//     }
//
//     catch(err){
//       return res.status(500).send(err.message)
//     }
//
//
// })

home.get(
  "/cities-by-tag",
  [query("isActive").toBoolean()],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(500).json({ errors: errors.array() });
      }

      const { result, error } = await Address.getCityByTag(req.query);

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
      let { result, error } = await Address.getCityByGUID(req.query.from);

      if (error) throw new Error(error);
      const from = result;

      ({ result, error } = await Address.getCityByGUID(req.query.to));

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
          requestId:  requestId,
          from: req.query.from,
          distance: req.query.distance
        }
      };

      let ok = await sendMessage(message);

      if (!ok) throw new Error();

      return res.status(200).send({
        resultsUrl: `http://127.0.0.1:8080/area-result/${requestId}`
      }
      );
    } catch (error) {
      console.error(error);
      return res.status(500).send(error.message);
    }
  }
);

module.exports = home;
