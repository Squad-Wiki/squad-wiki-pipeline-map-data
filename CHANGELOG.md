## [2.1-squad-10.0.0]

### Added
- Map Info
  - Added `mapCameraActor` holding the spawn screen camera position and rotation

- Version bump of MapGrabAssets to 4.2

## [2.1-squad-9.0.2]

- Version bump of MapGrabAssets to 4.1

### Added

- Map Info  
  - Added `SeaLevel` (closes #122)
  - Added `commanderDisabled`, if false commander is disabled on the layer
  - Added `boatsAvailable` boolean (informative only)
  - Added `tanksAvailable` boolean (informative only)
  - Added `helicoptersAvailable` boolean (informative only)
  - Added Player Spawn Objects within `mapAssets[]` (close #90):
    - `spawnGroups[]` - Holding the clickable spawns positions on the map
    - `spawnPoints[]` - Holding the real player spawns positions around spawnGroups
- Units
  - Added `unitIcon`, holding the generalist icon for the unit typ (eg: T_UnitType_CombinedArms)
  - Added `singleUse` within vehicle data. If true the vehicle only spawns once. (closes #124)
- Others
  - Added logging for progression of map.
  - Added fallback for invalid gamemode

### Changed

- Reworked invaid map filters (uses array based off entire path now)
- Updated to UE5
- Changed the way skirmish is logged in `capturePoints` (closes #126)
    - Changed `type` from `"AAS Graph"` to `"Skirmish Graph"` 
    - Changed pointsOrder to have `invalidForSkirmishGameMode` listed when in skirmish as gamemode can have multiple points connected to one.
    - Added `links`
    - Fixed numberOfPoints calculation

### Removed

### Deprecated

### Fixed

- Objectives capzones now have proper scaling (fixes #121)
- Fixed typo in map limiter log (sh4rkman)