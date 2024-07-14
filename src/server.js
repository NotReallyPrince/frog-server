import express from "express";
const app = express();
import dotenv from "dotenv";

dotenv.config();
const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.send("Telegram Bot");
});

app.listen(PORT, () => {
  console.log(`Server started at the port ${PORT}`);
});
