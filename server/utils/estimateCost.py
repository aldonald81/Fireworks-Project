import csv

# Define model costs in terms of dollars per 1 million tokens
model_costs = {
    "accounts/fireworks/models/llama-v3p2-3b-instruct": 0.10 / 1_000_000,
    "accounts/fireworks/models/llama-v3p1-405b-instruct": 3.00 / 1_000_000,
    "accounts/fireworks/models/llama-v3p1-70b-instruct": 0.90 / 1_000_000,
    "accounts/fireworks/models/llama-v3p2-90b-vision-instruct": 0.90 / 1_000_000,
}

# Initialize total cost
total_cost = 0.0

# Read the usage.txt file
with open("usage.txt", "r") as file:
    reader = csv.DictReader(file)
    for row in reader:
        # Calculate total tokens
        prompt_tokens = int(row["promptTokens"])
        completion_tokens = int(row["completionTokens"])
        total_tokens = prompt_tokens + completion_tokens
        
        # Get the cost per token for the model
        model = row["model"]
        if model in model_costs:
            cost_per_token = model_costs[model]
            # Add to total cost
            total_cost += total_tokens * cost_per_token
        else:
            print(f"Warning: Model '{model}' not found in cost list.")

# Print the total cost
print(f"Total cost: ${total_cost:.3f}")
