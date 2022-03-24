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
    const combineOrders = client.db("combine_product_service_orders");

    // collections
    const serviceCollection = travelBD.collection("serviceCollection");
    const travelAdventurePlaceCollection = travelAdventure.collection("places");
    const bookedPlaceCollection = combineOrders.collection("booked_place");
    const ordersCollection = combineOrders.collection("orders");

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

    // get single data using id
    app.get("/random", async (req, res) => {
      const result = await client
        .db(req.query.d)
        .collection(req.query.c)
        .findOne({
          _id: ObjectId(req.query.id),
        });
      res.json(result);
    });

    // post travel place order
    app.post("/booked_place", async (req, res) => {
      const bookedData = req.body;
      const result = await bookedPlaceCollection.insertOne(bookedData);
      res.json(result);
    });

    // get all booking place by id
    app.get("/booked_place/:uid", async (req, res) => {
      const uid = req.params.uid;
      const result = await bookedPlaceCollection
        .find({ user_id: uid })
        .toArray();
      res.json(result);
    });
    // delete single booking place
    app.delete("/booking/:id", async (req, res) => {
      const result = await bookedPlaceCollection.deleteOne({
        _id: ObjectId(req.params.id),
      });
      res.json(result);
    });
    // post an orders
    app.post("/orders", async (req, res) => {
      const order = req.body;
      const result = await ordersCollection.insertOne(order);
      res.json(result);
    });
    // get all orders
    app.get("/orders", async (req, res) => {
      const result = await ordersCollection.find({}).toArray();
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
