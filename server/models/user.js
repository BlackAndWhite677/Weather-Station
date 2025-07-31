const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    match: [/^\S+@\S+\.\S+$/, "Invalid Gmail format"],
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true, 
  },
  favorites: {
  type: [String],
  default: [],
}
});

module.exports = mongoose.model("user", userSchema);
