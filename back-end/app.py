import json
import networkx as nx
from flask import Flask, request, jsonify

app = Flask(__name__)

# Load the JSON data
with open("map.json", 'r') as file:
    building_data = json.load(file)

# Extract nodes and edges
nodes = building_data["nodes"]
edges = building_data["edges"]


# Initialize an empty graph
G = nx.Graph()

# Add nodes to the graph
for node_name, node_data in nodes.items():
    G.add_node(node_name, **node_data)

# Add edges to the graph, considering if the path is accessible
for edge in edges:
    if edge["accessible"]:
        G.add_edge(edge["from"], edge["to"])

@app.route('/find-shortest-path', methods=['POST'])
def find_shortest_path():
    # Get start and end nodes from the request
    user_input = request.get_json()
    start_node = user_input.get('start_node')
    end_node = user_input.get('end_node')

    # Check if start and end nodes are provided
    if not start_node or not end_node:
        return jsonify({"error": "Please provide both start_node and end_node"}), 400

    # Calculate shortest path
    try:
        shortest_path = nx.shortest_path(G, source=start_node, target=end_node)
        return jsonify({"shortest_path": shortest_path})
    except nx.NetworkXNoPath:
        return jsonify({"error": f"No path found between {start_node} and {end_node}"}), 404
    except nx.NodeNotFound as e:
        return jsonify({"error": str(e)}), 400


if __name__ == '__main__':
    app.run(debug=True)
