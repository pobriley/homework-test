const express = require("express");
const app = express();

const cors = require("cors");

const riceRouter = require("./routes/rice");

app.use(cors());
app.use(express.json());
app.use("/api", riceRouter);

app.listen(5000, () => {
  console.log("Connecting to server successfully in port 5000");
});
