var fs = require("fs");

let config = require('../files/config/rawtojson.json')
let mainconfig = require('../files/config/main.json');

let lightingMap = require('../files/config/lightingMap.json')
const { info } = require("console");

const layers = []


let loop = async(remaninglines, output, output2) => {

    //current = resetCurrent()

    let finishedJson = []

    let temp = null
    currentMap = {}
    while(remaninglines.indexOf("\n") >= -1){
        let lineEnd = remaninglines.indexOf("\n")
        let line = remaninglines.substring(0, lineEnd - 1)
        remaninglines = remaninglines.substring(lineEnd + 1, remaninglines.length)


        prefix = line.substring(line.indexOf("[") + 1, line.indexOf("]"))
        switch(prefix) {
            case "Data":
                if(line.includes("name:")){
                    //// New Map Detected
                    if(Object.keys(currentMap).length === 0) {
                        currentMap.Name = line.substring(13, line.length)
                        break;
                    }
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
                    tempdata = {}

                    tempdata.type = data.substring(0, data.indexOf(" x "))
                    tempdata.count = data.substring(data.indexOf(" x ") + 3, data.indexOf(" |"))
                    tempdata.delay = parseInt(data.substring(data.indexOf("Spawn Time: ") + 12, data.indexOf(" | Respawn Time: ")))
                    tempdata.respawnTime = parseInt(data.substring(data.indexOf(" | Respawn Time: ") + 17, data.length))
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
                    team[datatype] = data
                }
                if(currentMap.Flags == undefined)
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
            finishedJson.push(currentMap)
            break; // If there are no new line characters we have no more lines left
        }
    }
    writejson = {}
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