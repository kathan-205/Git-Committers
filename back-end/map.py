import json
{
    "nodes": {
      "Entrance": {"type": "entrance", "floor": 1},
      "Lobby": {"type": "room", "floor": 1},
      "Stairs": {"type": "stairs", "floor": [1,2]},
      "Elevator1": {"type": "elevator", "floor": [1,2]},
      "E1-003 Lec": {"type": ["gate 1", "gate 2"], "floor": 1},
      "Washroom1": {"type": "female washroom", "floor": 1},
      "E1-007 Lec": {"type": ["gate 1", "gate 2"], "floor": 1},
      "E1-008 Lec": {"type": ["gate 1", "gate 2"], "floor": 1},
      "Exit1": {"type": "exit", "floor": 1},
      "E1-013 Lec": {"type": ["gate 1", "gate 2"], "floor": 1},
      "Washroom2": {"type": "male washroom", "floor": 1},
      "E1-001 Lec": {"type": ["gate 1", "gate 2", "gate 3", "gate 4"], "floor": 1, "accessible_gates": ["gate 1", "gate 2"]},
      "E1-017 Lec": {"type": ["gate 1", "gate 2"], "floor": 1},
      "E1-018 Lec": {"type": ["gate 1", "gate 2"], "floor": 1},
      "Exit2": {"type": "exit", "floor": 1},
  
      "Lobby2": {"type": "room", "floor": 2},
      "Garage": {"type": "room", "floor": 2},
      "E2-005 Lec": {"type": ["gate 1", "gate 2"], "floor": 2},
      "E2-001 Lec": {"type": ["gate 1", "gate 2"], "floor": 2},
      "Pedway": {"type": "Pedway to mechanical engineering building", "floor": 2},
      "Exit3": {"type": "exit", "floor": 2},
      "Tims Hortons": {"type": "cafe", "floor": 2},
      "Italian Cucina": {"type": "cafe", "floor": 2},
  
      "Elevator2": {"type": "elevator", "floor": [2]},
      "Elevator3": {"type": "elevator", "floor": [2]},
      "Elevator4": {"type": "elevator", "floor": [2]}
    },
  
    "edges": [
      {"from": "Entrance", "to": "Lobby", "accessible": True},
      {"from": "Lobby", "to": "Elevator1", "accessible": True},
      {"from": "Lobby", "to": "Stairs", "accessible": False},
      {"from": "Elevator1", "to": "E1-003 Lec", "accessible": True},
      {"from": "Lobby", "to": "E1-001 Lec", "accessible": True},
      {"from": "E1-001 Lec", "to": "E1-001 Lec gate 1", "accessible": True},
      {"from": "E1-001 Lec", "to": "E1-001 Lec gate 2", "accessible": True},
      {"from": "E1-001 Lec", "to": "E1-001 Lec gate 3", "accessible": True},
      {"from": "E1-001 Lec", "to": "E1-001 Lec gate 4", "accessible": True},
      
      {"from": "Elevator1", "to": "Lobby2", "accessible": True},
      {"from": "Lobby2", "to": "Elevator2", "accessible": True},
      {"from": "Lobby2", "to": "Elevator3", "accessible": True},
      {"from": "Lobby2", "to": "Elevator4", "accessible": True},
      {"from": "Lobby2", "to": "Pedway", "accessible": True},
  
      {"from": "Pedway", "to": "Mechanical Engineering Building", "accessible": True}
    ]
  }
  