const express = require("express");
require("./db/mongoose");
const restRouter = require("./routers/restaurantsRoutes");

const app = express();
const port = process.env.PORT || 4000;

// this will parse the json in the req to an object
app.use(express.json());
app.use(restRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
