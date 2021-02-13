var mongoose = require("mongoose");

var counterSchema = mongoose.Schema({
  id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

module.exports = mongoose.model("counter", counterSchema);
