# Pipeline Configuration
The following files must be configured before running the pipeline.

**Important hint:** If Squad is updated with new vehicles, factions or game modes, you will also have to update the configuration files again. If there are unknown vehicles/factions/game modes in the raw file that have not be configured, an error will be thrown and the processing stops.



## Blacklist

Blacklists are used to prevent certain items from being converted. Items on the blacklist will remain in the raw file but will not be converted in the conversion step.

### layers.json:

The layer blacklist is used to prevent layers from being converted. This is typically restricted to training layers and layers that are present in the SDK but not the game.

Format:
```
{
    "blacklist": [
        "RAWLAYERNAME,
		"RAWLAYERNAME2"
    ]
}
```

Example:
```
{
    "blacklist": [
        "JensensRange_Training_v1",
        "JensensRange_Training_v2"
    ]
}
```

### setups.json:

The setup blacklist is used to prevent setups from being converted. This is typically restricted to setups that have no plan to be used in the game.

Format:
```
{
    "blacklist": [
        "SETUPNAME",
        "SETUPNAME2"
    ]
}
```

Example:
```
{
    "blacklist": [
        "Local Civilians that have some limited access to vehicles",
        "Local Civilians with no vehicles."
    ]
}
```




## factionMap.json
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




## flagMap.json
This is used to add faction flags to setups.

```
{
	"CONVERTED FACTION NAME": "WIKI NAME"
}
```

Example:
```
{
    "US_Army": "USArmy Flag.PNG",
    "British_Army": "GB flag.jpg"
}
```





## gamemodes.json
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


## main.json
There are only two settings in this file:

1) "version" - the current Squad release version. This is used to keep output files separate by version and for wiki commenting purposes.
2) "caf" - depreciated 

Example:
```
{
 	"version": "1.0",
 	"caf": false
}
```



## vehicleMap.json
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







## Tokens
In order to upload the data to the wiki a login name and password of a bot account are required on the wiki. See [Bot:Passwords](https://www.mediawiki.org/wiki/Manual:Bot_passwords) for more information about creating these.

Simply rename the file `wiki.example.json` to `wiki.json` and input your login name and login password to allow upload to the wiki. Do not share these details with anyone!

Example:
```
{
 	"lgname": "bot@bot",
 	"lgpassword": "your-bot-password"
}
```


