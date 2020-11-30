# Pipeline Installation
The entire pipeline is run on your **local PC**. It consists of two main parts:
1. One **Unreal Engine Blueprint** "*MapGrabAssets.uasset*" to be added to the [Squad SDK](https://squad.gamepedia.com/Squad_SDK) for exporting the game data.
2. Different **JavaScripts** for processing, converting and uploading the exported game data to the wiki.






### Installing Blueprint MapGrabAssets.uasset

The latest version of the [Squad SDK](https://squad.gamepedia.com/Squad_SDK) is required. You will find instructions on how to install the Squad SDK [here](https://squad.gamepedia.com/Squad_SDK#Downloading_the_Epic_Games_Launcher).

Please note, you have to re-install this Blueprint after every new release version of the Squad SDK. To find out more about Blueprints, see [official documentation](https://docs.unrealengine.com/en-US/Engine/Blueprints/GettingStarted/index.html). You can see all versions of the Squad SDK [here](https://squad.gamepedia.com/Squad_SDK#Version_history).


1. Place the blueprint within the SDK folders. It's recommended that the Blueprint is placed at `/SquadEditor/Squad/Content/Wiki/`.

2. Navigate to `SquadEditor/Squad/Config` and open up `DefaultGame.ini`. Under `[/Script/Engine.AssetManagerSettings]` the line
 `+PrimaryAssetTypesToScan=(PrimaryAssetType="Map",AssetBaseClass=/Script/Engine.World,bHasBlueprintClasses=False,bIsEditorOnly=True,Directories=((Path="/Game/Maps")))` must be added.

3. Open the Squad SDK and navigate to where the Blueprint was placed and open it.

4. Navigate to `/Content/UI/` within the SDK and open the Blueprint called `BP_HUD`.

5. Create a new function in the BP_HUD Blueprint and name it `MapGrabAssets`.

![BP_HUD Blueprint](/doc/images/sdk/sdk_new_function.png)

6. Open up the blueprint `MapGrabAssets` again and select the entire script.

![script selection](/doc/images/sdk/sdk_select_function.png)

7. Copy the selected script and paste it into the BP_HUD Blueprint.

8. Move the Function Start (this should be in the middle of the paste) and move it to the start.

![Function Start](/doc/images/sdk/sdk_move_1.png)

9. Connect the Function Start to the first node in the Blueprint.

![Blueprint Connect](/doc/images/sdk/sdk_move_2.png)

10. Naviagate to the top right of the function and locate the nodes that reset arrays.

11. Right click each variable (including the `PWorldSettings`) and promote them to variables. 

![Promote to Variable](/doc/images/sdk/sdk_create_variable.png)

12. The previous step will create new nodes for each variable, remove these nodes. 

![Remove Nodes](/doc/images/sdk/sdk_delete_variable.png)

13. Open up the `Event Graph` in the BP_HUD.

14. Navigate to `Wait for Start of Match` near the top of the blueprint and copy the delay node. 

![Copy Node](/doc/images/sdk/sdk_copy_delay.png)

15. Paste the delay node at the end of `Wait for Start of Match`

16. Drag the `MapGrabAssets` function from the left bar into the blueprint.

17. Connect the Delay node with the function node. ![Connect Nodes](/doc/images/sdk/sdk_attach_function.png)

18. Compile and save the blueprint.
