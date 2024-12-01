const fs = require("fs"); // Import the File System module
const path = require("path");

const addUsage = (source, model, usageObject) => {
  try {
    const { prompt_tokens, completion_tokens } = usageObject;

    const usageStr =
      source + "," + model + "," + prompt_tokens + "," + completion_tokens;
    console.log(usageStr);
    // Append usageStr to usage.txt file
    const filePath = path.join(__dirname, "usage.txt");
    fs.appendFile(filePath, usageStr + "\n", (err) => {
      if (err) {
        console.error("Error appending to file:", err);
      }
    });
  } catch (error) {
    console.log("Error writing usage stats to file: " + error);
  }
};

module.exports = { addUsage };
