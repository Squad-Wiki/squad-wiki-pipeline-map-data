**! ! ! WARNING ! ! ! THIS IS OUT OF DATE AND NEEDS A REWRITE!!**

**If you are needing a completed please ask `werewolfboy13#0666` for a completed `raw.txt` in the squad wiki discord.**

**A rewrite is planned for the new workflow.**


# Pipeline Usage
Once you have completed the [installation](installation.md) and [configuration](configuration.md), you can now proceed to the actual usage of the pipeline.

Running the pipeline consists of four main steps:
1. Export the game data from the [Squad SDK](https://squad.gamepedia.com/Squad_SDK)
2. Convert this raw export into [JSON format](https://en.wikipedia.org/wiki/JSON) for easier processing
3. Convert SDK labels into names used on the wiki
4. Upload the data to Data pages on the wiki

To run steps 2-4, open up a command console - this can be done by typing `cmd` into the windows search bar, or running a terminal on linux. Next, navigate to the root folder location by typing in `cd {file location}`. Example: cd `C:\Programming\Squad Wiki Pipline - Map Data`
All *node commands* must be run from this root folder of the pipeline.









### 1) SDK
Once [installation](/doc/installation.md) is complete the SDK data extraction will activate upon any map loading in the SDK. To extract all data you must open up the very first gameplay layer. This layer should be Al Basrah AAS v1.

Once the above is completed hit `Play` to initiate the map loading, then the SDK data extraction will start. It will automatically cycle through all the maps and layers - this will take quite a long time. ![Hit Play](/doc/images/sdk/sdk_play.png)

All data will output to the file `Squad SDK\SquadEditor\Squad\wiki\raw.txt`.

In case you want to disable the SDK data extraction in your Squad SDK you must unlink the function node within BP_HUD.






### 2) raw_To_JSON
This will convert raw data from the SDK into a more manageable JSON file.

#### Command
```
node raw_To_JSON/raw-to-json.js
```
#### Input
The output from the SDK must be put in `files/input/raw.txt`.

Make sure you set the correct Squad $version every time you run this step - see [configuration](configuration.md).

Also make sure that [all configuration files](configuration.md) are updated if new vehicles, factions or game modes are added to Squad.

#### Output
The output will be placed at `files/output/finished_$VERSION.json`.










### 3) JSON_Converter
This will convert SDK formatting into names used on the wiki.

#### Command
```
node JSON_Converter/main.js
```
#### Input
The previous step `raw_To_JSON` has produced `files/output/finished_$VERSION.json` - this is now automatically used as input for this step. You have to prepare nothing - just execute this step now.

#### Output
The output will be placed at `files/output/ConvertedJsonCombied_$VERSION.json`.

The following debug files are created for this step and can be found in `files/output/debug`:

* ConvertedJson.json    	- This contains both the raw and converted data.
* output_conversion     	- This shows a visualization of the data.
* outputdetailed_conversion - This shows a more detailed visualization of the data.












### 4) JSON_Wiki_Upload
**\*Note\*** Token configuration is required for this step - see [Configuration](configuration.md#Tokens).

This is used to take the data we've converted and upload it now to the wiki using the [MediaWiki API](https://www.mediawiki.org/wiki/API:Main_page). The data is placed in interim Data pages and then goes automatically into the Cargo tables.

#### Command
**Note** Once this is executed there is no going back!
```
node JSON_Wiki_Upload/main.js
```
#### Input
The previous step `JSON_Converter` has produced `files/output/ConvertedJsonCombied_$VERSION.json` - this is now automatically used as input for this step. You have to prepare nothing - just execute this step now.

#### Output
All of the data is uploaded into the interim Data pages of the wiki. If there was previous content on these Data pages, it is completely replaced with the new data. If you run this step for the first time, the Data pages are created automatically (but **not** deleted automatically if they are no longer needed).

The following debug files are created for this step and can be found in `files/output/debug`:

* CargoDebug.txt - This contains the text that is sent to the wiki Data pages.
* error.json 	- This contains the response from the wiki.
* MapLayers.json - This contains the data right before formatting into cargo tables in JSON form.













## Troubleshooting
The following errors could occur - if so, please follow the instructions to fix them.

### JSON_Converter
`unhandledPromiseRejectionWarning:  is not in the Map file... (Name Invalid or Non Existant)  {info}`

{info} will contain the team and layer name.

An error mentioning `not in the Map file` is a result of a vehicle not being added to the vehicleMap.json or a faction not being added to the factionMap.json. Fix it by updating the configuration files and running the scripts again.

It is possible for there to be no vehicle in a spawner, which will result in a blank vehicle name. To fix this problem, manually remove this entire line in `files/input/raw.txt` and restart processing from step 2 onwards.
