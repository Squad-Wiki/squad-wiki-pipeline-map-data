const convertedJson = require('../../files/temp/ConvertedJsonCombined.json');

const gamemodes = require('../../files/config/gamemodes.json')



async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
}

const findGamemode = async(text) => {
    let location = -1

    let i = 0
    // Try to find the location of the gamemode in the map name string. Looping through each gamemode to search for each one.

    for(i = 0; i < gamemodes.Gamemodes.length; i++){
        location = text.indexOf(gamemodes.Gamemodes[i])
        if (location != -1) break;
    }

    // If we couldn't find the gamemode throw and error and stop here.
    if(location == -1) throw("Couldn't find a gamemode for: " + text);

    return {
        location: location, 
        gamemode: gamemodes.Gamemodes[i]
    }
}

module.exports = {
    wikiformat: async() => {
        console.log("Setting up each layer into the correct data format...");
        let MapLayers = {}

        // Loop through each map and create an object with the data we will need in a format similar to the cargo tables.
        await asyncForEach(convertedJson.Maps, async(layer) => {
            //--------------------------
            //- Setup Map Layers Table -
            //--------------------------

            let gamemodeinfo = await findGamemode(layer.Name)
            

            let MapPage = layer.Name.substring(0, gamemodeinfo.location - 1)
            let LayerVersion = layer.Name.substring(gamemodeinfo.location + gamemodeinfo.gamemode.length + 1)
            if(MapPage.includes("CAF")) {
                LayerVersion += " CAF"
                MapPage = MapPage.substring(4, MapPage.length)
            }

            let tempMapLayer = {}
            tempMapLayer.MapPage = MapPage
            tempMapLayer.GameMode = gamemodeinfo.gamemode
            tempMapLayer.LayerVersion = LayerVersion
            tempMapLayer.Team1Faction = layer.Team1.Faction
            tempMapLayer.Team1Tickets = layer.Team1.Tickets
            tempMapLayer.Team2Faction = layer.Team2.Faction
            tempMapLayer.Team2Tickets = layer.Team2.Tickets
            tempMapLayer.CapturePoints = layer.CapturePoints



            //------------------------------
            //- Setup Vehicle Assets Table -
            //------------------------------

            let tempVehicleAssets = []

            await asyncForEach(layer.Team1.Vehicles, (vehicle) => {
                let tempVehicleAsset = {}
                tempVehicleAsset.MapPage = MapPage
                tempVehicleAsset.GameMode = gamemodeinfo.gamemode
                tempVehicleAsset.LayerVersion = LayerVersion
                tempVehicleAsset.TeamFaction = layer.Team1.Faction
                tempVehicleAsset.Vehicle = vehicle.Name
                tempVehicleAsset.VehicleDisplayName = vehicle.DisplayName
                tempVehicleAsset.Count = vehicle.Count
                tempVehicleAsset.Delay = vehicle.Delay

                tempVehicleAssets.push(tempVehicleAsset)
            })

            await asyncForEach(layer.Team2.Vehicles, (vehicle) => {
                let tempVehicleAsset = {}
                tempVehicleAsset.MapPage = MapPage
                tempVehicleAsset.GameMode = gamemodeinfo.gamemode
                tempVehicleAsset.LayerVersion = LayerVersion
                tempVehicleAsset.TeamFaction = layer.Team2.Faction
                tempVehicleAsset.Vehicle = vehicle.Name
                tempVehicleAsset.VehicleDisplayName = vehicle.DisplayName
                tempVehicleAsset.Count = vehicle.Count
                tempVehicleAsset.Delay = vehicle.Delay

                tempVehicleAssets.push(tempVehicleAsset)
            })

            let MapLayer = {}
            MapLayer.MapLayerInfo = tempMapLayer
            MapLayer.VehicleAssets = tempVehicleAssets

            if(MapLayers[MapPage] === undefined) MapLayers[MapPage] = []
            MapLayers[MapPage].push(MapLayer)
        })

        return MapLayers
    }
}


/* module.exports = {
    wikiformat: function(callback){
        console.log("Setting up each layer into the correct data format");
        finishedjson.Maps.forEach(map => {
            if(map.Name.includes("GPU")) return; // We can add custom ignores here
            if(map.Name.includes("Wargame")) map.Name = map.Name.substring(0, map.Name.length - 8)
            findGamemode(map.Name, (gameLocation, gamemode) => {

                var mapName = map.Name.substring(0, gameLocation - 1)
                var version = map.Name.substring(gameLocation + gamemode.length + 1, map.Name.length);

                var Team1Faction = map.Team1.Faction;
                var Team1Tickets = map.Team1.Tickets;

                var Team2Faction = map.Team2.Faction;
                var Team2Tickets = map.Team2.Tickets;
                console.log(version);
            });
        });
    }
}

// Find the location of the gamemode
function findGamemode(text, callback){
    var location = -1;
    var exit = false;
    var i = -1;
    while(!exit) {
        i++;
        location = text.indexOf(gamemodes[i]);
        if (location != -1) exit = true;
        if (i >= gamemodes.length) exit = true;
    }
    if(location == -1) throw("Couldn't find a gamemode for: " + text);
    callback(location, gamemodes[i]);
}

//`{{Category: Map data}}` */