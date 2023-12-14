# SDK Configuration
The following data tables must be configured before running the sdk extraction.

## Lighting Layers

Every lighting layer in the game must be present in this data table to allow english conversion of the lighting layers name. 

When a new lighting layer is added the pipeline will spit out a `invalidLightingLevels.json` file with a list of lighting layers that needs to be configured. This typically happens on updates where new maps are introduced. Any lighting layers within this file must be added to the `LightingLayers` data table or the pipline will fail to run.