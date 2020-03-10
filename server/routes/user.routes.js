let mongoose = require("mongoose"),
  express = require("express"),
  router = express.Router();

let user = require("../models/user-schema");

router.route("/create").post((req, res, next) => {
  user.findOne({ email: req.body.email }, (err, data) => {
    if (err) {
      throw err;
    }
    if (data) {
      console.log("user exists");
      res.json(data);
    } else {
      user.create(req.body, (error, data) => {
        if (error) {
          return next(error);
        } else {
          res.json(data);
        }
      });
    }
  });
});

router.route("/blueprint").post((req,res,next) => {
  // user.update({})
})

module.exports = router;
