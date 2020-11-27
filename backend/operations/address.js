"use strict";

const mongo = require("../database/mongo.js");

module.exports = {


  async getCityCursor(){

    try{

      return mongo.collection('Address')
        .find({})

    }catch(error){
      return {error}
    }


  },

  async getCityByGUID(guid) {
    try{


      const result = await mongo
        .collection("Address")
        .findOne({guid: guid },{_id:0})


      return {result}
    }

    catch(error){
      return {error}
    }

  },

  async getCityByTag(query) {
    try {
      const { tag, isActive } = query;
      // const result = await mongo
      //   .collection("Address")
      //   .distinct("guid", { isActive: isActive, tags: { $in: [query.tag] } })

      const result = await mongo
        .collection("Address")
        .aggregate([
          {
            $match: {
              isActive: isActive,
              tags: { $in: [query.tag] }
            }
          },
          {
            $group: {
              _id: {
                guid: "$guid",
                longitude: "$longitude",
                latitude: "$latitude"
              },
              addresses: {
                $addToSet: "$address"
              }
            }
          },
          {
            $project: {
              _id: 0,
              guid: "$_id.guid",
              longitude: "$_id.longitude",
              latitude: "$_id.latitude",
              addresses: "$addresses"
            }
          }
        ])
        .toArray();

      return { result };
    } catch (error) {
      return { error };
    }
  }
};
