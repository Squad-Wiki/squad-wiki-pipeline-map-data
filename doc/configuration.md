# Pipeline Configuration
The following files must be configured before running the pipeline.

**Important hint:** If Squad is updated with new vehicles, factions or game modes, you will also have to update the configuration files again. If there are unknown vehicles/factions/game modes in the raw file that have not be configured, an error will be thrown and the processing stops.





### factionMap.json
This is used to convert from the JSON output to the correct Wiki pages and phrasing.

Format:
```
{
 	"JSON NAME": "WIKI NAME"
}
```

Example:
```
{
 	"Militia": "Irregular Militia"
}
```







### gamemodes.json
This is used to determine what part of a map's name is a game mode.

Format:
```
{
 	"Gamemodes": [
      	"GAMEMODE NAME 1",
      	"GAMEMODE NAME 2"
 	]
}
```

Example:
```
{
 	"Gamemodes": [
      	"RAAS",
      	"Insurgency"
 	]
}
```







### main.json
There are only two settings in this file:

1) "version" - the current Squad release version. This is used to keep output files separate by version and for wiki commenting purposes.
2) "caf" - boolean for if there is a CAF raw file. If there is not a separate raw output for CAF then set this to false.

CAF stands for a playable faction in Squad that was added as DLC to the game (see [faction page](https://squad.gamepedia.com/Canadian_Army)). Because it is a DLC and not included in the Squad SDK, the export process works slightly differently and, if the flag is set, two exports (one from the Squad SDK and one for the CAF DLC) are merged together into one JSON file.

Example:
```
{
 	"version": "1.0",
 	"caf": false
}
```







### rawtojson.json
This is used to convert from the SDK naming convention for factions to names used on the wiki.

Format:
```
{
 	"Teams": {
      	"FACTION1SDK NAME": "READABLE NAME FACTION1",
      	"FACTION2SDK NAME": "READABLE NAME FACTION2"
 	}
}
```

Example:
```
{
 	"Teams": {
      	"INS": "Insurgency",
      	"MIL": "Militia"
 	}
}
```







### vehicleMap.json
This is used to convert from the SDK naming convention for vehicles to names used on the wiki.

**_Name** must correspond exactly to the existing vehicle wiki pages and **_DisplayName** is the vehicle name shown; for vehicle variants, the actual variant is shown in the _DisplayName. For example with the different [M-ATV vehicles](https://squad.gamepedia.com/M-ATV), the Standard and CROWS, will both have the _Name *"M-ATV"* but differing _DisplayNames, *"M-ATV"* and *"M-ATV CROWS"* respectively.

Format:
```
{
 	"SDK RAW NAME_Name": "GENERAL VEHICLE NAME",
 	"SDK RAW NAME_DisplayName": "MORE SPECIFC NAME"
}
```

Example:
```
{
 	"BP_Technical_Dshk_INS_C_Name": "Technical",
 	"BP_Technical_Dshk_INS_C_DisplayName": "Technical DShK-M"
}
```








### Tokens
In order to upload the data to the wiki a login name and password of a bot account are required on the wiki. See [Bot:Passwords](https://www.mediawiki.org/wiki/Manual:Bot_passwords) for more information about creating these.

Simply rename the file `wiki.example.json` to `wiki.json` and input your login name and login password to allow upload to the wiki. Do not share these details with anyone!

Example:
```
{
 	"lgname": "bot@bot",
 	"lgpassword": "your-bot-password"
}
```


