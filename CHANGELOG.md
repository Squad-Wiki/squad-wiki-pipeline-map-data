## [2.1-squad-9.0.2]

- Version bump of MapGrabAssets to 4.1

### Added

- Added SeaLevel logging under map info. (sh4rkman closes #122)
- Added logging for progression of map. (sh4rkman)
- Added singleUse within vehicle data. If true the vehicle only spawns once. (closes #124)
- Added fallback for invalid gamemode

### Changed

- Reworked invaid map filters (uses array based off entire path now)
- Updated to UE5
- Changed the way skirmish is logged in `capturePoints` (closes #126)
    - Changed `type` from `"AAS Graph"` to `"Skirmish Graph"` 
    - Changed pointsOrder to have `invalidForSkirmishGameMode` listed when in skirmish as gamemode can have multiple points connected to one.
    - Fixed numberOfPoints calculation
### Removed

### Deprecated

### Fixed

- Objectives capzones now have proper scaling (fixes #121)
- Fixed typo in map limiter log (sh4rkman)