
var fs = require("fs");

require.extensions['.txt'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};

let mainconfig = require('../files/config/main.json')

let step = 0
let step2 = 0

const log = (message) =>{
    step++
    fs.appendFileSync('./files/output/debug/output_conversion.txt',`[${step}] ${message}\n`)
}
const log2 = (message) =>{
    step2++
    fs.appendFileSync('./files/output/debug/outputdetailed_conversion.txt',`[${step}][${step2}] ${message}\n`)
}

log("SDK Exporter starting up, checking dependencies...")

const inputJson = require('../files/temp/finished.json')
const inputJsonCAF = require('../files/temp/finishedCAF.json')
const factionMap = require('../files/config/factionMap.json')
const vehicleMap = require('../files/config/vehicleMap.json')
const flagMap = require(`../files/config/map/flagMap.json`)
const setupBlacklist = require(`../files/config/blacklists/setups.json`)
const layerBlacklist = require(`../files/config/blacklists/layers.json`)

const async = require('async')


log("Depdencies are good.")

log("Starting Conversion")


if(mainconfig.caf) inputJson.Maps = inputJson.Maps.concat(inputJsonCAF.Maps) // Combine vanilla and CAF layers


// --------------------------------
// ----- Function Definitions -----
// --------------------------------


async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
}

let numOfVeh = 0
let numOfVehComb = 0


let convertVehicle = async(team, mapName) => {
    let convehicles = []
    await asyncForEach(team.vehicles, async(vehicle) => {
        numOfVeh++

        // Attempt to Map the SDK name to a map. If the name/displayname is invalid throw an error.
        let conVehicleName = vehicleMap[`${vehicle.rawType}_Name`]
        if(conVehicleName === undefined) {
            throw(`${vehicle.rawType} vehicle is not in the Map file... (Name Invalid or Non Existant) Team: ${team.faction} | MapName: ${mapName}`)
        }
        log2(`------${conVehicleName}`)

        let conVehicleDisplayName = vehicleMap[`${vehicle.rawType}_DisplayName`]
        if(conVehicleDisplayName === undefined) {
            throw(`${vehicle.rawType} vehicle is not in the Map file... (Display Name Invalid or Non Existant) Team: ${team.faction} | MapName: ${mapName}`)
        }
        log2(`--------${conVehicleDisplayName}`)

        let tempObject = {}


        let tempstring = vehicle.icon
        let tempstrings = tempstring.split("_")
        if(tempstrings.length > 1) tempstrings.shift()
        tempstrings.push(`vehicle`)
        tempstrings.push(`icon.png`)

        tempObject.rawType = vehicle.rawType
        tempObject.Name = conVehicleName
        tempObject.DisplayName = conVehicleDisplayName
        tempObject.Count = vehicle.count
        tempObject.Delay = vehicle.delay
        tempObject.icon = tempstrings.join("_")

        convehicles.push(tempObject)
    })
    return convehicles
}

// While running through each vehicle twice is not the most efficent it is simplier to split the operations into two functions

const combinevehicles = async(team) => {
    let combVeh = []
    delete team.vehicles[0].rawType
    combVeh.push(team.vehicles[0])
    for(let i = 1; i < team.vehicles.length; i++){
        numOfVehComb++

        team.vehicles[i]
        let found = false
        for(let j = 0; j < combVeh.length; j++){
            if ((combVeh[j].Name == team.vehicles[i].Name) && (combVeh[j].DisplayName == team.vehicles[i].DisplayName) && (combVeh[j].Delay == team.vehicles[i].Delay) ){
                combVeh[j].Count = parseInt(combVeh[j].Count) + parseInt(team.vehicles[i].Count)
                found = true
            }
        }

        if(!found) {
            delete team.vehicles[i].rawType
            combVeh.push(team.vehicles[i])
        }
    }

    return(combVeh)
}


const main = async() => {
    let conMaps = {}
    conMaps.Setups = []
    conMaps.Maps = []
    log('Preparing to loop through each Setup....')


    await asyncForEach(inputJson.Setups, async (setup) => {
        let blacklisted = false
        await asyncForEach(setupBlacklist.blacklist, async (black) => {
            if(black == setup.setup_Name) blacklisted = true
        })

        if(blacklisted) return

        let confactionSetup = factionMap[setup.faction]
        if(confactionSetup === undefined) throw(`${setup.faction} setup is not in the map file (${setup.setup_Name})`)

        let setupObject = {}
        conVeh = await convertVehicle(setup,setup.setup_Name)
        setup.vehicles = conVeh
        combVeh = await combinevehicles(setup)
        setupObject.faction = confactionSetup
        setupObject.longName = setup.setup_Name
        setupObject.name = setup.shortname
        setupObject.type = setup.type
        setupObject.badge = setup.badge + `_Division_Image.png`
        setupObject.vehicles = combVeh
        conMaps.Setups.push(setupObject)
    })

    //console.log(conMaps)
    
    log('Preparing to loop through each Map....')
    await asyncForEach(inputJson.Maps, async (layer) => {
        log2(`-${layer.Name}`)
        let blacklisted = false
        await asyncForEach(layerBlacklist.blacklist, async (black) => {
            if(black == layer.rawName) blacklisted = true
        })
        if(blacklisted) return
        // ------------------------------
        // ----- faction Conversion -----
        // ------------------------------
    
        let confaction1 = factionMap[layer.team1.faction]
        let confaction2 = factionMap[layer.team2.faction]
        let conteam1Veh = []
        let conteam2Veh = []
        if(confaction1 === undefined) {
            if(layer.team1.allowedAlliances === undefined) {
                throw(`${layer.team1.faction} team is not in the Map file... (${layer.Name})`)
            }
            else {
                confaction1 = layer.team1.allowedAlliances.join(" or ")
                await asyncForEach(layer.team1.allowedAlliances, async (alliance) => {
                    let temp = factionMap[alliance]
                    await asyncForEach(temp, async(allianceFaction) => {
                        if (layer.team1.factionSetups !== undefined) {
                            await asyncForEach(layer.team1.factionSetups, async(setup) => {
                                let ficon = flagMap[allianceFaction.split(` `).join(`_`)]
                                conteam1Veh.push({
                                    "Name": `${allianceFaction}#${setup}`,
                                    "DisplayName": setup,
                                    "Count": -1,
                                    "Delay": -1,
                                    "icon": ficon
                                })
                            })
                        }
                        else {
                            let ficon = flagMap[allianceFaction.split(` `).join(`_`)]
                                conteam1Veh.push({
                                    "Name": `${allianceFaction}#Divisions`,
                                    "DisplayName": allianceFaction,
                                    "Count": -1,
                                    "Delay": -1,
                                    "icon": ficon
                                })
                        }
                    })
                })
            }
        }
        else {
            // Vehicle Conversion
            if (layer.team1.vehicles == undefined) conteam1Veh = ""
            else conteam1Veh = await convertVehicle(layer.team1, layer.Name)
        }
        log2(`---${confaction1}`)
    
    
        if(confaction2 === undefined) {
            if(layer.team2.allowedAlliances === undefined) {
                throw(`${layer.team2.faction} team is not in the Map file... (${layer.Name})`)
            }
            else {
                confaction2 = layer.team2.allowedAlliances.join(" or ")
                await asyncForEach(layer.team2.allowedAlliances, async (alliance) => {
                    let temp = factionMap[alliance]
                    await asyncForEach(temp, async(allianceFaction) => {
                        if (layer.team2.factionSetups !== undefined) {
                            await asyncForEach(layer.team2.factionSetups, async(setup) => {
                                let ficon = flagMap[allianceFaction.split(` `).join(`_`)]
                                conteam2Veh.push({
                                    "Name": `${allianceFaction}#${setup}`,
                                    "DisplayName": setup,
                                    "Count": -1,
                                    "Delay": -1,
                                    "icon": ficon
                                })
                            })
                        }
                        else {
                            let ficon = flagMap[allianceFaction.split(` `).join(`_`)]
                                conteam2Veh.push({
                                    "Name": `${allianceFaction}#Divisions`,
                                    "DisplayName": allianceFaction,
                                    "Count": -1,
                                    "Delay": -1,
                                    "icon": ficon
                                })
                        }
                    })
                })
            }
        }
        else {
            // Vehicle Conversion
            if (layer.team2.vehicles == undefined) conteam2Veh = ""
            else conteam2Veh = await convertVehicle(layer.team2, layer.Name)
        }
        log2(`---${confaction2}`)
    
        log(`${layer.Name}: ${confaction1} vs ${confaction2}`)
        log(`${layer.Name}: Tickets: ${layer.team1.tickets} and ${layer.team2.tickets}`)
        log(`Capture points: ${layer.capturePoints}`)
    
        let tempObject = {}
        tempObject.Name = layer.Name
        tempObject.mapName = layer.mapName
    
        tempObject.team1 = {}
        tempObject.team1.faction = confaction1
        tempObject.team1.tickets = layer.team1.tickets
        tempObject.team1.vehicles = conteam1Veh
    
        tempObject.team2 = {}
        tempObject.team2.faction = confaction2
        tempObject.team2.tickets = layer.team2.tickets
        tempObject.team2.vehicles = conteam2Veh
    
        tempObject.CapturePoints = layer.capturePoints
        tempObject.Flags = layer.Flags
    
        conMaps.Maps.push(tempObject)
    })


    fs.writeFileSync(`./files/output/debug/ConvertedJson_${mainconfig.version}.json`, JSON.stringify(conMaps, null, 4))

    await asyncForEach(conMaps.Maps, async(layer) => {
        if (layer.team1.vehicles == undefined || layer.team1.vehicles == "") combteam1Veh = ""
        else combteam1Veh = await combinevehicles(layer.team1)

        if (layer.team2.vehicles == undefined || layer.team1.vehicles == "") combteam2Veh = ""
        else combteam2Veh = await combinevehicles(layer.team2)

        conMaps.Maps[conMaps.Maps.indexOf(layer)].team1.vehicles = combteam1Veh
        conMaps.Maps[conMaps.Maps.indexOf(layer)].team2.vehicles = combteam2Veh
    })

    fs.writeFileSync('./files/output/ConvertedJsonCombined.json', JSON.stringify(conMaps, null, 4))
    fs.writeFileSync('./files/temp/ConvertedJsonCombined.json', JSON.stringify(conMaps, null, 4))
}

main()