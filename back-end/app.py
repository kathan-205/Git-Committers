import json

# Load the JSON data
with open("map.json", 'r') as file:
    building_data = json.load(file)

# Extract nodes and edges
nodes = building_data["nodes"]
edges = building_data["edges"]

# Check if the data was loaded correctly
print("Nodes:", nodes)
print("Edges:", edges)