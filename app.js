import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Listing from "./model/listing.js";
import path from "path";
import { fileURLToPath } from "url";
import methodOverride from "method-override";
import ejsMate from "ejs-mate";
import { wrapAsync } from "./utils/wrapAsync.js";

// Convert file URL to a file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = process.env.PORT || 8000;
const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

dotenv.config();

main()
  .then(() => {
    console.log("Database is connected successfully");
  })
  .catch((err) => {
    console.log("Some error occurred while connecting", err);
  });

async function main() {
  await mongoose.connect(process.env.DB_CONNECTION);
}

// Home route
app.get("/", (req, res) => {
  res.send("Hi, I'm Danish");
});

// Listing route
app.get("/listings", async (req, res) => {
  try {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
  } catch (err) {
    res.status(500).send("Error retrieving listings.");
  }
});

// New route
app.get("/listings/new", (req, res) => {
  res.render("listings/new");
});

// Show route
app.get("/listings/:id", async (req, res) => {
  try {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show", { listing });
  } catch (err) {
    res.status(500).send("Error retrieving Id.");
  }
});

// Create route
app.post(
  "/listings",
  wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
  })
);

//Edit Route
app.get("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
});

//Update Route
app.put("/listings/:id", async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
});

//Delete Route
app.delete("/listings/:id", async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listings");
});

app.use((err, req, res, next) => {
  res.send("Something went wrong...");
});

app.listen(port, () => {
  console.log(`Server is listening on ${port}`);
});

// Test listing route
// app.get("/testListing", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "My new Villa",
//     description: "By the beach",
//     price: 1200,
//     location: "Calangute Goa",
//     country: "India",
//   });
//   await sampleListing.save();
//   console.log("Sample was saved");
//   res.send("Successful testing...");
// });
