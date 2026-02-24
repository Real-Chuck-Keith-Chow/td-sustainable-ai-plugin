const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/test", (req, res) => {
  console.log("Received from frontend:", req.body);

  res.json({
    status: "success",
    message: "Backend received your request!",
    receivedPrompt: req.body.prompt || null
  });
});

app.listen(3001, () => {
  console.log("Server running at http://localhost:3001");
});