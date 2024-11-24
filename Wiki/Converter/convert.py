import json

convertedObject = {}

# Read current version JSON file
with open('completed_output/_Current Version/finished.json', "r") as file:
    CurrentJSON = json.load(file)

    UNITS = CurrentJSON["Units"]
    
    # Loop through layer
    for layer in CurrentJSON["Maps"]:
        
        # Build object
        layerObject = {}

        # ----- Direct Grabs ------
        layerObject["gamemode"] = layer["gamemode"]
        layerObject["layerVersion"] = layer["layerVersion"]
        layerObject["heliAltThreshold"] = layer["heliAltThreshold"]
        layerObject["mapSize"] = layer["mapSize"]

        # ----- Indirect Grabs ------
        # Team 1
        layerObject["defaultTeam1"] = layer["teamConfigs"]["team1"]["defaultFactionUnit"]

        # Check if the default team is present in units. It's possible an error in the extraction could result in it not appearing
        if layerObject["defaultTeam1"] in UNITS:
            layerObject["defaultTeam1Faction"] = UNITS[layerObject["defaultTeam1"]]["shortName"]
        else:
            print("Error, missing default team:")
            print(layerObject["defaultTeam1"])
        
        layerObject["defaultTeam1Tickets"] = layer["teamConfigs"]["team1"]["tickets"]

        # Team 2
        layerObject["defaultTeam2"] = layer["teamConfigs"]["team2"]["defaultFactionUnit"]

        if layerObject["defaultTeam2"] in UNITS:
            layerObject["defaultTeam2Faction"] = UNITS[layerObject["defaultTeam2"]]["shortName"]
        else:
            print("Error, missing default team:")
            print(layerObject["defaultTeam2"])

        layerObject["defaultTeam2Tickets"] = layer["teamConfigs"]["team2"]["tickets"]
