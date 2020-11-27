"use strict";

const mongo = require("../database/mongo.js");

module.exports = {


  async getCityCursor(){

    try{

      return mongo.collection('cities')
        .find({})

    }catch(error){
      return {error}
    }


  },

  async getCityByGUID(guid) {
    try{


      const result = await mongo
        .collection("cities")
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

      const result = await mongo.collection('cities').find({
        isActive: isActive,tags:{$in:[query.tag]}
      }).toArray();


      return { result };
    } catch (error) {
      return { error };
    }
  }
};
