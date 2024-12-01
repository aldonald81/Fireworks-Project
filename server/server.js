const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const verifyIdentityRoutes = require("./routes/verifyIdentityRoutes");
const dataChatRoutes = require("./routes/dataChatRoutes")

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use routes
app.use("/api/verifyIdentity", verifyIdentityRoutes);
app.use("/api/dataChat", dataChatRoutes)

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
