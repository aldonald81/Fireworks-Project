import React, { useState, useRef, useEffect } from "react";
import axios from 'axios'
import "./ChatContainer.css";


const ChatContainer = ({profileInfo, setProfileInfo}) => {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([{role: 'assistant', content: "Hey! How's it going? Can you tell me a little about where your live and what you do for work?"}]);
  const [customerDueDiligenceFields, setCustomerDueDiligenceFields] = useState({
    "nationality": { 
      "type": "string", 
      "description": "The nationality or citizenship of the individual as stated on the passport.",
      "value": null
    },
    "countryOfResidence": {
      "type": "string",
      "description": "The country where the individual currently resides.",
      "value": null
    },
    "taxResidencyStatus": {
      "type": "string",
      "description": "The individual's tax residency status.",
      "value": null
    },
    "phoneNumber": {
      "type": "string",
      "description": "The individual's phone number, including country code.",
      "value": null
    },
    "emailAddress": {
      "type": "string",
      "format": "email",
      "description": "The individual's email address.",
      "value": null
    },
    "employmentStatus": {
      "type": "string",
      "enum": ["Employed", "Self-employed", "Unemployed", "Retired", "Student"],
      "description": "The individual's current employment status.",
      "value": null
    },
    "occupation": {
      "type": "string",
      "description": "The individual's current occupation or job title.",
      "value": null
    },
    "employerName": {
      "type": "string",
      "description": "The name of the individual's employer.",
      "value": null
    },
    "industry": {
      "type": "string",
      "description": "The industry or sector in which the individual works.",
      "value": null
    },
    "annualIncomeRange": {
      "type": "string",
      "enum": ["<25,000", "25,000-50,000", "50,000-100,000", "100,000-250,000", ">250,000"],
      "description": "The individual's approximate annual income range.",
      "value": null
    },
    "estimatedNetWorth": {
      "type": "string",
      "enum": ["<50,000", "50,000-100,000", "100,000-500,000", "500,000-1,000,000", ">1,000,000"],
      "description": "The individual's estimated net worth.",
      "value": null
    },
    "sourceOfFunds": {
      "type": "string",
      "enum": ["Salary", "Savings", "Business Income", "Investments", "Inheritance", "Retirement Funds", "Other"],
      "description": "The primary source of the individual's funds.",
      "value": null
    },
    "accountPurpose": {
      "type": "string",
      "enum": ["Savings", "Investments", "Business Transactions", "International Transfers", "Other"],
      "description": "The primary purpose for opening the account.",
      "value": null
    },
    "expectedTransactionTypes": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": ["Deposits", "Withdrawals", "Wire Transfers", "ACH Transfers", "Online Payments", "Other"]
      },
      "description": "The types of transactions the individual expects to perform.",
      "value": null
    },
    "expectedTransactionVolume": {
      "type": "string",
      "enum": ["<1,000/month", "1,000-5,000/month", "5,000-10,000/month", "10,000-50,000/month", ">50,000/month"],
      "description": "The expected monthly transaction volume.",
      "value": null
    },
    "expectedTransactionFrequency": {
      "type": "string",
      "enum": ["Daily", "Weekly", "Monthly", "Occasionally"],
      "description": "How frequently the individual expects to conduct transactions.",
      "value": null
    },
    "pepStatus": {
      "type": "string", // Converted from boolean
      "description": "Indicates whether the individual or any immediate family member is a Politically Exposed Person.",
      "value": null
    },
    "sanctionsCompliance": {
      "type": "string", // Converted from boolean
      "description": "Confirmation that the individual is not subject to international sanctions.",
      "value": null
    },
    "legalCompliance": {
      "type": "string", // Converted from boolean
      "description": "Disclosure of any past financial crimes or regulatory violations.",
      "value": null
    }
  });

  const messageListRef = useRef(null);

  // Auto-scroll to the bottom when messages change
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  const updateCustomerDueDiligenceFields = async (parsedData) => {
    for (const [key, value] of Object.entries(parsedData)) {
      setCustomerDueDiligenceFields((prevState) => ({
        ...prevState,
        [key]: {
          ...prevState[key], 
          value: value       
        }
      }));
    }
  };
  

  const updateProfileData = async(conversation) => {
    try {
      // Send the conversation to the API to get a response using axios
      const response = await axios.post("http://localhost:4000/api/dataChat/parseData", {
        conversation,
      });

      const parsedData = response.data.parsedData

      setProfileInfo((prevState) => ({...prevState, 'customerDueDiligence': parsedData}))
      updateCustomerDueDiligenceFields(parsedData)
      
    } catch (error) {
      console.error("Error parsing the conversation data:", error);
    }
  }

  const getMissingDataFields = async() => {
    let missingFields = ""
    for (const [key, value] of Object.entries(customerDueDiligenceFields)) {
      console.log(value['value'])
      if (!value['value']) {
        missingFields += key + ', '
      }
    }

    return missingFields
  }
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!inputValue.trim()) return;

    const userMessage = {
      role: "user",
      content: inputValue,
    };

    // Add user's message to messages
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    // Clear input
    setInputValue("");

    let missingFields = await getMissingDataFields();

    try {
      // Send the conversation to the API to get a response using axios
      const response = await axios.post("http://localhost:4000/api/dataChat/chat", {
        conversation: [...messages, userMessage],
        data: customerDueDiligenceFields,
        missingDataFields: missingFields,
      });

      updateProfileData(response.data['updatedConvo']);

      setMessages(response.data['updatedConvo']);
    } catch (error) {
      console.error("Error fetching the assistant response:", error);
    }
  };

  return (
    <div className="chat-container">
      <div className="message-list" ref={messageListRef}>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${
              message.role === "user" ? "user-message" : "bot-message"
            }`}
          >
            {message.content}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="chat-input-form">
        <input
          type="text"
          className="chat-input"
          placeholder="Type your message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </form>
    </div>
  );
};

export default ChatContainer;