const path = require("path");
const fs = require("fs")

const {
  parseImage,
  verifyData
} = require("../services/fireworksService");


const authenticateWithImage = async (req, res) => {
    try {
      const file = req.file;
  
      if (!file) {
        return res.status(400).json({ message: "No image file uploaded" });
      }
  
      const filePath = path.join(__dirname, "../uploads", file.filename);

      const imageBase64 = fs.readFileSync(filePath, { encoding: "base64" });
  
      const imageDataRes = await parseImage(imageBase64);
      // console.log(imageDataRes)
      if (imageDataRes['isValidFormOfIdentification'] == 'No'){
        return res.status(200).json({isValid: "no", reason: "Not a valid form of authentication"})
      }

      const verifyDataRes = await verifyData(imageDataRes)

      let resData = {}
      if (verifyDataRes['isValid'] == 'no'){
        resData = verifyDataRes
      } else {
        resData = {'data': imageDataRes, 'isValid': 'yes'}
      }
  
      fs.unlink(filePath, (err) => {
        if (err) console.error("Error deleting file:", err.message);
      });
  
      res.status(200).json(resData);
    } catch (error) {
      console.log("ERROR authenticating with image: " + error)
      res.status(500).json({
        message: "Error processing the image",
        error: error.response?.data || error.message,
      });
    }
  };


module.exports = {
  authenticateWithImage
};
