let mongoose = require("mongoose");
mongoose.set("useCreateIndex", true);

const serverName = "ds147190.mlab.com:47190";
const database = "sampledb";
const user = "stasru";
const password = "fZsMGZXQMx8FCT";

mongoose.connect(
  `mongodb://${user}:${password}@${serverName}/${database}`,
  { useNewUrlParser: true }
);

const UsersSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  isVerified: {
    type: Boolean,
    default: false,
    required: true
  },
  date: {
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model("UsersSchema", UsersSchema);
