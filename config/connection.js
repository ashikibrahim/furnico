const mongoose = require('mongoose');

require("dotenv").config();

const url = process.env.MONGOOSE

mongoose.connect(url,{ useNewUrlParser: true, useUnifiedTopology: true })
  .then((_) => {
   console.log("mongoose is connected");
  })
  .catch((error) => {
    console.log(error);
  });