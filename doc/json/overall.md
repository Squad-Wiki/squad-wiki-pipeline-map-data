# Finished JSON Documentation
This set of docs will split up the structure of the JSON into several compoents. Due to the vast amound of data within this JSON I've had to seperate the documentation up. Anything with a /Text\ is a note (and will usually say to visit another page for documentation) and not part of the structure. 

If the object has a dynamic name (like in the Units object) the type of the object name will be given. There will be a note that the key is dyamic. For example the object keys in "Units" will be a "unitObjectName" with a note that it is dynamic. With static names the key will be the same, but the value will be the type of the value with any specific notes. I.e. the name of a map will be: `"Name": "string" # Map display name`. Best way is to compare to the json to see what is dynamic and what is static.

## Important note about names
There are several types of "names" within the SDK. You have to be very careful not to be confused on what a value is. I've noted three type of names within comments:

* Display Name
    * This is the name that a player will see.
* Object Name
    * This is the UE4 object name within the world.
* Object Display Name
    * This is the display name of the UE4 object. (Usually a nicer version of the object name)


## Documentation

* Overall Structure (this document)
* [Map Object](./map/mapObject.md)

# Overall Structure

```json
{
    "Maps": [
        {
            /Map Object, see below for Map Object documentation\
            }
    ],
    "Units" : {
        "unitObjectName":{ # Dyanmic key
            /Unit Object, see below for Unit Object documentation\
        }
    }
}
```

[Map Object Documentation](./map/mapObject.md)

[Unit Object Documentation]()