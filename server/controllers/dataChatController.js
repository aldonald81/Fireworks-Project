const path = require("path");
const fs = require("fs");

const { extractDataFromChat, dataChat } = require("../services/fireworksService");

const parseData = async (req, res) => {
    try {
        const { conversation } = req.body;
    
        let data = await extractDataFromChat(conversation);
    
        res.status(200).json({ parsedData: data });
      } catch (error) {
        console.log("ERROR chatting to get data from the user: " + error);
        res.status(500).json({
          message: "Error chatting with the user",
          error: error.response?.data || error.message,
        });
      }
};

const chat = async (req, res) => {
  try {
    const { conversation, data, missingDataFields } = req.body;

    let updatedConvo = await dataChat(conversation, data, missingDataFields);

    res.status(200).json({ updatedConvo });
  } catch (error) {
    console.log("ERROR chatting to get data from the user: " + error);
    res.status(500).json({
      message: "Error chatting with the user",
      error: error.response?.data || error.message,
    });
  }
};

module.exports = {
  parseData,
  chat,
};
