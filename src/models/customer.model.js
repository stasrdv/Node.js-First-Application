let mongoose = require("mongoose");

const server = "ds147190.mlab.com:47190";
const database = "sampledb ";
const user = "stasru";
const password = "fZsMGZXQMx8FCT";

mongoose.connect(
  `mongodb://${user}:${password}@ds147190.mlab.com:47190/sampledb`
);

let CustomerSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    required: true,
    unique: true
  }
});

module.exports = mongoose.model("CustomerSchema", CustomerSchema);
