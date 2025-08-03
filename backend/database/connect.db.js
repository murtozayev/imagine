import mongoose from "mongoose";

export default async function () {
  try {
    await mongoose.connect(process.env.MURI);
    console.log("Mongoose connected");
  } catch (error) {
    console.log(error.message);
  }
}
