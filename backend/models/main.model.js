import { model, Schema } from "mongoose";

const mainSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: "Users" },
  title: { type: String, required: true },
  desc: { type: String, required: true },
  image: { type: String, required: true },
  likes: [{ type: Schema.Types.Mixed }],
});

const MAIN = model("Imagine", mainSchema);

export default MAIN;
