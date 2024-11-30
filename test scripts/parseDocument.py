import base64
import os
from dotenv import load_dotenv
import fireworks.client

# Load API key from .env file
load_dotenv()
fireworks.client.api_key = os.getenv('FIREWORKS_API_KEY')

# Helper function to encode the image
def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

# The path to your image
image_path = "./files/License-3.jpeg"

# Encode the image as base64
image_base64 = encode_image(image_path)

# Define the JSON schema for the response
response_schema = {
    "type": "object",
    "properties": {
        # Common Fields
        "documentType": {"type": "string", "enum": ["passport", "driver_license"]},  # Identifier for the document type
        "fullName": {"type": "string"},
        "dateOfBirth": {"type": "string", "format": "date"},
        "gender": {"type": "string", "enum": ["M", "F", "Other"]},
        "address": {"type": "string"},
        "dateOfIssue": {"type": "string", "format": "date"},
        "expirationDate": {"type": "string", "format": "date"},

        # Passport-Specific Fields
        "passportNumber": {"type": "string"},
        "nationality": {"type": "string"},
        "placeOfBirth": {"type": "string"},
        "issuingAuthority": {"type": "string"},
        "machineReadableZone": {"type": "string"},

        # Driver’s License-Specific Fields
        "licenseNumber": {"type": "string"},
        "class": {"type": "string"},
        "restrictions": {"type": "string"},
        "endorsements": {"type": "string"},
        "height": {"type": "string"},  
        "weight": {"type": "string"}, 
        "eyeColor": {"type": "string"},
        "hairColor": {"type": "string"},
        "organDonor": {"type": "boolean"},
        "veteranStatus": {"type": "boolean"},
        "stateIssued": {"type": "string"}  # U.S. state issuing the license
    },
    "required": ["documentType", "fullName", "dateOfBirth", "expirationDate"]
}


# Create the request
response = fireworks.client.ChatCompletion.create(
    model="accounts/fireworks/models/llama-v3p2-90b-vision-instruct",
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "image_url",
                    "image_url": {
                        "url": f"data:image/jpeg;base64,{image_base64}"
                    },
                },
                {
                    "type": "text",
                    "text": "Extract all data from this driver's license",
                },
            ],
        }
    ],
    response_format={
        "type": "json_object",
        "schema": response_schema,  # Attach the schema
    }
)

# Print the formatted JSON response
if hasattr(response, 'choices') and response.choices:
    print(response.choices[0].message.content)
else:
    print("No response received or invalid response format.")
