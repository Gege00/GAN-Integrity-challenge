"use strict";

const home = require("express").Router();
const { authenticateToken } = require("../middlewares/authorization.js");
const Address = require("../operations/address.js");
const {query,body} = require("express-validator")


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

home.get("/cities-by-tag",
  [
    query('isActive').toBoolean()
  ]
 ,async (req, res, next) => {
  try {
    const { result, error } = await Address.getCityByTag(req.query);

    if (error) throw new Error(error);

    return res.status(200).send({cities: result});
  } catch (error) {
    return res.status(500).send(error.message);
  }
});




module.exports = home;
