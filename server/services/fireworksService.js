const axios = require("axios");

const parseImage = async (imageBase64) => {
  try {
    // Fireworks API URL
    const url = "https://api.fireworks.ai/inference/v1/chat/completions";

    // Define the JSON schema for the response
    const responseSchema = {
      type: "object",
      properties: {
        // General Information
        documentType: { type: "string", enum: ["Passport", "Drivers License"] },
        fullName: { type: "string" },
        dateOfBirth: { type: "string", format: "date" },
        gender: { type: "string", enum: ["M", "F", "Other"] },
        address: { type: "string" },
        stateIssued: { type: "string" },
        dateOfIssue: { type: "string", format: "date" },
        expirationDate: { type: "string", format: "date" },
        issuedDate: { type: "string", format: "date" },

        // Passport-Specific Details
        passportNumber: { type: "string" },
        nationality: { type: "string" },
        placeOfBirth: { type: "string" },
        issuingAuthority: { type: "string" },

        // Driver's License-Specific Details
        licenseNumber: { type: "string" },
        class: { type: "string" },
        restrictions: { type: "string" },

        // Physical Description (Commonly Found in IDs)
        height: { type: "string" },
        weight: { type: "string" },
        eyeColor: { type: "string" },
        hairColor: { type: "string" },

        // Optional Attributes
        organDonor: { type: "string", enum: ['yes', 'no'] },
        veteranStatus: { type: "string", enum: ['yes', 'no'] },
      },
      required: ["documentType", "fullName", "dateOfBirth", "expirationDate"],
    };

    system_message =
      "You are an expert at extracting data from different forms of identification such as drivers licenses and passports. You must make sure that every piece of data that you return is present on the provided image. Do NOT hallucinate data or add ANY data from your knowledge. ALL data that you return must be present on the image. If there is no data for a non-required field, do not include the field in the JSON.";

    // Payload for the Fireworks API request
    const payload = {
      model: "accounts/fireworks/models/llama-v3p2-90b-vision-instruct",
      temperature: 0.6,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`,
              },
            },
            {
              type: "text",
              text: "Extract all data that you can find from the provided image of a drivers license or passport. Make sure that ALL data you return can be found within the image. Do not include any data that is from your knowledge but can't be found on the image.",
            },
          ],
        },
      ],
      response_format: {
        type: "json_object",
        schema: responseSchema,
      },
    };

    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.FIREWORKS_API_KEY}`,
    };

    // Make the API request
    const response = await axios.post(url, payload, { headers });
    const responseString = response.data.choices[0].message.content;

    // Parse and return the response as JSON
    const responseObject = JSON.parse(responseString);
    return responseObject;
  } catch (error) {
    console.error(
      "Error parsing image with Fireworks:",
      error.response?.data || error.message
    );
    throw error;
  }
};

const getCurrentDate = async () => {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const day = String(today.getDate()).padStart(2, '0');
  const year = today.getFullYear();
  return `${month}/${day}/${year}`;
};

const verifyData = async (data) => {
  try {
    // Fireworks API URL
    const url = "https://api.fireworks.ai/inference/v1/chat/completions";

    // Define the JSON schema for the response
    const responseSchema = {
      type: "object",
      properties: {
        isValid: { type: "string", enum: ["yes", "no"] },
        reason: { type: "string" },
      },
      required: ["isValid", "reason"],
    };

    const today = getCurrentDate()

    system_message =
      `You are an expert at identifying fraudulant forms of identification. Specifically, you are aware of common indications of fraudulant identification on passports and drivers licenses such as birth dates before 1915 or in the future, expiration date before ${today}, states not actually in the USA, etc. Note that you are looking at mock forms of identification so the names, zip codes, and addresses may not be real, however, that should not disqualify them. You return a JSON object with whether or not the identification is valid and a reason why (return empty string if identification is valid)`;
    user_message = `Examine the below data and determine whether it indicates a valid form of identification. Some (but not all) key items to look out for are: \n1. Birth dates before 1915 or in the future \n2. Expiration date before ${today} \n3. States not actually in the USA. \n\nData:\n${JSON.stringify(
      data
    )}`;
    console.log(user_message);
    // Payload for the Fireworks API request
    const payload = {
      model: "accounts/fireworks/models/llama-v3p1-405b-instruct",
      // model: "accounts/fireworks/models/llama-v3p2-3b-instruct",
      temperature: 0.5,
      messages: [
        {
          role: "system",
          content: system_message,
        },
        {
          role: "user",
          content: user_message,
        },
      ],
      response_format: {
        type: "json_object",
        schema: responseSchema,
      },
    };

    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.FIREWORKS_API_KEY}`,
    };

    // Make the API request
    const response = await axios.post(url, payload, { headers });
    const responseString = response.data.choices[0].message.content;

    // Parse and return the response as JSON
    const responseObject = JSON.parse(responseString);
    return responseObject;
  } catch (error) {
    console.error(
      "Error parsing image with Fireworks:",
      error.response?.data || error.message
    );
    throw error;
  }
};

module.exports = { parseImage, verifyData };
