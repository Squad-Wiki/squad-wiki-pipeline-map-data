# Map Object


The map object contains the info on a given "Map". "Map" in most players Squad terms is a specific "Layer" or "UE4 Level". Map here is the same thing, "Map" = "Layer" = "UE4 Level".


```json
    {
        "Name": "string",        # Display name of layer. This is what the player sees when loading into a mp
        "rawName": "string",
        "levelName": "string",
        "mapId": "string",
        "mapName": "string",
        "gamemode": "string",
        "layerVersion": "string",
        "minimapTexture": "string",
        "heliAltThreshold": float,
        "depthMapTexture": "string",
        "lightingLevel": "string",
        "lighting": "string",

        "borderType": "string",         # The type of the border, See border type note below for more info.
        "mapSizeType": "string",        # Same as borderType
        "border" : [                    # Array of border points. See border type note below for more info.
            {
                "point": int,           # Point index
                "location_x": float,    # Location of point, same for y and z
                "location_y": float,
                "location_z": float
            },
        ],
        "mapTextureCorners": [          # Array of map texture corners. See map texture corner note below for more info.
            {
                "point": int,           # Point index
                "location_x": float,    # Location of point, same for y and z
                "location_y": float,
                "location_z": float
            },
        ]

        "assets": {
            "vehicleSpawners": [        # Array of vehicle spawners
                {
                    "icon": "questionmark",               # Icon of the vehicle spawner, will always be "questionmark"
                    "name": "Team1SpawnerBike1",          # object name of the spawner
                    "type": "Team One",                   # This is the team this spanwer belongs to, usually "Team One" or "Team Two"
                    "size": "QuadBike",                   # Size of the vehicle spawner
                    "maxNum": 0,
                    "location_x": -74170.7578125,         # Next lines are locations and rotations of the spawner
                    "location_y": 63323.3828125,
                    "location_z": 6621.876953125,
                    "rotation_x": 0,
                    "rotation_y": 0,
                    "rotation_z": 4.9733624458312988,
                    "typePriorities": [],
                    "tagPriorities": []
                }
            ]
            "deployables": [
                {

                }
            ]
        }
 
    }

```

## Border Type

The key "borderType" is not native to the SDK. It is the method used to determine the size of the map, and the border points. 

The "spline" method means that the map is utizling a spline for the map size, and that the border arrray will be the points on this spline. Drawing lines between the points won't be perfect as the spline line itself curves off the points, and does not draw straight from point to point, but it gives a good general idea of where the border is.

The "mapTexture" method means that the map is utizling the mapTextureCorners for the map size, and that the border array will be the two map texture corners. See the [map texture corner](#map-texture-corners) section for more info.

## Map Texture Corners

The map texture corners are corners that are used to generate the minimap. The corners are not neccesairly the same for every map, some are top left and bottom right, some are top right and bottom left. They are always opposite of each other. The best way to utilize these is to be able to stretch a given minimap to the corner to be able to place points on a given minimap. Reach out to Shanomac99 if you need help with this.