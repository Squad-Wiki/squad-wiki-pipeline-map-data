var fs = require("fs");

let config = require('../files/config/rawtojson.json')
let mainconfig = require('../files/config/main.json');

let lightingMap = require('../files/config/lightingMap.json')
const { info } = require("console");

const gamemodes = require('../files/config/gamemodes.json')

const layers = []
const layers2 = []

let currentMap = {}
let currentVeh = []

const findGamemode = async (text) => {
    let location = -1

    let i = 0
    // Try to find the location of the gamemode in the map name string. Looping through each gamemode to search for each one.

    for (i = 0; i < gamemodes.Gamemodes.length; i++) {
        location = text.indexOf(gamemodes.Gamemodes[i])
        if (location != -1) break;
    }

    // If we couldn't find the gamemode throw and error and stop here.
    if (location == -1) {
        console.log(text)
        throw ("Couldn't find a gamemode for: " + text);
    }

    return {
        location: location,
        gamemode: gamemodes.Gamemodes[i]
    }
}

const addToObject = async (object, dataType, data, objecttype) => {
    if (data.includes(" | ")) {
        let seperate1 = data.substring(0, data.indexOf(" |"))
        let seperate2 = data.substring(data.indexOf("| ") + 2, data.length)
        data = {}
        data[seperate1] = seperate2
    }
    if (dataType == "icon") data = data.substring(data.indexOf('.', data.indexOf(".") + 1) + 1, data.length)
    object.type = objecttype
    if (object.currentObject == undefined) object.currentObject = {}

    if (object.currentObject[dataType] != undefined) {
        if (Array.isArray(object.currentObject[dataType])) {
            object.currentObject[dataType].push(data)
        }
        else {
            temp = object.currentObject[dataType]
            object.currentObject[dataType] = []
            object.currentObject[dataType].push(temp)
            object.currentObject[dataType].push(data)
        }
    }
    else {
        if (dataType == "priority") {
            object.currentObject[dataType] = []
            object.currentObject[dataType].push(data)
        }
        else {
            object.currentObject[dataType] = data
        }
    }

    return object
}


const finishObject = async (object) => {
    if (object.type == "") return null
    if (currentMap[object.type] == undefined) {
        currentMap[object.type] = []
        if (object.currentObject != {}) {
            currentMap[object.type].push(object.currentObject)
            object = {
                'type': "",
                'currentObject': {}
            }
        }
    }
    else {
        currentMap[object.type].push(object.currentObject)
        object = {
            'type': "",
            'currentObject': {}
        }
    }
    returnObject = object
    return returnObject
}


const finishObjectveh = async (object) => {
    if (object.type == "") return null
    currentVeh.push(object.currentObject)

    object = {
        'type': "",
        'currentObject': {}
    }

    returnObject = object
    return returnObject
}


let loop = async (remaninglines, output, output2) => {

    //current = resetCurrent()

    let finishedJson = []
    let finishedSetups = []
    let temp = null
    currentMap = {}
    let tempLane = ""
    let currentSetup = {}
    let currentRole = {}

    let workingObject = {
        'type': "",
        'currentObject': {}
    }

    let workingObjectVeh = {
        'type': "",
        'currentObject': {}
    }

    while (remaninglines.indexOf("\n") >= -1) {
        let lineEnd = remaninglines.indexOf("\n")
        let line = remaninglines.substring(0, lineEnd - 1)
        remaninglines = remaninglines.substring(lineEnd + 1, remaninglines.length)


        prefix = line.substring(line.indexOf("[") + 1, line.indexOf("]"))
        let data = "", datatype = ""
        datatype = line.substring(prefix.length + 3, line.indexOf(":"))
        data = line.substring(line.indexOf(":") + 2, line.length)
        switch (prefix) {
            case "Setup_Data":
                if (Object.keys(currentSetup).length === 0) {
                    currentSetup[datatype] = data
                    break;
                }
                else {
                    if (line.includes("faction:")) {
                        finishedSetups.push(currentSetup)
                        currentSetup = {}
                    }
                }
                currentSetup[datatype] = data
                break;
            case "Setup":

                if (datatype == 'New_Veh') {
                    datatype = "vehicles"
                    if (currentSetup[datatype] == undefined) currentSetup[datatype] = []
                    tempdata = {}

                    tempdata.type = data.substring(0, data.indexOf(" x "))
                    tempdata.count = data.substring(data.indexOf(" x ") + 3, data.indexOf(" |"))
                    tempdata.delay = parseInt(data.substring(data.indexOf("Spawn Time: ") + 12, data.indexOf(" | Respawn Time: ")))
                    tempdata.respawnTime = parseInt(data.substring(data.indexOf(" | Respawn Time: ") + 17, data.indexOf(" | Raw Name:")))
                    tempdata.rawType = data.substring(data.indexOf(".") + 1, data.indexOf(" | Icon: "))
                    tempdata.icon = data.substring(data.indexOf('.', data.indexOf(".") + 1) + 1, data.length)
                    data = tempdata

                }
                if (currentSetup[datatype] != undefined) {
                    if (Array.isArray(currentSetup[datatype])) {
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
            case "Role":
                if (datatype == "inventory") {
                    data = data.substring(data.indexOf(".") + 1, data.length)
                }
                if (datatype == `object_name`) {
                    if (currentSetup.roles == undefined) currentSetup.roles = []
                    currentSetup.roles.push(currentRole)
                    currentRole = {}
                }
                let role = currentRole
                if (role[datatype] != undefined) {
                    if (Array.isArray(role[datatype])) {
                        role[datatype].push(data)
                    }
                    else {
                        temp = role[datatype]
                        role[datatype] = []
                        role[datatype].push(temp)
                        role[datatype].push(data)
                    }
                }
                else {
                    role[datatype] = data
                }
                break;
            case "Data":
                if (line.includes("name:")) {
                    if (currentSetup != undefined) {
                        finishedSetups.push(currentSetup)
                        currentSetup = undefined
                    }
                    //// New Map Detected
                    if (Object.keys(currentMap).length === 0) {
                        currentMap.Name = line.substring(13, line.length)
                        break;
                    }

                    if (currentMap.rawName.includes("CAF")) {
                        tempName = currentMap.Name.substring(4, currentMap.Name.length)
                    }
                    else {
                        tempName = currentMap.Name
                    }
                    console.log(line)
                    let gamemodeinfo = await findGamemode(tempName)

                    let mapPage = tempName.substring(0, gamemodeinfo.location - 1).replaceAll("_", " ")
                    let layerVersion = tempName.substring(gamemodeinfo.location + gamemodeinfo.gamemode.length + 1)
                    currentMap.mapName = mapPage
                    currentMap.gamemode = gamemodeinfo.gamemode
                    currentMap.layerVersion = layerVersion
                    if (currentMap.border == undefined) {
                        currentMap.mapSize = ("0x0 km")
                    }
                    else {
                        tempBorderInfo = await borderCaculator(currentMap.border)
                        currentMap.mapSize = tempBorderInfo.mapSize
                        if (currentMap.border.length > 2) {
                            currentMap.mapSizeType = "Playable Area"
                        }
                        else {
                            currentMap.mapSizeType = "Minimap Size"
                        }
                    }

                    if (currentMap.team1.faction == "" && currentMap.team1.allowedAlliances == undefined) {
                        currentMap.team1.allowedAlliances = [
                            "BLUFOR",
                            "REDFOR",
                            "INDEPENDENT"
                        ]
                    }
                    console.log(currentMap.Name)
                    console.log(currentMap.team1.faction)
                    console.log(currentMap.team2.faction)
                    if (currentMap.team2.faction == "" && currentMap.team2.allowedAlliances == undefined) {
                        currentMap.team2.allowedAlliances = [
                            "BLUFOR",
                            "REDFOR",
                            "INDEPENDENT"
                        ]
                    }

                    await finishObject(workingObject)
                    if (returnObject !== null) workingObject = returnObject

                    finishedJson.push(currentMap)
                    currentMap = {}
                    currentMap.Name = line.substring(13, line.length)

                }

                if (line.includes("mapRawName:")) {
                    currentMap.rawName = line.substring(19, line.length)
                }

                if (line.includes("mapLevelName:")) {
                    currentMap.levelName = line.substring(21, line.length)
                }

                if (line.includes("minimapTexture:")) {
                    currentMap.minimapTexture = line.substring(23, line.length)
                }

                if (line.includes("team:")) {
                    if (line.includes("Team One")) {
                        currentTeam = "team1"
                    }
                    else currentTeam = "team2"
                    currentMap[currentTeam] = {}
                }

                if (line.includes("lightingLevel:")) {
                    currentMap.lightingLevel = line.substring(22, line.length)

                    let temp = lightingMap[currentMap.lightingLevel]
                    if (temp == undefined) throw new Error(`Invalid Lighting Level. Lighting Level Not Found In Map: ${line}`)
                    currentMap.lighting = temp
                }
                break;
            case "Team":
                if (datatype == 'New_Veh') {
                    datatype = "vehicles"
                    if (team[datatype] == undefined) team[datatype] = []
                    tempdata = {}

                    tempdata.type = data.substring(0, data.indexOf(" x "))
                    tempdata.count = parseInt(data.substring(data.indexOf(" x ") + 3, data.indexOf(" |")))
                    tempdata.delay = parseInt(data.substring(data.indexOf("Spawn Time: ") + 12, data.indexOf(" | Respawn Time: ")))
                    tempdata.respawnTime = parseInt(data.substring(data.indexOf(" | Respawn Time: ") + 17, data.indexOf(" | Raw Name:")))
                    tempdata.rawType = data.substring(data.indexOf(".") + 1, data.indexOf(" | Icon: "))
                    tempdata.icon = data.substring(data.indexOf('.', data.indexOf(".") + 1) + 1, data.indexOf(" | spawner_Size: "))
                    tempdata.spawner_Size = data.substring(data.indexOf(" | spawner_Size: ") + 17, data.length)
                    switch (tempdata.rawType) {
                        default:

                            let found = false
                            layers.forEach(currentLayer => {
                                if (currentLayer == currentMap.rawName+'\n') found = true
                            });
                            console.log(found)
                            if (!found) layers.push(currentMap.rawName + '\n')
                            break;
                    }
                    data = tempdata

                }


                team = currentMap[currentTeam]

                if (team[datatype] != undefined) {
                    if (Array.isArray(team[datatype])) {
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
                    if (datatype == `allowedAlliances` || datatype == `factionSetups`) { //Special case to make these always arrays
                        team[datatype] = []
                        team[datatype].push(data)
                    }
                    else {
                        team[datatype] = data
                    }
                }
                break;
            case "Flags":
                if (datatype == "Lane") {
                    tempLane = data
                    break;
                }
                if (currentMap.type !== undefined && currentMap.type.includes("RAASLane Graph")) {
                    if (datatype == "Flag") {
                        if (currentMap.lanes == undefined) currentMap.lanes = {}
                        if (currentMap.lanes[tempLane] == undefined) currentMap.lanes[tempLane] = []
                        currentMap.lanes[tempLane].push(data)
                    }
                    else {
                        if (currentMap[datatype] != undefined) {
                            if (Array.isArray(currentMap[datatype])) {
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
                else {
                    if (currentMap[datatype] != undefined) {
                        if (Array.isArray(currentMap[datatype])) {
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
                if (datatype == "point") {
                    let returnObject = await finishObject(workingObject)
                    if (returnObject !== null) workingObject = returnObject
                }
                workingObject = await addToObject(workingObject, datatype, data, "border")
                break;
                 case "PointMain":
                 if(datatype == "name"){
                     let returnObject = await finishObject(workingObject)
                     if(returnObject !== null ) workingObject = returnObject
                 }
                 workingObject = await addToObject(workingObject, datatype, data, "pointsMain")
                 break;
             case "Point":
                 if(datatype == "name"){
                      let returnObject = await finishObject(workingObject)
                     if(returnObject !== null ) workingObject = returnObject
                 }
                 workingObject = await addToObject(workingObject, datatype, data, "points")
                 break;
             case "Spawner":
                 if(datatype == "name"){
                     let returnObject = await finishObject(workingObject)
                     if(returnObject !== null ) workingObject = returnObject
                 }
                 workingObject = await addToObject(workingObject, datatype, data, "spawners")
                 break;
             case "Vehicle":
                 if(datatype == "raw_Name"){
                     let returnObject = await finishObjectveh(workingObjectVeh)
                     if(returnObject !== null ) workingObjectVeh = returnObject
                 }
                 workingObjectVeh = await addToObject(workingObjectVeh, datatype, data, "veh")
                 break;
             case "Asset":
                 if(datatype == "type"){
                     let returnObject = await finishObject(workingObject)
                     if(returnObject !== null ) workingObject = returnObject
                 }
                 workingObject = await addToObject(workingObject, datatype, data, "assets")
                 break;
             case "Staging":
                 if(datatype == "name"){
                     let returnObject = await finishObject(workingObject)
                     if(returnObject !== null ) workingObject = returnObject
                 }
                 workingObject = await addToObject(workingObject, datatype, data, "staging")
                 break;
             case "ProtectionZone":
                 if(datatype == "name"){
                     let returnObject = await finishObject(workingObject)
                     if(returnObject !== null ) workingObject = returnObject
                 }
                 workingObject = await addToObject(workingObject, datatype, data, "protectionzone")
                 break;
             case "Lanes":
                 if(datatype == "laneName"){
                     let returnObject = await finishObject(workingObject)
                     if(returnObject !== null ) workingObject = returnObject
                 }
                 workingObject = await addToObject(workingObject, datatype, data, "lane")
                 break;
            case "HexAnchors":
                 if(datatype == "team"){
                     let returnObject = await finishObject(workingObject)
                     if(returnObject !== null ) workingObject = returnObject
                 }
                 workingObject = await addToObject(workingObject, datatype, data, "hexAnchors")
                 break;
             case "Hexs":
                 if(datatype == "hex_name"){
                     let returnObject = await finishObject(workingObject)
                     if(returnObject !== null ) workingObject = returnObject
                 }
                 workingObject = await addToObject(workingObject, datatype, data, "hexs") 
                 break; 
            case "Error":
                throw new Error(line)
                break;
            default:
                if (line = "\r") break
                throw new Error("Invalid Data Type:" + line)
                break;
        }

        if (remaninglines.indexOf("\n") == -1) {
            tempBorderInfo = await borderCaculator(currentMap.border)
            currentMap.mapSize = tempBorderInfo.mapSize
            if (currentMap.border == undefined) {
                currentMap.mapSizeType = 0
            }
            else {
                if (currentMap.border.length > 2) {
                    currentMap.mapSizeType = "Playable Area"
                }
                else {
                    currentMap.mapSizeType = "Minimap Size"
                }
            }

            console.log(line)
            currentMap[workingObject.type].push(workingObject.currentObject)
            currentVeh.push(workingObjectVeh.currentObject)

            if (currentMap.rawName.includes("CAF")) {
                tempName = currentMap.Name.substring(4, currentMap.Name.length)
            }
            else {
                tempName = currentMap.Name
            }
            let gamemodeinfo = await findGamemode(tempName)

            let mapPage = tempName.substring(0, gamemodeinfo.location - 1).replaceAll("_", " ")
            let layerVersion = tempName.substring(gamemodeinfo.location + gamemodeinfo.gamemode.length + 1)
            currentMap.mapName = mapPage
            currentMap.gamemode = gamemodeinfo.gamemode
            currentMap.layerVersion = layerVersion

            finishedJson.push(currentMap)
            break; // If there are no new line characters we have no more lines left
        }
    }

    writejson = {}
    writejson.Setups = finishedSetups
    writejson.Maps = finishedJson
    writejson.Vehicles = currentVeh

    fs.writeFileSync(output, JSON.stringify(writejson, null, 4))
    fs.writeFileSync(output2, JSON.stringify(writejson, null, 4))
    return
}


borderCaculator = async (border) => {
    if (border == undefined) {
        output = {}
        output.mapSize = `0x0 km`
        return output
    }

    distance = {}
    distance.maxx = 0, distance.maxy = 0, distance.lowx = 9999999999, distance.lowy = 9999999999
    border.forEach(borderelement => {
        absx = borderelement.location_x
        absy = borderelement.location_y
        if (absx > distance.maxx) distance.maxx = absx
        if (absy > distance.maxy) distance.maxy = absy
        if (absx < distance.lowx) distance.lowx = absx
        if (absy < distance.lowy) distance.lowy = absy
    });
    distance.x = (parseFloat(distance.maxx - distance.lowx) / 100000).toFixed(1)
    distance.y = (parseFloat(distance.maxy - distance.lowy) / 100000).toFixed(1)
    output = {}
    output.mapSize = `${distance.x}x${distance.y} km`
    output.x = distance.x
    output.y = distance.y
    return output
}

main = async () => {
    require.extensions['.txt'] = function (module, filename) {
        module.exports = fs.readFileSync(filename, 'utf16le');
    };

    let remaninglines = require('../files/input/raw.txt')
    let output = './files/temp/finished.json'
    let output2 = `./files/output/finished_${mainconfig.version}.json`
    await loop(remaninglines, output, output2)
    fs.writeFileSync(`./layers.txt`, layers.toString())
    console.log(layers)
    if (!mainconfig.caf) return;
    remaninglines = require('../files/input/raw_caf.txt')
    output = './files/temp/finishedCAF.json'
    output2 = `./files/output/finished_caf_${mainconfig.version}.json`
    await loop(remaninglines, output, output2)
    fs.writeFileSync(`./layers.json`, layers)
    console.log(layers)
}


main()