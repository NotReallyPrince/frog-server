import express from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
import MTProto from 'telegram-mtproto';

const PORT = process.env.PORT || 8080;

const api = {
    // Replace these with your actual API ID and API hash
    api_id: 8159095,
    api_hash: '18ab10a9a4a4a42c2ff7e39baf92fdda',
    server: {
      // You can specify different servers if needed
      dev: true // Use dev server (optional)
    }
  };

const client = MTProto(api);


// async function getUserCreationDate() {
//   const data = await client("users.getFullUser");
//   console.log(data);
// }

app.get("/", (req, res) => {
  res.send("Telegram Bot");
//   getUserCreationDate();
});

app.listen(PORT, () => {
  console.log(`Server started at the port ${PORT}`);
});
