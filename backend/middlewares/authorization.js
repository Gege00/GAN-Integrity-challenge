"use strict"


const authenticateToken = (req, res, next) => {

try {
  let token = req.headers.authorization;

  if(token===undefined) throw new Error("Failed to authenticate")
  //const authenticated = jwt.verify(token, process.env.TOKEN_SECRET)
  //if(!authenticated) throw new Error("Authentication issue!")
  next();
} catch (e) {
    return res.status(401).send(e.message)
}


}


module.exports = {authenticateToken}
