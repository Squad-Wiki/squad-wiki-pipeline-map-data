## [2.1-squad-9.0.2]

- Version bump of MapGrabAssets to 4.1

### Added

- Map Info  
  - Added `SeaLevel` (closes #122)
  - Added `commanderDisabled`, if false commander is disabled on the layer.
  - Added `boatsAvailable` boolean (informative only).
  - Added `tanksAvailable` boolean (informative only).
  - Added `helicoptersAvailable` boolean (informative only).
  - Added Player Spawn Objects within `mapAssets[]` (close #90):
    - `spawnGroups[]` - Holding the clickable spawns positions on the map.
    - `spawnPoints[]` - Holding the real player spawns positions around spawnGroups.
  - Added `unitMapSize`, shows the "Unit" size of the map. (This can be infrenced from the available units, but this is another possible variable to use.)
  - Added `FOBRadiusType`, shows what size radius is used.
  - Added `FOBRadiusDisplayName`, nice version of `FOBRadiusType`.
  - Added `FOBExclusionRadius` number, holds the exclusion zone of FOBs.
  - Added `FOBConstructionRadius` number, holds the construction zone of FOBs.
- Units
  - Added `unitIcon`, holding the generalist icon for the unit type. (eg: T_UnitType_CombinedArms)
  - Added `singleUse` within vehicle data. If true the vehicle only spawns once. (closes #124)
- Others
  - Added logging for progression of map.
  - Added fallback for invalid gamemode.

### Changed

- Reworked invaid map filters (uses array based off entire path now).
- Updated to UE5.
- Changed the way skirmish is logged in `capturePoints` (closes #126).
    - Changed `type` from `"AAS Graph"` to `"Skirmish Graph"`.
    - Changed pointsOrder to have `invalidForSkirmishGameMode` listed when in skirmish as gamemode can have multiple points connected to one.
    - Added `links`.
    - Fixed numberOfPoints calculation.
- Changed empty `team1Anchors` and `team2Anchors` in TC maps from 0 -> -1 to indicate null. (Related to #124)

### Removed

### Deprecated

### Fixed

- Objectives capzones now have proper scaling (fixes #121).
- Fixed typo in map limiter log (sh4rkman).
- Fixed factionID being blank within Units data.
- Fixed a bug where a layer would be logged again if you started the pipeline after a crash/not completing a previous run (fixes #127).
- Fixed lighting levels not showing up. **Only `lighting` is now valid, there are no more lightingLevels (fixes #128).
- Fixed `team1Anchors` duplicating into `team2Anchors` (fixes #124).