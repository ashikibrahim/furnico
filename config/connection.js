const mongoose = require('mongoose');

require("dotenv").config();

mongoose.connect(process.env.MONGOOSE,{ useNewUrlParser: true, useUnifiedTopology: true })
  .then((_) => {
   console.log("mongoose is connected");
  })
  .catch((error) => {
    console.log(error);
  });