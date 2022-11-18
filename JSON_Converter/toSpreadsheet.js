const inputJson = require('../files/temp/finished.json')
const async = require(`async`)
const gamemodes = require('../files/config/gamemodes.json')

const fs = require("fs");
require.extensions['.txt'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
}

let loop = async() => {
    let string = ""
    let string2 = ""
    let currentMap = ""
    await asyncForEach(inputJson.Maps, async(layer) => {

        let gamemodeinfo = await findGamemode(layer.Name)
            

        let mapPage = layer.mapName
        let layerVersion = layer.Name.substring(gamemodeinfo.location + gamemodeinfo.gamemode.length + 1)
        let randomFactions = false
        if(currentMap !== mapPage){
            string += `\n`
            currentMap = mapPage
        }
        else {
            mapPage = ""
        }
        if(layer.team1.faction == ""){
            randomFactions = true
            if(layer.team1.factionSetups == undefined) layer.team1.factionSetups = [""]
            layer.team1.faction = `(${layer.team1.factionSetups.join("|")}) ${layer.team1.allowedAlliances.join(" ")}`
        }
        if(layer.team2.faction == ""){
            randomFactions = true
            if(layer.team2.factionSetups == undefined) layer.team2.factionSetups = [""]
            layer.team2.faction = `(${layer.team2.factionSetups.join("|")}) ${layer.team2.allowedAlliances.join(" ")}`
        }
        string += `${mapPage},${gamemodeinfo.gamemode} ${layerVersion}, ${layer.rawName}, ${layer.mapSize}, ${layer.lighting}, ${layer.team1.commander}, ${layer.capturePoints}, ${layer.type}, ${randomFactions}, ${layer.team1.faction}, ${layer.team2.faction}, ${layer.team1.tickets}, ${layer.team2.tickets}, \n`
        
        
        let currentGamemode = ""
        let currentFaction = ""
        let temp = currentMap
        if(layer.team1.vehicles == undefined){
            string2 += `${mapPage}, ${gamemodeinfo.gamemode} ${layerVersion}, ${layer.team1.faction}\n`
        }
        else {
            await asyncForEach(layer.team1.vehicles, async(vehicle) =>{
                combined = `${gamemodeinfo.gamemode} ${layerVersion}`
                if(currentGamemode !== combined){
                    string2 += `\n`
                    currentGamemode = combined
                }
                else {
                    combined = ""
                }

                if(currentFaction !== layer.team1.faction){
                    currentFaction = layer.team1.faction
                }
                else {
                    layer.team1.faction = ""
                }
                string2 += ` ${temp}, ${combined}, ${layer.team1.faction}, ${vehicle.type}, ${vehicle.count}, ${vehicle.delay}, ${vehicle.respawnTime}\n`
                temp = ""
                return
            })
        }
        if(layer.team2.vehicles == undefined){
            string2 += `${mapPage}, ${gamemodeinfo.gamemode} ${layerVersion}, ${layer.team2.faction}\n`
        }
        else {
            let combined = ""
            await asyncForEach(layer.team2.vehicles, async(vehicle) =>{
                combined = `${gamemodeinfo.gamemode} ${layerVersion}`
                if(currentGamemode !== combined){
                    string2 += `\n`
                    currentGamemode = combined
                }
                else {
                    combined = ""
                }

                if(currentFaction !== layer.team2.faction){
                    currentFaction = layer.team2.faction
                }
                else {
                    layer.team2.faction = ""
                }
                string2 += ` ${temp}, ${combined}, ${layer.team2.faction}, ${vehicle.type}, ${vehicle.count}, ${vehicle.delay}, ${vehicle.respawnTime}\n`
                return
            })
            
        }

        return
    });

    console.log(string)
    fs.writeFileSync('.files/output/LayerSheet.csv',string)
    fs.writeFileSync('.files/output/Vehicles.csv',string2)
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

loop()