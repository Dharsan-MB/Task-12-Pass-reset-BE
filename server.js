const app = require("./app");
const mongoose = require("mongoose");
const { MONGODB_URI, PORT } = require("./utils/config");
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("connected to the database");
    app.listen(PORT, () => {
      console.log("server running on http://127.0.0.1:5500");
    });
  })
  .catch((error) => {
    console.log("failed to connect database");
  });
