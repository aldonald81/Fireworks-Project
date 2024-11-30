const express = require("express");
const { authenticateWithImage } = require("../controllers/verifyIdentityController");
const { uploadSingleImage } = require("../middleware/uploadImages");

const router = express.Router();

router.post("/authenticateWithImage", uploadSingleImage, authenticateWithImage);

module.exports = router;
