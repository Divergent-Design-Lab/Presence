const mongoose = require("mongoose");
const MpathPlugin = require("mongoose-mpath");
const Schema = mongoose.Schema;

const Comment = require("./Comment");

const TweetSchema = new Schema({
  content: {
    type: String,
    default: "",
    required: true,
  },
  author: { type: Schema.Types.ObjectId, ref: "user", required: true },
  replies: {
    type: Number,
    default: 0,
  },
  likes: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

TweetSchema.index({ content: "text" });

TweetSchema.plugin(MpathPlugin, [
  {
    pathSeparator: "#",
    onDelete: "REPARENT",
    idType: Schema.Types.ObjectId,
  },
]);

module.exports = Tweet = mongoose.model("Tweet", TweetSchema);
