# SDK Data Extraction Usage

Once [installation](/doc/installation.md) is complete the SDK data extraction will activate upon any map loading in the SDK. To extract all data you must open up the very first gameplay layer. This layer should be Anvil AAS v1.

Once the above is completed hit `Play` to initiate the map loading, then the SDK data extraction will start. It will automatically cycle through all the maps and layers - this will take quite a long time. 

![Hit Play](/doc/images/sdk/sdk_play.png)

If the pipeline ends right away (the game spits you back out into the editor) then it most like ran into an error. Check the `error.txt` file in `Squad SDK\SquadEditor\Squad\grabAssets\debug`.

All data will output to the file `Squad SDK\SquadEditor\Squad\grabAssets\maps.json`.

In case you want to disable the SDK data extraction in your Squad SDK you must unlink the function node within BP_HUD.

The pipeline is smart and will resume where you left off. If your editor crashed or you paused the piepline simply load back up into the first layer and hit play. The pipeline will find the next not logged map and resume from there.

