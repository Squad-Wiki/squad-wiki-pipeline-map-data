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
        let finisheddivisions = []
        // Loop through each division and create an object with the data we will need in a format similar to the cargo tables.
        await asyncForEach(convertedJson.Setups, async(division) => {
            if(finisheddivisions[division.faction] == undefined) finisheddivisions[division.faction] = []
            let tempdivision = {
                faction: division.faction, type: division.type, name: division.name, longname: division.longName, badge: division.badge, info: ""
            }

            finaldivision = {}
            finaldivision.division = tempdivision
            finaldivision.vehicles = []

            await asyncForEach(division.vehicles, async(vehicle) => {
                let tempVeh = {
                    faction: division.faction, divisionname: division.name, vehicle: vehicle.Name, vehicledisplayname: vehicle.DisplayName,
                    count: vehicle.Count, delay: vehicle.Delay , icon: vehicle.icon
                }
                finaldivision.vehicles.push(tempVeh)
            })
            finisheddivisions[division.faction].push(finaldivision)
            
        })
        await asyncForEach(convertedJson.Maps, async(layer) => {
            //--------------------------
            //- division Map Layers Table -
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
            tempMapLayer.Team1Faction = layer.team1.faction
            tempMapLayer.Team1Tickets = layer.team1.tickets
            tempMapLayer.Team2Faction = layer.team2.faction
            tempMapLayer.Team2Tickets = layer.team2.tickets
            tempMapLayer.CapturePoints = layer.CapturePoints



            //------------------------------
            //- division Vehicle Assets Table -
            //------------------------------

            let tempVehicleAssets = []

            await asyncForEach(layer.team1.vehicles, (vehicle) => {
                let tempVehicleAsset = {}
                tempVehicleAsset.MapPage = MapPage
                tempVehicleAsset.GameMode = gamemodeinfo.gamemode
                tempVehicleAsset.LayerVersion = LayerVersion
                tempVehicleAsset.TeamFaction = layer.team1.faction
                tempVehicleAsset.Vehicle = vehicle.Name
                tempVehicleAsset.VehicleDisplayName = vehicle.DisplayName
                tempVehicleAsset.Count = vehicle.Count
                tempVehicleAsset.Delay = vehicle.Delay
                tempVehicleAsset.icon = vehicle.icon

                tempVehicleAssets.push(tempVehicleAsset)
            })

            await asyncForEach(layer.team2.vehicles, (vehicle) => {
                let tempVehicleAsset = {}
                tempVehicleAsset.MapPage = MapPage
                tempVehicleAsset.GameMode = gamemodeinfo.gamemode
                tempVehicleAsset.LayerVersion = LayerVersion
                tempVehicleAsset.TeamFaction = layer.team2.faction
                tempVehicleAsset.Vehicle = vehicle.Name
                tempVehicleAsset.VehicleDisplayName = vehicle.DisplayName
                tempVehicleAsset.Count = vehicle.Count
                tempVehicleAsset.Delay = vehicle.Delay
                tempVehicleAsset.icon = vehicle.icon

                tempVehicleAssets.push(tempVehicleAsset)
            })

            let MapLayer = {}
            MapLayer.MapLayerInfo = tempMapLayer
            MapLayer.VehicleAssets = tempVehicleAssets

            if(MapLayers[MapPage] === undefined) MapLayers[MapPage] = []
            MapLayers[MapPage].push(MapLayer)
        })
        let object = {
            MapLayers: MapLayers,
            finisheddivisions: finisheddivisions
        }
        return object
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

                var Team1Faction = map.team1.faction;
                var Team1Tickets = map.team1.tickets;

                var Team2Faction = map.team2.faction;
                var Team2Tickets = map.team2.tickets;
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