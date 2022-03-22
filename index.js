const express = require("express");
const port = process.env.PORT || 5000;
const cors = require("cors");
require("dotenv").config();
const app = express();
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@cluster0.iuevi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const run = async () => {
  try {
    await client.connect();
    console.log("database connected");
    // databases
    const travelBD = client.db("travel-bangladesh");
    const travelAdventure = client.db("travel-adventures");

    // collections
    const serviceCollection = travelBD.collection("serviceCollection");
    const travelAdventurePlaceCollection = travelAdventure.collection("places");

    // get all travel bd service
    app.get("/bd-places", async (req, res) => {
      const result = await serviceCollection.find({}).toArray();
      res.json(result);
    });
    // get all travel adventure places
    app.get("/ta-places", async (req, res) => {
      const result = await travelAdventurePlaceCollection.find({}).toArray();
      res.json(result);
    });
    app.get("/vagetables", async (req, res) => {
      const result = await client
        .db("kacha_bazer")
        .collection("products")
        .find({})
        .toArray();
      res.json(result);
    });

    // get all bike
    app.get("/bikes", async (req, res) => {
      const result = await client
        .db("bike_bazar")
        .collection("products")
        .find({})
        .toArray();
      res.json(result);
    });
    // get all electronics product
    app.get("/electronics", async (req, res) => {
      const result = await client
        .db("online_shop")
        .collection("productCollection")
        .find({})
        .toArray();
      res.json(result);
    });
    app.get("/random", async (req, res) => {
      const result = await client
        .db(req.query.d)
        .collection(req.query.c)
        .findOne({
          _id: ObjectId(req.query.id),
        });
      res.json(result);
    });
  } finally {
  }
};
run().catch(console.dir);
app.get("/", (req, res) => {
  res.json("Server is running");
});

app.listen(port, () => {
  console.log("Server is running on port", port);
});
