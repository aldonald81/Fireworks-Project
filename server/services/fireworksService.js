const axios = require("axios");

const parseImage = async (imageBase64) => {
  try {
    // Fireworks API URL
    const url = "https://api.fireworks.ai/inference/v1/chat/completions";

    // Define the JSON schema for the response
    const responseSchema = {
      type: "object",
      properties: {
        documentType: {
          type: "string",
          enum: ["Passport", "Drivers License"],
          description:
            "Specifies the type of identification document (e.g., passport or driver's license).",
        },
        fullName: {
          type: "string",
          description:
            "The full legal name of the individual as it appears on the identification document.",
        },
        dateOfBirth: {
          type: "string",
          format: "date",
          description: "The individual's date of birth in YYYY-MM-DD format.",
        },
        gender: {
          type: "string",
          enum: ["M", "F", "Other"],
          description:
            "The gender of the individual, as stated on the identification document.",
        },
        address: {
          type: "string",
          description:
            "The residential or official address of the individual, as it appears on the document.",
        },
        stateIssued: {
          type: "string",
          description:
            "For driver's licenses, the U.S. state or territory where the document was issued.",
        },
        dateOfIssue: {
          type: "string",
          format: "date",
          description: "The date the identification document was issued.",
        },
        expirationDate: {
          type: "string",
          format: "date",
          description: "The date the identification document expires.",
        },
        passportNumber: {
          type: "string",
          description:
            "A unique alphanumeric identifier for passports, issued by the respective country's authority.",
        },
        nationality: {
          type: "string",
          description:
            "The nationality or citizenship of the individual as stated on the passport.",
        },
        placeOfBirth: {
          type: "string",
          description:
            "The city, state, or country where the individual was born, as stated on the document.",
        },
        issuingAuthority: {
          type: "string",
          description:
            "The government authority responsible for issuing the document (e.g., Department of State).",
        },
        machineReadableZone: {
          type: "string",
          description:
            "The machine-readable zone (MRZ) text on a passport, used for automated identity verification. Usually a string of characters that appears on the bottom of the personal data page of a passport.",
        },
        licenseNumber: {
          type: "string",
          description:
            "A unique identifier for driver's licenses, issued by the state or territory.",
        },
        class: {
          type: "string",
          description:
            "The class of vehicle the license holder is authorized to drive (e.g., Class C for standard cars).",
        },
        restrictions: {
          type: "string",
          description:
            "Any restrictions placed on the driver's license (e.g., corrective lenses required).",
        },
        endorsements: {
          type: "string",
          description:
            "Special endorsements on the driver's license, such as for motorcycles or commercial vehicles.",
        },
        height: {
          type: "string",
          description:
            "The individual's height as recorded on the document, typically in feet and inches.",
        },
        weight: {
          type: "string",
          description:
            "The individual's weight as recorded on the document, typically in pounds.",
        },
        eyeColor: {
          type: "string",
          description:
            "The individual's eye color as recorded on the document (e.g., BLU for blue, BRN for brown).",
        },
        hairColor: {
          type: "string",
          description:
            "The individual's hair color as recorded on the document (e.g., BLK for black, BLN for blonde).",
        },
        organDonor: {
          type: "string",
          enum: ["No", "Yes"],
          description:
            "Indicates whether the individual is an organ donor (true for yes, false for no).",
        },
        veteranStatus: {
          type: "string",
          enum: ["No", "Yes"],
          description:
            "Indicates whether the individual is a veteran (true for yes, false for no).",
        },
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
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const day = String(today.getDate()).padStart(2, "0");
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

    const today = getCurrentDate();

    system_message = `You are an expert at identifying fraudulant forms of identification. Specifically, you are aware of common indications of fraudulant identification on passports and drivers licenses such as birth dates before 1915 or in the future, expiration date before ${today}, states not actually in the USA, etc. Note that you are looking at mock forms of identification so the names, zip codes, and addresses may not be real, however, that should not disqualify them. You return a JSON object with whether or not the identification is valid and a reason why (return empty string if identification is valid)`;
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

const dataChat = async (conversation, data, missingData) => {
  console.log("MISSING")
  console.log(missingData)
  console.log(data)
  try {
    // Fireworks API URL
    const url = "https://api.fireworks.ai/inference/v1/chat/completions";

    system_message = `You are a friendly financial adviser working to collect all KYC (Know Your Customer) data from a customer sitting in front of you. You should have a conversation with them in order to get them to tell you all that you need. Your goal is to make sure that all of the data fields get filled (listed below). However, you should do this within a natural, concise conversation. I will take care of parsing the data out in a structured format. \nData:\n${JSON.stringify(
      data
    )}\n\n Fields that need to be filled include: ${missingData}\n**focus on getting these fields filled in!`;
    messages = [{ role: "system", content: system_message }, ...conversation];

    const payload = {
      // model: "accounts/fireworks/models/llama-v3p1-405b-instruct",
      model: "accounts/fireworks/models/llama-v3p2-3b-instruct",
      temperature: 0.5,
      messages: messages,
    };

    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.FIREWORKS_API_KEY}`,
    };

    // Make the API request
    const response = await axios.post(url, payload, { headers });
    const responseString = response.data.choices[0].message.content;

    conversation.push({ role: "assistant", content: responseString });

    return conversation;
  } catch (error) {
    console.error(
      "Error chatting with the user to get data:",
      error.response?.data || error.message
    );
    throw error;
  }
};

const extractDataFromChat = async (conversation) => {
  try {
    // Fireworks API URL
    const url = "https://api.fireworks.ai/inference/v1/chat/completions";

    // Define the JSON schema for the response
    const properties = {
      nationality: {
        type: "string",
        description:
          "The nationality or citizenship of the individual as stated on the passport.",
      },
      countryOfResidence: {
        type: "string",
        description: "The country where the individual currently resides.",
      },
      taxResidencyStatus: {
        type: "string",
        description: "The individual's tax residency status.",
      },
      phoneNumber: {
        type: "string",
        description: "The individual's phone number, including country code.",
      },
      emailAddress: {
        type: "string",
        format: "email",
        description: "The individual's email address.",
      },
      employmentStatus: {
        type: "string",
        enum: [
          "Employed",
          "Self-employed",
          "Unemployed",
          "Retired",
          "Student",
        ],
        description: "The individual's current employment status.",
      },
      occupation: {
        type: "string",
        description: "The individual's current occupation or job title.",
      },
      employerName: {
        type: "string",
        description: "The name of the individual's employer.",
      },
      industry: {
        type: "string",
        description: "The industry or sector in which the individual works.",
      },
      annualIncomeRange: {
        type: "string",
        enum: [
          "<25,000",
          "25,000-50,000",
          "50,000-100,000",
          "100,000-250,000",
          ">250,000",
        ],
        description: "The individual's approximate annual income range.",
      },
      estimatedNetWorth: {
        type: "string",
        enum: [
          "<50,000",
          "50,000-100,000",
          "100,000-500,000",
          "500,000-1,000,000",
          ">1,000,000",
        ],
        description: "The individual's estimated net worth.",
      },
      sourceOfFunds: {
        type: "string",
        enum: [
          "Salary",
          "Savings",
          "Business Income",
          "Investments",
          "Inheritance",
          "Retirement Funds",
          "Other",
        ],
        description: "The primary source of the individual's funds.",
      },
      accountPurpose: {
        type: "string",
        enum: [
          "Savings",
          "Investments",
          "Business Transactions",
          "International Transfers",
          "Other",
        ],
        description: "The primary purpose for opening the account.",
      },
      expectedTransactionTypes: {
        type: "array",
        items: {
          type: "string",
          enum: [
            "Deposits",
            "Withdrawals",
            "Wire Transfers",
            "ACH Transfers",
            "Online Payments",
            "Other",
          ],
        },
        description:
          "The types of transactions the individual expects to perform.",
      },
      expectedTransactionVolume: {
        type: "string",
        enum: [
          "<1,000/month",
          "1,000-5,000/month",
          "5,000-10,000/month",
          "10,000-50,000/month",
          ">50,000/month",
        ],
        description: "The expected monthly transaction volume.",
      },
      expectedTransactionFrequency: {
        type: "string",
        enum: ["Daily", "Weekly", "Monthly", "Occasionally"],
        description:
          "How frequently the individual expects to conduct transactions.",
      },
      pepStatus: {
        type: "string",
        enum: ["Yes", "No"],
        description:
          "Indicates whether the individual or any immediate family member is a Politically Exposed Person.",
      },
      sanctionsCompliance: {
        type: "string",
        enum: ["Yes", "No"],
        description:
          "Confirmation that the individual is not subject to international sanctions.",
      },
      legalCompliance: {
        type: "string",
        description:
          "Disclosure of any past financial crimes or regulatory violations.",
      },
    }
    const responseSchema = {
      type: "object",
      properties: properties,
      required: [],
    };

    system_message = {
      role: "system",
      content:
        "You are an expert at extracting data from conversations. Your goal is to look at a conversation and return a JSON with data based on what you find in the conversation. Follow the Data Schema to understand what data you are looking for and what format to put it in. If a field is unknown based on the conversation, do NOT include it in the returned JSON. Do not make any guesses or hallucinations!",
    };
    user_message = {role: "user", content: `Extract all data that you can find from the conversation up until this point that fits into the Data Schema. ONLY include data that the user has provided!\n\nData Schema:\n${JSON.stringify(properties)}`}

    // Payload for the Fireworks API request
    const payload = {
      // model: "accounts/fireworks/models/llama-v3p1-70b-instruct",
      // model: "accounts/fireworks/models/firefunction-v2",
      // model: "accounts/fireworks/models/llama-v3p2-3b-instruct",
      model: "accounts/fireworks/models/llama-v3p1-405b-instruct",
      temperature: 0.2,
      messages: [system_message, ...conversation, user_message],
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

    console.log("DATAA EXTRACTED")
    console.log(responseObject)
    return responseObject;
  } catch (error) {
    console.error(
      "Error parsing chat data with Fireworks:",
      error.response?.data || error.message
    );
    throw error;
  }
};

module.exports = { parseImage, verifyData, dataChat, extractDataFromChat };
