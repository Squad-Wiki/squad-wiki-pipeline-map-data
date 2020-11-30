
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
    let conVehicles = []
    await asyncForEach(team.Vehicles, async(vehicle) => {
        numOfVeh++

        // Attempt to Map the SDK name to a map. If the name/displayname is invalid throw an error.
        let conVehicleName = vehicleMap[`${vehicle.Type}_Name`]
        if(conVehicleName === undefined) {
            throw(`${vehicle.Type} is not in the Map file... (Name Invalid or Non Existant) Team: ${team.Faction} | MapName: ${mapName}`)
        }
        log2(`------${conVehicleName}`)

        let conVehicleDisplayName = vehicleMap[`${vehicle.Type}_DisplayName`]
        if(conVehicleDisplayName === undefined) {
            throw(`${vehicle.Type} is not in the Map file... (Display Name Invalid or Non Existant) Team: ${team.Faction} | MapName: ${mapName}`)
        }
        log2(`--------${conVehicleDisplayName}`)

        let tempObject = {}

        tempObject.Type = vehicle.Type
        tempObject.Name = conVehicleName
        tempObject.DisplayName = conVehicleDisplayName
        tempObject.Count = vehicle.Count
        tempObject.Delay = vehicle.Delay

        conVehicles.push(tempObject)
    })
    return conVehicles
}

// While running through each vehicle twice is not the most efficent it is simplier to split the operations into two functions

const combineVehicles = async(team) => {
    let combVeh = []
    delete team.Vehicles[0].Type
    combVeh.push(team.Vehicles[0])
    for(let i = 1; i < team.Vehicles.length; i++){
        numOfVehComb++

        team.Vehicles[i]
        let found = false
        for(let j = 0; j < combVeh.length; j++){
            if ((combVeh[j].Name == team.Vehicles[i].Name) && (combVeh[j].DisplayName == team.Vehicles[i].DisplayName) && (combVeh[j].Delay == team.Vehicles[i].Delay) ){
                combVeh[j].Count = parseInt(combVeh[j].Count) + parseInt(team.Vehicles[i].Count)
                found = true
            }
        }

        if(!found) {
            delete team.Vehicles[i].Type
            combVeh.push(team.Vehicles[i])
        }
    }

    return(combVeh)
}


const main = async() => {

    let conMaps = {}
    conMaps.Maps = []
    log('Preparing to loop through each Map....')
    await asyncForEach(inputJson.Maps, async (layer) => {
        log2(`-${layer.Name}`)
        // ------------------------------
        // ----- Faction Conversion -----
        // ------------------------------
    
        let conFaction1 = factionMap[layer.Team1.Faction]
        let conFaction2 = factionMap[layer.Team2.Faction]
        if(conFaction1 === undefined) {
            throw(`${layer.Team1.Faction} is not in the Map file...`)
        }
        log2(`---${conFaction1}`)
    
        // Vehicle Conversion
        let conTeam1Veh = await convertVehicle(layer.Team1, layer.Name)
    
        if(conFaction2 === undefined) {
            throw(`${layer.Team2.Faction} is not in the Map file...`)
        }
        log2(`---${conFaction2}`)

        // Vehicle Conversion
        let conTeam2Veh = await convertVehicle(layer.Team2,layer.Name)
    
        log(`${layer.Name}: ${conFaction1} vs ${conFaction2}`)
        log(`${layer.Name}: Tickets: ${layer.Team1.Tickets} and ${layer.Team2.Tickets}`)
        log(`Capture points: ${layer.CapturePoints}`)
    
        let tempObject = {}
        tempObject.Name = layer.Name
    
        tempObject.Team1 = {}
        tempObject.Team1.Faction = conFaction1
        tempObject.Team1.Tickets = layer.Team1.Tickets
        tempObject.Team1.Vehicles = conTeam1Veh
    
        tempObject.Team2 = {}
        tempObject.Team2.Faction = conFaction2
        tempObject.Team2.Tickets = layer.Team2.Tickets
        tempObject.Team2.Vehicles = conTeam2Veh
    
        tempObject.CapturePoints = layer.CapturePoints
        tempObject.Flags = layer.Flags
    
        conMaps.Maps.push(tempObject)
    })

    console.log(conMaps.Maps.length)

    fs.writeFileSync(`./files/output/debug/ConvertedJson_${mainconfig.version}.json`, JSON.stringify(conMaps, null, 4))

    await asyncForEach(conMaps.Maps, async(layer) => {
        let combTeam1Veh = await combineVehicles(layer.Team1)

        let combTeam2Veh = await combineVehicles(layer.Team2)

        conMaps.Maps[conMaps.Maps.indexOf(layer)].Team1.Vehicles = combTeam1Veh
        conMaps.Maps[conMaps.Maps.indexOf(layer)].Team2.Vehicles = combTeam2Veh
    })

    fs.writeFileSync('./files/output/ConvertedJsonCombined.json', JSON.stringify(conMaps, null, 4))
    fs.writeFileSync('./files/temp/ConvertedJsonCombined.json', JSON.stringify(conMaps, null, 4))
    console.log(numOfVeh)
    console.log(numOfVehComb)
}

main()