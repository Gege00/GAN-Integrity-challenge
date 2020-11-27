"use strict";

const mongo = require("../database/mongo.js");

module.exports = {
  async getResult(query) {
    try {

      const result = await mongo.collection("area_results").findOne(query)
      return {result};
    } catch (error) {
      return {error}

    }
  },

  async insertOrUpdateResult(data) {
    data.modifiedAt = new Date().toISOString();
    try {
      const result = await mongo.collection("area_results").updateOne(
        {
          requestId: data.requestId
        },
        { $set: data },
        { upsert: true }
      );

      return { result };
    } catch (error) {
      return { error };
    }
  }
};
