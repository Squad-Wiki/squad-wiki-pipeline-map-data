var fs = require("fs");

let config = require('../files/config/rawtojson.json')
let mainconfig = require('../files/config/main.json')

const PREFIXLENGTH = 45; // Prefix (LogBlueprintUserMessages: [BP_HUD_C_0] [Wiki])

const layers = []


let loop = async(remaninglines, output, output2) => {


    // Defining the current info.
    current = resetCurrent()

    let finishedJson = []; // Final Product

    let temp = null
    

    while(remaninglines.indexOf("\n") >= -1){ // Loop while there are no newline characters (/n is the start of a new line so that means theres another line below)
        let lineEnd = remaninglines.indexOf("\n"); // Find the end of the first line
        let line = remaninglines.substring(PREFIXLENGTH, lineEnd); // Take the text of that line minus the start of it (SDK logging stuff)
        remaninglines = remaninglines.substring(lineEnd + 1, remaninglines.length); // Cut out the current line and set that to what we have left to do
    

        // ***********************
        // *        Flags        *
        // ***********************

        if(line.includes("Flags:")){
            current.Flags = []
            
            lineEnd = remaninglines.indexOf("\n"); // Move line forward one (That way we aren't logging the Flags: line and instead go straight to the flags)
            line = remaninglines.substring(PREFIXLENGTH, lineEnd);
            remaninglines = remaninglines.substring(lineEnd + 1, remaninglines.length);

            while(!line.includes("Map:")){// If the line includes "Map" that means we are at the end of the flags
                current.Flags.push(line.substring(0,line.length - 1)); // Push the current line into the array

                lineEnd = remaninglines.indexOf("\n"); // Move line forward one
                line = remaninglines.substring(PREFIXLENGTH, lineEnd);
                remaninglines = remaninglines.substring(lineEnd + 1, remaninglines.length);
            }
        }

        // ***********************
        // *         Map         *
        // ***********************

        if(line.includes("Map:")){ // If the current line contains the words "Map:" we know its the map name
            current.Map = line.substring(5, line.length); // So we set the currentmap to the line
        }


        // ***********************
        // *        Teams        *
        // ***********************

        if(line.includes("Team 1:")){
            let team = teamFinder(line)
            current.Team1.Faction = team.Team
            current.Team1.Tickets = team.TeamTickets
        }
        if(line.includes("Team 2:")){
            let team = teamFinder(line)
            current.Team2.Faction = team.Team
            current.Team2.Tickets = team.TeamTickets
        }

        // ***********************
        // *   Capture Points    *
        // ***********************
        if(line.includes("Map Capture Points:")){
            current.capturePoints = line.substring(20, line.length-1)
        }


        // ***********************
        // *       Vehicles      *
        // ***********************

        if(line.includes("Team 1 Vehicles:")) { // This is going to mean we have vehicles upcoming, also meaning we know theres a huge list coming up without any line identifiers marking them as vehicles
            returnvar = grabvehicles(remaninglines, true); // Lets move here since we are going to have to do it for team 2, less copying and pasting
            remaninglines = returnvar[0]; // Assigning variables returned from the function
            current.Team1.Vehicles = returnvar[1].currentVeh
            current.Team1.VehiclesTime = returnvar[1].currentVehTime
        }

        if(line.includes("Team 2 Vehicles:")) { // This is going to mean we have vehicles upcoming, also meaning we know theres a huge list coming up without any line identifiers marking them as vehicles
            returnvar = grabvehicles(remaninglines, true); // Lets move here since we are going to have to do it for team 2, less copying and pasting
            remaninglines = returnvar[0]; // Assigning variables returned from the function
            current.Team2.Vehicles = returnvar[1].currentVeh
            current.Team2.VehiclesTime = returnvar[1].currentVehTime
        }


        // ***********************
        // *        Finish       *
        // ***********************

        if((line.includes("MapName:") && current.Team1.Vehicles[0] != undefined && current.Team2.Vehicles[0] != undefined) || remaninglines.indexOf(`\n`) == -1){
            let tempjson = tempjsonreset(); //Reset temp variable
            tempjson.Name = current.Map.substring(0, current.Map.length - 1) // Set the name
            layers.push(tempjson.Name + ` ${current.Team1.Faction} ${current.Team1.Tickets} vs ${current.Team2.Faction} ${current.Team2.Tickets} \n`)
            tempjson.CapturePoints = current.capturePoints
            tempjson.Flags = current.Flags

            tempjson.Team1.Faction = current.Team1.Faction
            tempjson.Team1.Tickets = current.Team1.Tickets

            for(let i = 0; i < current.Team1.VehiclesTime.length; i++){         //Loop through the vehicles (We will use the time as the base)
                let temp = current.Team1.Vehicles[i].indexOf("x")               //Find where the end of the vehicle name is and where the start of the count is
                
                let loopjson = loopjsonreset()                                  //Reset another temp variable
                loopjson.Type = current.Team1.Vehicles[i].substring(0, temp-1)  // Throw the vehicle type here
                loopjson.Count = current.Team1.Vehicles[i].substring(temp + 2, current.Team1.Vehicles[i].length-1).toString()
                loopjson.Delay = current.Team1.VehiclesTime[i]
                tempjson.Team1.Vehicles.push(loopjson)                          // Push to the array with the temp variable we created
            }

            tempjson.Team2.Faction = current.Team2.Faction
            tempjson.Team2.Tickets = current.Team2.Tickets

            for(let i = 0; i < current.Team2.VehiclesTime.length; i++){         //Loop through the vehicles (We will use the time as the base)
                let temp = current.Team2.Vehicles[i].indexOf("x")               //Find where the end of the vehicle name is and where the start of the count is
                
                let loopjson = loopjsonreset()                                  //Reset another temp variable
                loopjson.Type = current.Team2.Vehicles[i].substring(0, temp-1)  // Throw the vehicle type here
                loopjson.Count = current.Team2.Vehicles[i].substring(temp + 2, current.Team2.Vehicles[i].length-1).toString()
                loopjson.Delay = current.Team2.VehiclesTime[i]
                tempjson.Team2.Vehicles.push(loopjson)                          // Push to the array with the temp variable we created
            }

            finishedJson.push(tempjson);
            current = resetCurrent()
            if (remaninglines.indexOf("\n") == -1) break; // If there are no new line characters we have no more lines left
        }
    }

    let writejson = {}
    writejson.Maps = finishedJson

    fs.writeFileSync(output, JSON.stringify(writejson, null, 4))
    fs.writeFileSync(output2, JSON.stringify(writejson, null, 4))

    return
}



let resetCurrent = () => {
    let current = {}
    current.Map = `` //Current Map/Layer

    current.Team1 = {} // Team1 and their info
    current.Team1.Vehicles = []
    current.Team1.VehiclesTime = []
    current.Team1.Faction = ``
    current.Team1.Tickets = ``

    current.Team2 = {} // Team2
    current.Team2.Vehicles = []
    current.Team2.VehiclesTime = []
    current.Team2.Faction = ``
    current.Team2.Tickets = ``

    current.capturePoints = null

    current.Flags = new Array
    return current
}

function loopjsonreset(){
    loopjson = {};
    loopjson.Type = null;
    loopjson.Count = "0";
    loopjson.Delay = "0";
    return loopjson;
}

function tempjsonreset(){
    var tempjson = {};
    tempjson.Name = "";
    tempjson.Team1 = {}
    tempjson.Team1.Faction = null;
    tempjson.Team1.Tickets = 0;
    tempjson.Team1.Vehicles = []
    tempjson.Team2 = {}
    tempjson.Team2.Faction = null;
    tempjson.Team2.Tickets = 0;
    tempjson.Team2.Vehicles = []
    return tempjson;
}

let teamFinder = (line) => {
    let Team = {}
    Team.Team = ''
    Team.Team1Tickets = ''
    let found = false
    let foundteam = null
    for (team in config.Teams){
        if(line.includes(team)) 
        {
            found = true
            foundteam = team
        }
    }
    if(found != false) {
        Team.Team = config.Teams[foundteam]
        let ticketsend = line.indexOf("tickets");
        let teamend = line.indexOf(foundteam) + foundteam.length + 2
        Team.TeamTickets = line.substring(teamend, ticketsend - 1)
    }
    else throw(`Team ${line} invalid.`)

    return Team
}

let grabvehicles = (remaninglines, team1) => {
    
    let teamend = false // When we reach the end of the current team

    let temp = resetgrab() // Reset Variables

    while(teamend == false){ // Loop through each line and set aside the lines that we need
        lineEnd = remaninglines.indexOf("\n"); // Move line forward one
        line = remaninglines.substring(PREFIXLENGTH, lineEnd);
        remaninglines = remaninglines.substring(lineEnd + 1, remaninglines.length);

        if(line.includes("Team 2 Vehicles:") | line.includes("MapName:") | line == "" | lineEnd == -1) teamend = true // Find the end point
        else {
            temp.currentLines.push(line)
        }
    }

    temp.currentLines.sort() // Sort the lines alphabetically

    temp.currentLines.forEach(currentLine => {
        let splits = currentLine.split("|") // Split the line across a |
        let vehicle = splits[splits.length - 2]
        let vehicleTime = splits[splits.length - 1]

        vehicleTime = parseInt(vehicleTime.substring(12, vehicleTime.length - 2)/60)

        temp.currentVeh.push(vehicle)
        temp.currentVehTime.push(vehicleTime)
    })

    return ["LogBlueprintUserMessages: [BP_HUD_C_0] [Wiki]" + line + "\r\n" + remaninglines, temp];


}

let resetgrab = () => {
    let temp = {}
    temp.currentVeh = []
    temp.currentVehTime = []
    temp.currentLines = []

    return temp
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