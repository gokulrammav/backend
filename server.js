const express = require("express");
var cors = require("cors");
const app = express();


app.use(cors());
app.use(express.json())


const userRoute = require ('./routes/userRouter')
const productRouter = require ('./routes/productRouter')
const cartRouter = require ('./routes/cartRouter');
const orderRouter = require ('./routes/orderRoute');

app.use('/',userRoute);
app.use('/',productRouter);
app.use('/',cartRouter);
app.use ('/',orderRouter);


app.get("/", (req, res) => {
  res.status(200).send("test");
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`server running in ${port}`);
});
