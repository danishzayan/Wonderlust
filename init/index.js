import mongoose from "mongoose";
import initdata from "./data.js";
import Listing from "../model/listing.js";

main()
  .then(() => {
    console.log("Database is connected succesfully");
  })
  .catch((err) => {
    console.log("Some error accured to connect", err);
  });

async function main() {
  await mongoose.connect("mongodb://localhost:27017/wonderlust");
}


const initDB = async () => {
    await Listing.deleteMany({});
    await Listing.insertMany(initdata.data);
    console.log("Data was initialized...");
  };
  
  initDB();