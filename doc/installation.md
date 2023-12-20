**! ! ! WARNING ! ! ! THIS IS OUT OF DATE AND NEEDS A REWRITE!!**

**If you are needing a completed output please ask `werewolfboy13#0666` for a completed `raw.txt` in the squad wiki discord.**

**A rewrite is planned for the new workflow.**

# Pipeline Installation

The entire pipeline is run on your **local PC**. It consists of two main parts:

1. Adding the  **Unreal Engine Blueprints**, **Data Table**, and **Data Structure** to the [Squad SDK](https://squad.gamepedia.com/Squad_SDK) for exporting the game data.
2. Different **JavaScripts** for converting and uploading the exported game data to the wiki.

### Installing Blueprint MapGrabAssets.uasset

The latest version of the [Squad SDK](https://squad.gamepedia.com/Squad_SDK) is required. You will find instructions on how to install the Squad SDK [here](https://squad.gamepedia.com/Squad_SDK#Downloading_the_Epic_Games_Launcher).


1. Create a new folder in `/SquadEditor/Squad/Content/` named `Wiki`.

2. Place the *LightingLayers.uasset*, *LightingLayersStructure.uasset*, and *MapGrabAsset4_0.uasset* within the wiki folder.

3. Open the Squad SDK.

4. Open up the project settings by mousing over `Edit` in the top left and clicking on `Project Settings`.

![Project Settings](/doc/images/sdk/sdk_project_settings.png)

5. Open Up the `Asset Manager` section.

![Asset Manager](/doc/images/sdk/sdk_asset_manager.png)

6. Under `Primary Asset Types To Scan` click the plus icon.

![Add New Asset](/doc/images/sdk/sdk_add_primary_asset.png)

7. Set the new `Primary Asset type` to `Map`, the `Asset Base Class` to `World` and the directory to `/Game/`.

![Asset Configure](/doc/images/sdk/sdk_new_primary_asset.png)

8. Open up the `Play Squad` section under **`Level Editor`**.

![Play Squad](/doc/images/sdk/sdk_play_squad.png)

9. Untick the `Limit Data Loading` textbox.

![Limit Data Loading](/doc/images/sdk/sdk_limit_data_loading_checkbox.png)

10. Close the setttings and navigate to `/Content/UI/` within the SDK and open the Blueprint called `BP_HUD`.

11. Click `Add Component` and search `Map Grab Asset 4 0` and click on it.

![Add Component](/doc/images/sdk/sdk_add_component.png)

12. Navigate to the `On BeginPlay` section towards the top of the blueprint and break the link from `Event BeginPlay` to the `Branch` node.

![Break Link](/doc/images/sdk/sdk_break_all_links.png)

13. Drag the `Map Grab Assets 4 0` asset from the left bar into the blueprint.

![Drag Actor](/doc/images/sdk/sdk_drag_actor.png)

14. Drag off the blue object reference and search `Grab Points` and click on the function that appears.

![Create new Function](/doc/images/sdk/sdk_create_new_function.png)

15. Connect the execute nodes on the `Event BeginPlay`, `Grab Points`, and `Branch`.

![Connect Nodes](/doc/images/sdk/sdk_final_grab_points.png)

16. Naviage to the end of the comment and then create a new function `Grab Asset` and connect the execute node to the `Request Player Data` blueprint.

![Grab Asset](/doc/images/sdk/sdk_grab_asset_function.png)

17. Compile and save the blueprint.

18. Navigate to  `/Content/Gameplay/Gamemodes/Destruction` and open the `BP_DestructionObjectiveArea` blueprint.

19. Add the `Map Grab Assets 4 0` component to this blueprint.

20. Find the `Initilization of Objective` comment and add the `Destruction Objective Graber` function in between `Event BeginPlay` and `Switch Has Authority`

![Objective Grabber](/doc/images/sdk/sdk_destruction_objective_grabber.png)

21. Compile and save the blueprint.

22. Navigate to  `/Content/Gameplay/Objectives` and open the `BP_ObjectiveSpawnLocation` blueprint.

23. If prompted make sure to `Open Full Blueprint Editor`.

23. Add the `Map Grab Assets 4 0` component to this blueprint.

24. Find the `Event BeginPlay` and add the `Destruction Grabber` function there.

![Destruction Grabber](/doc/images/sdk/sdk_destruction_grabber.png)

25. Compile and save the blueprint.


Installation is complete at this point. See the [SDK configuration](./sdkConfiguration.md) for the next steps.