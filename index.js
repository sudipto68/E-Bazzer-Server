const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const ObjectID = require("mongodb").ObjectID;
const port = process.env.PORT || 5055;

app.use(cors());
app.use(bodyParser.json());

const MongoClient = require("mongodb").MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zfos2.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  console.log(err);
  const productCollection = client.db("freshdb").collection("products");

  app.get("/products", (req, res) => {
    productCollection.find().toArray((err, items) => {
      res.send(items);
    });
  });

  app.post("/addproducts", (req, res) => {
    const newProduct = req.body;
    productCollection.insertOne(newProduct).then((res) => {
      console.log(res);
    });
  });

  app.delete("/deleteProduct/:id", (req, res) => {
    const id = ObjectID(req.params.id);
    productCollection
      .findOneAndDelete({ _id: id })
      .then((document) => res.send(!document.value));
  });
  //   client.close();
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
