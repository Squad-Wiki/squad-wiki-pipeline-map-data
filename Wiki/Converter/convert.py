import json

# Read current version JSON file
with open('completed_output/_Current Version/finished.json', "r") as file:
    CurrentJSON = json.load(file)

print(CurrentJSON["Units"]["ADF_LO_CombinedArms"])