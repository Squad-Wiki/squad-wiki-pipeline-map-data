# JSON Documentation

This is documentation for the non-converted output JSON file.

- `Name` - Display Name

- `rawName` - Layer ID (used in LayerRotation.cfg)

- `levelName` - Ureal Engine 4 file name for the layer

- `minimapTexture` - Texture name used for minimap. Usefull to see which maps may be smaller (Many skirmish maps for example)

- `lightingLevel` - Unreal Engine 4 file name for the lighting

- `lighting` - Lighting type translated from lightingLevel

- `border` - Array of points of borders. Newer maps have a border spline (think line) that follows the outside of the map. Each point in the array is a point on the spline. Older maps do not have this spline and instead have two opposite points on the map that make a rectangle.

- `team1` `team2` - Factions that are on this layer.

  - **For maps with set factions:**
  - `faction` - Faction name
  - `teamSetupName` - More specific version of faction name, this will be displayed in who won in logs.
  - `tickets` - Tickets the faction has at the start of the game
  - `playerPercent` - Percentage of players in a game the team gets. 50% means the team would get 50/100 players. 25% would mean the team would get 25/100 players.
  - `disabledVeh` -
  - `intelOnEnemy` -
  - `action` - Number of commander actions
  - `commander` - Boolean to tell if there is a commander.

- `type` - Capture point type.

- `Flag` - Array of flags.

- `caputrePoints` - Number of capture points.

- `mapName` - Name of Level (Al Basrah, Belaya, etc.).

- `gamemode` - Gamemode derived from `Name` (NOT accurate).

- `layerVersion` - Layer version derived from `Name` (NOT accurate).

- `mapSize` - Map size calcualted from border (Rough estimate).

- `mapSizeType` - Type of map size calucation.
