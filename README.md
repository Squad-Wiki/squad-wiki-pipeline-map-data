<div align="center">
<img src="doc/images/Squad_Wiki_Logo.png" alt="Squad Wiki Pipeline Logo" width="500"/>

#### Squad Wiki Pipeline: Map Data

![GitHub release (with filter)](https://img.shields.io/github/v/release/Squad-Wiki/squad-wiki-pipeline-map-data)
![GitHub](https://img.shields.io/github/license/Squad-Wiki/squad-wiki-pipeline-map-data)
![GitHub issues](https://img.shields.io/github/issues-raw/Squad-Wiki/squad-wiki-pipeline-map-data)

![Discord](https://img.shields.io/discord/553984341143846912?style=flat&logo=discord&logoColor=FFC200)
![GitHub Repo stars](https://img.shields.io/github/stars/Squad-Wiki/squad-wiki-pipeline-map-data)

</div>

## About

The **Squad Wiki Pipeline** (in short: "pipeline") allows the extraction of game data for the tactical first-person-shooter [Squad](http://store.steampowered.com/app/393380/) by [Offworld Industries](https://www.offworldindustries.com/). The data is extracted from the [Squad SDK](https://squad.gamepedia.com/Squad_SDK) (not the game files!) and then uploaded to the [Squad Wiki](https://squad.gamepedia.com/Squad_Wiki). All of this is performed by the pipeline semi-automatically.

This pipeline currently only extracts **map layer** and **map vehicle assets** data. See example [map wiki page](https://squad.gamepedia.com/Belaya) for the actual use of this data.

## Components

![Squad Wiki Pipeline breakdown](/doc/images/Squad-Wiki-Pipeline.png)

The pipeline consists of three components:

1. Export the game data from the [Squad SDK](https://squad.gamepedia.com/Squad_SDK)
2. Convert SDK labels into names used on the wiki
3. Upload the data to Data pages on the wiki

The last to steps create interim output files which are used as input files for the following step.

**Step 1** exports the data from the Squad SDK into a JSON format.

Before the SDK export can be uploaded to the wiki, naming convertions must be performed because the internal naming in the Squad SDK does often not match with the naming on the Squad Wiki - this is done in **step 2**.

With **step 3** the data is uploaded to the wiki with the goal of making the data accessible in a [Cargo database](https://www.mediawiki.org/wiki/Extension:Cargo). However, there is no [MediaWiki API](https://www.mediawiki.org/wiki/API:Main_page) to access the Cargo tables directly, therefore we have to upload the data into interim Data pages - from there, using Cargo commands, the data goes finally into the Cargo tables.

Cargo tables allow the automatic re-use of its data on many wiki pages. Therefore, we only have to update the Cargo data and all wiki pages are automatically updated with the latest data. The data is pulled from the Cargo tables using [Scribunto](https://www.mediawiki.org/wiki/Extension:Scribunto). Scribunto allows powerful programming (using the [programming language Lua](<https://en.wikipedia.org/wiki/Lua_(programming_language)>)) to manipulate and visualize the data onto wiki pages - everything done automatically.

If you want to learn more about the wiki-side programming and maintenance, see our [Squad Wiki Cargo Maintenence documentation](https://squad.gamepedia.com/Squad_Wiki_Editorial/Cargo_Maintenance). Below documentation focuses exclusively on the first four steps that make up the pipeline.

## Latest output files

You will find output files for all new Squad releases on GitHub in folder `completed_output/`. Feel free to use them for your own use with credit given to the Squad Wiki.

## Installation

Documentation on how to install this pipeline can be read [here](doc/installation.md)

## Configuration

Documentation on how to configure this pipeline for the SDK can be read [here](doc/sdkConfiguration.md)

Documentation on how to configure this pipeline for the wiki can be read [here](doc/wikiConfiguration.md)

## Usage

Documentation on how to use this pipeline for the SDK data extraction can be read [here](doc/sdkUsage.md)

Documentation on how to use this pipeline for the wiki upload can be read [here](doc/wikiUsage.md)

Documentation about the output JSON file can be read [here](doc/json.md)

## Wiki Side Documentation

You can find more documentation for the usage of the pipeline [here](https://squad.gamepedia.com/Squad_Wiki_Editorial/Cargo_Maintenance) - this documentation covers the practical operation of the pipline on the wiki-side.

## Project Status and Roadmap

We have developed this pipeline in 2020 for the maintenance of the [Squad Wiki](https://squad.gamepedia.com/Squad_Wiki). We are utlizing the pipeline every time a new version of Squad is released. We are constantly improving the pipeline and make more and more use of the Cargo data on the wiki.

In the future we are considering extending the pipeline to extract more and more game data for the wiki.

## Contributing

Feel free to use this pipeline or parts of it for other games or game wikis.

If you want to contribute to the pipeline for the [Squad Wiki](https://squad.gamepedia.com/Squad_Wiki), consider joining the team in the [Squad Wiki Editorial](https://squad.gamepedia.com/Squad_Wiki_Editorial).

## Contact

The pipeline was created and is being operated by the team in the [Squad Wiki Editorial](https://squad.gamepedia.com/Squad_Wiki_Editorial) for the [Squad Wiki](https://squad.gamepedia.com/Squad_Wiki). You can best reach us on our own [Discord](https://discord.gg/Y8vgeJ2).

## Authors and Acknowledgment

Listed by Discord user names:

- **shanomac99** - programming and operation
- **usgu** - concept, coordination and documentation
- **werewolfboy13** - contributor and documentation

This project would not have been possible without the invaluable help and support from [Offworld Industries](https://www.offworldindustries.com/), especially the developers **Virus.exe** and **FuzzHead**.

## License

This repository is under the [Creative Commons Attribution-ShareAlike 4.0 International](https://creativecommons.org/licenses/by-sa/4.0/). See [License.md](/license.md).
