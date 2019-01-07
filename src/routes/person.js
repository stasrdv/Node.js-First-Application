let express = require("express");
let router = express.Router();

//QueryString => query property on request object
router.get("/person", (req, res) => {
  if (req.query.name) {
    res.send(`You have requested a person named ${req.query.name}`);
  } else {
    res.send("You have requested a person");
  }
});

//Params property on request object
router.get("/person/:name", (req, res) => {
  res.send(`You have requested a person ${req.query.name}`);
});

router.get("/error", (req, res) => {
  throw new Error("This is a forced error.");
});
module.exports = router;
