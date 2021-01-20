var fs = require("fs");

let config = require('../files/config/rawtojson.json')
let mainconfig = require('../files/config/main.json');

let lightingMap = require('../files/config/lightingMap.json')
const { info } = require("console");

const gamemodes = require('../files/config/gamemodes.json')

const layers = []

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


let loop = async(remaninglines, output, output2) => {

    //current = resetCurrent()

    let finishedJson = []
    let finishedSetups = []
    let temp = null
    currentMap = {}
    let tempLane = ""
    currentSetup = {}

    while(remaninglines.indexOf("\n") >= -1){
        let lineEnd = remaninglines.indexOf("\n")
        let line = remaninglines.substring(0, lineEnd - 1)
        remaninglines = remaninglines.substring(lineEnd + 1, remaninglines.length)


        prefix = line.substring(line.indexOf("[") + 1, line.indexOf("]"))
        switch(prefix) {
            case "Setup_Data":
                datatype = line.substring(prefix.length + 3, line.indexOf(":"))
                data = line.substring(line.indexOf(":") + 2, line.length)
                
                if(Object.keys(currentSetup).length === 0) {
                    currentSetup[datatype] = data
                    break;
                }
                else {
                    if(line.includes("faction:")){
                        finishedSetups.push(currentSetup)
                        currentSetup = {}
                    }
                }
                currentSetup[datatype] = data
                break;
            case "Setup":
                datatype = line.substring(prefix.length + 3, line.indexOf(":"))
                data = line.substring(line.indexOf(":") + 2, line.length)
                if(datatype == 'New_Veh') {
                    datatype = "vehicles"
                    if(currentSetup[datatype] == undefined) currentSetup[datatype] = []
                    tempdata = {}

                    tempdata.type = data.substring(0, data.indexOf(" x "))
                    tempdata.count = data.substring(data.indexOf(" x ") + 3, data.indexOf(" |"))
                    tempdata.delay = parseInt(data.substring(data.indexOf("Spawn Time: ") + 12, data.indexOf(" | Respawn Time: ")))
                    tempdata.respawnTime = parseInt(data.substring(data.indexOf(" | Respawn Time: ") + 17, data.indexOf(" | Raw Name:")))
                    tempdata.rawType = data.substring(data.indexOf(".") + 1, data.indexOf(" | Icon: "))
                    tempdata.icon = data.substring(data.indexOf('.', data.indexOf(".") + 1) + 1, data.length)
                    data = tempdata

                }
                if(currentSetup[datatype] != undefined) {
                    if(Array.isArray(currentSetup[datatype])){
                        currentSetup[datatype].push(data)
                    }
                    else {
                        temp = currentSetup[datatype]
                        currentSetup[datatype] = []
                        currentSetup[datatype].push(temp)
                        currentSetup[datatype].push(data)
                    }
                }
                else {
                    currentSetup[datatype] = data
                }
                break;
            case "Data":
                if(line.includes("name:")){
                    //// New Map Detected
                    if(Object.keys(currentMap).length === 0) {
                        currentMap.Name = line.substring(13, line.length)
                        break;
                    }
                    let gamemodeinfo = await findGamemode(currentMap.Name)
            

                    let mapPage = currentMap.Name.substring(0, gamemodeinfo.location - 1)
                    let layerVersion = currentMap.Name.substring(gamemodeinfo.location + gamemodeinfo.gamemode.length + 1)
                    currentMap.mapName = mapPage
                    currentMap.gamemode = gamemodeinfo.gamemode
                    currentMap.layerVersion = layerVersion

                    if(currentMap.border == undefined){
                        currentMap.mapSize = ("0x0 km")
                    }
                    else {
                        tempBorderInfo = await borderCaculator(currentMap.border)
                        currentMap.mapSize = tempBorderInfo.mapSize
                        if(currentMap.border.length > 2){
                            currentMap.mapSizeType = "Playable Area"
                        }
                        else {
                            currentMap.mapSizeType = "Minimap Size"
                        }
                    }

                    if(currentMap.team1.Faction == undefined && currentMap.team1.allowedAlliances == undefined){
                        currentMap.team1.allowedAlliances = [
                            "BLUFOR",
                            "REDFOR",
                            "INDEPENDENT"
                        ]
                    }
                    if(currentMap.team2.Faction == undefined && currentMap.team2.allowedAlliances == undefined){
                        currentMap.team2.allowedAlliances = [
                            "BLUFOR",
                            "REDFOR",
                            "INDEPENDENT"
                        ]
                    }
                    finishedJson.push(currentMap)
                    currentMap = {}
                    currentMap.Name = line.substring(13, line.length)
                    
                }

                if(line.includes("mapRawName:")){
                    currentMap.rawName = line.substring(19, line.length)
                }

                if(line.includes("team:")){
                    if(line.includes("Team One")){
                        currentTeam = "team1"
                    }
                    else currentTeam = "team2"
                    currentMap[currentTeam] = {}
                }

                if(line.includes("lightingLevel:")){
                    currentMap.lightingLevel = line.substring(22, line.length)

                    let temp = lightingMap[currentMap.lightingLevel]
                    if(temp == undefined) throw new Error(`Invalid Lighting Level. Lighting Level Not Found In Map: ${line}` )
                    currentMap.lighting = temp
                }
                break;


            case "Team":
                datatype = line.substring(prefix.length + 3, line.indexOf(":"))
                data = line.substring(line.indexOf(":") + 2, line.length)
                if(datatype == 'New_Veh') {
                    datatype = "vehicles"
                    if(team[datatype] == undefined) team[datatype] = []
                    tempdata = {}

                    tempdata.type = data.substring(0, data.indexOf(" x "))
                    tempdata.count = parseInt(data.substring(data.indexOf(" x ") + 3, data.indexOf(" |")))
                    tempdata.delay = parseInt(data.substring(data.indexOf("Spawn Time: ") + 12, data.indexOf(" | Respawn Time: ")))
                    tempdata.respawnTime = parseInt(data.substring(data.indexOf(" | Respawn Time: ") + 17, data.indexOf(" | Raw Name:")))
                    tempdata.rawType = data.substring(data.indexOf(".") + 1, data.indexOf(" | Icon: "))
                    tempdata.icon = data.substring(data.indexOf('.', data.indexOf(".") + 1) + 1, data.length)
                    data = tempdata

                }


                team = currentMap[currentTeam]

                if(team[datatype] != undefined) {
                    if(Array.isArray(team[datatype])){
                        team[datatype].push(data)
                    }
                    else {
                        temp = team[datatype]
                        team[datatype] = []
                        team[datatype].push(temp)
                        team[datatype].push(data)
                    }
                }
                else {
                    if(datatype == `allowedAlliances` || datatype == `factionSetups`){ //Special case to make these always arrays
                        team[datatype] = []
                        team[datatype].push(data)
                    }
                    else {
                        team[datatype] = data
                    }
                }
                break;
            case "Flags":
                datatype = line.substring(prefix.length + 3, line.indexOf(":"))
                data = line.substring(line.indexOf(":") + 2, line.length)
                if(datatype == "Lane") {
                    tempLane = data
                    break;
                }
                if(currentMap.type !== undefined && currentMap.type.includes("RAASLane Graph")) {
                    if(datatype == "Flag"){
                        if(currentMap.lanes == undefined) currentMap.lanes = {}
                        if(currentMap.lanes[tempLane] == undefined) currentMap.lanes[tempLane] = []
                        currentMap.lanes[tempLane].push(data)
                    }
                    else {
                        if(currentMap[datatype] != undefined) {
                            if(Array.isArray(currentMap[datatype])){
                                currentMap[datatype].push(data)
                            }
                            else {
                                temp = currentMap[datatype]
                                currentMap[datatype] = []
                                currentMap[datatype].push(temp)
                                currentMap[datatype].push(data)
                            }
                        }
                        else {
                            currentMap[datatype] = data
                        }
                    }
                }
                else{
                    if(currentMap[datatype] != undefined) {
                        if(Array.isArray(currentMap[datatype])){
                            currentMap[datatype].push(data)
                        }
                        else {
                            temp = currentMap[datatype]
                            currentMap[datatype] = []
                            currentMap[datatype].push(temp)
                            currentMap[datatype].push(data)
                        }
                    }
                    else {
                        currentMap[datatype] = data
                    }

                }
                break;
            case "Border":
                borderpos = {}
                borderpos.x = parseInt(line.substring(line.indexOf("X=") + 2, line.indexOf(" Y=")))
                borderpos.y = parseInt(line.substring(line.indexOf("Y=") + 2, line.indexOf(" Z=")))
                borderpos.z = parseInt(line.substring(line.indexOf("Z=") + 2, line.length - 1))
                if(currentMap.border == undefined) currentMap.border = []
                currentMap.border.push(borderpos)
                break;
            case "Error":
                throw new Error(line)
                break;
            default:
                if(line = "\r") break
                console.log(line)
                throw new Error("Invalid Data Type:" + line)
                break;
        }

        if (remaninglines.indexOf("\n") == -1) {
            tempBorderInfo = await borderCaculator(currentMap.border)
                        currentMap.mapSize = tempBorderInfo.mapSize
                        if(currentMap.border.length > 2){
                            currentMap.mapSizeType = "Playable Area"
                        }
                        else {
                            currentMap.mapSizeType = "Minimap Size"
                        }
            finishedJson.push(currentMap)
            break; // If there are no new line characters we have no more lines left
        }
    }
    writejson = {}
    writejson.Setups = finishedSetups
    writejson.Maps = finishedJson
    
    fs.writeFileSync(output, JSON.stringify(writejson, null, 4))
    fs.writeFileSync(output2, JSON.stringify(writejson, null, 4))
    return
}


borderCaculator = async(border) => {
    distance = {}
    distance.maxx = 0, distance.maxy = 0, distance.lowx = 9999999999, distance.lowy = 9999999999
    border.forEach(borderelement => {
        absx = borderelement.x
        absy = borderelement.y
        if(absx > distance.maxx) distance.maxx = absx
        if(absy > distance.maxy) distance.maxy = absy
        if(absx < distance.lowx) distance.lowx = absx
        if(absy < distance.lowy) distance.lowy = absy
    });
    distance.x = (parseFloat(distance.maxx - distance.lowx) / 100000).toFixed(1)
    distance.y = (parseFloat(distance.maxy - distance.lowy) / 100000).toFixed(1)
    output = {}
    output.mapSize = `${distance.x}x${distance.y} km`
    output.x = distance.x
    output.y = distance.y
    return output
}

main = async() => {
    require.extensions['.txt'] = function (module, filename) {
        module.exports = fs.readFileSync(filename, 'utf8');
    };

    let remaninglines = require('../files/input/raw.txt')
    let output = './files/temp/finished.json'
    let output2 = `./files/output/finished_${mainconfig.version}.json`
    await loop(remaninglines, output, output2)
    if(!mainconfig.caf) return;
    remaninglines = require('../files/input/raw_caf.txt')
    output = './files/temp/finishedCAF.json'
    output2 = `./files/output/finished_caf_${mainconfig.version}.json`
    await loop(remaninglines, output, output2)
    //fs.writeFileSync(`./layers.json`,layers)
}

main()