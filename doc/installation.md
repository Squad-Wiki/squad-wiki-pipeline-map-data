# Pipeline Installation
The entire pipeline is run on your **local PC**. It consists of two main parts:
1. One **Unreal Engine Blueprint** "*MapGrabAssets.uasset*" to be added to the [Squad SDK](https://squad.gamepedia.com/Squad_SDK) for exporting the game data.
2. Different **JavaScripts** for processing, converting and uploading the exported game data to the wiki.






### Installing Blueprint MapGrabAssets.uasset

The latest version of the [Squad SDK](https://squad.gamepedia.com/Squad_SDK) is required. You will find instructions on how to install the Squad SDK [here](https://squad.gamepedia.com/Squad_SDK#Downloading_the_Epic_Games_Launcher).

Please note, you will have to repeat steps 4-15 after every new release version of the Squad SDK. To find out more about Blueprints, see [official documentation](https://docs.unrealengine.com/en-US/Engine/Blueprints/GettingStarted/index.html). You can see all versions of the Squad SDK [here](https://squad.gamepedia.com/Squad_SDK#Version_history).


1. Place the blueprint within the SDK folders. It's recommended that the Blueprint is placed at `/SquadEditor/Squad/Content/Wiki/`.

2. Open the Squad SDK. 

Skip to step 6 if you are not using CAF files

3. Open up the project settings by mousing over Edit in the top left and clicking on `Project Settings`.

![Project Settings](/doc/images/sdk/sdk_project_settings.png)

4. Open Up the `Asset Manager`

![Asset Manager](/doc/images/sdk/sdk_asset_manager.png)

5. Under `Primary Asset Types To Scan` add `/CanadianArmedForces` to the directory list for elements 1-4

![Add Element](/doc/images/sdk/sdk_add_directory.png)

6. Under `Primary Asset Types To Scan` click the plus icon.

![Add New Asset](/doc/images/sdk/sdk_add_primary_asset.png)

7. Set the new `Primary Asset type` to `Map`, the `Asset Base Class` to `World` and the directory to `/Game/Maps`

![Asset Configure](/doc/images/sdk/sdk_new_primary_asset.png)

8. Navigate to `/Content/UI/` within the SDK and open the Blueprint called `BP_HUD`.

9. Click `Add Component` and search `Map Grab Assets` and click on it.

![Add Component](/doc/images/sdk/sdk_add_component.png)

10. Move the Function Start (this should be in the middle of the paste) and move it to the start.

11. Open up the `Event Graph` in the BP_HUD.

12. Navigate to `Wait for Start of Match` near the top of the blueprint and copy the delay node. 

![Copy Node](/doc/images/sdk/sdk_copy_delay.png)

13. Paste the delay node at the end of `Wait for Start of Match`

14. Drag the `Map Grab Assets` asset from the left bar into the blueprint.

![Drag Actor](/doc/images/sdk/sdk_drag_actor.png)

15. Drag off the blue object reference and search `Map Grab Assets` and click on the function that appears.

![Create new Function](/doc/images/sdk/sdk_create_new_function.png)

16. Connect the Delay node with the new function node.

17. If you are using CAF files click the CAF tickbox on the function.

18. Compile and save the blueprint.
