
const mainconfig = require('../files/config/main.json')
const VERSION = mainconfig.version

const tokens = require('../files/config/tokens/wiki.json')

const request = require('request');
const fs = require('fs');
const async = require('async')

const wiki = require('./wiki');
const json = require('./json');
var cookieJar = request.jar()

var url = "https://squad.gamepedia.com/api.php"

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
}

require.extensions['.txt'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};

const main = async() => {
    let MapLayers = await json.json.wikiformat()

    // Log the object we created in a JSON format
    fs.writeFileSync('./files/output/debug/MapLayers.json', JSON.stringify(MapLayers, null, 4))

    // Generate a login token
    wiki.tokens.generatelogintoken(cookieJar, (cookieJar2, logintoken) => {

        // Login Paramaters
        let params_1 = {
            action: "login",
            lgname: tokens.lgname,
            lgpassword: tokens.lgpassword,
            lgtoken: logintoken,
            format: "json"
        }

        //Attempt to login here
        request.post(
            {
                uri: url,
                jar: cookieJar2,
                form: params_1
            },
            async(err, response, body) => {
                if(err) throw err
                fs.writeFile("./files/output/debug/error.json",JSON.stringify(response.body, null, 4), function(err){} );

                // Generate a csrf token in order to be able to edit pages.
                wiki.tokens.generatecsrftoken(cookieJar2, async(cookieJar3, csrftoken) => {
                    
                    // Loop through each layer, and each vehicle and then save that to the wiki.
                    for (var mapKey in MapLayers) {
                        let map = MapLayers[mapKey]
                        console.log(map)
                        let tempData = ""

                        await asyncForEach(map, async(layer) => {
                            let layerInfo = layer.MapLayerInfo
                            let text = ``
                                + `{{#cargo_store:\n`
                                + `_table= map_layers\n`
                                + `|mappage= ${layerInfo.MapPage}\n`
                                + `|gamemode= ${layerInfo.GameMode}\n`
                                + `|layerversion= ${layerInfo.LayerVersion}\n`
                                + `|team1faction= ${layerInfo.Team1Faction}\n`
                                + `|team1tickets= ${layerInfo.Team1Tickets}\n`
                                + `|team2faction= ${layerInfo.Team2Faction}\n`
                                + `|team2tickets= ${layerInfo.Team2Tickets}\n`
                                + `|capturepoints= ${layerInfo.CapturePoints}\n`
                                + `}}\n`
                            tempData += text 
                                + `\n\n\n\n\n`
                

                            await asyncForEach(layer.VehicleAssets, async(vehicle) => {

                                tempData +=`{{#cargo_store:\n`
                                    +  `_table = map_vehicle_assets\n`
                                    +  `|mappage= ${vehicle.MapPage}\n`
                                    +  `|gamemode= ${vehicle.GameMode}\n`
                                    +  `|layerversion= ${vehicle.LayerVersion}\n`
                                    +  `|teamfaction= ${vehicle.TeamFaction}\n`
                                    +  `|vehicle= ${vehicle.Vehicle}\n`
                                    +  `|vehicledisplayname= ${vehicle.VehicleDisplayName}\n`
                                    +  `|count= ${vehicle.Count}\n`
                                    +  `|delay= ${vehicle.Delay}\n`
                                    +  `}}\n`
                            })

                            tempData += "\n\n\n [[Category:Cargo_Map_Data]]"
                        })

                        fs.appendFileSync('./files/output/debug/CargoDebug.txt', tempData)
                        let params = {
                            action: "edit",
                            title: `Data:${map[0].MapLayerInfo.MapPage}`,
                            summary: `Updated Data Pages to ${VERSION}. Bot Action.`,
                            text: tempData,
                            bot: true,
                            token: csrftoken
                        }

                        request.post(
                            {
                                uri: url,
                                jar: cookieJar,
                                form: params
                            },
                            function(err, response, body){
                                fs.writeFile("./files/output/debug/error.json",JSON.stringify(response.body, null,4), function(err){} );
                            }
                        ) 
                        
                        let paramspurge = {
                            action: "purge",
                            titles: `${map[0].MapLayerInfo.MapPage}`,
                            bot: true,
                            token: csrftoken
                        }

                        setTimeout(() => {
                            request.post(
                                {
                                    uri: url,
                                    jar: cookieJar,
                                    form: paramspurge
                                },
                                (err, response, body) => {
    
                                },
                            )
                        }, 10000)

                    }
                })
            }
            
        )

    })  
}

main()