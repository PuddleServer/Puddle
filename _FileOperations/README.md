# Reading and writing text files
Methods for reading and writing text files.
```typescript
import { System, FileManager } from "https://github.com/PuddleServer/Puddle/raw/v1.1.0-beta/mod.ts"

await System.fm.read("./filePath");
await System.fm.write("./filePath", "text");

await FileManager.read("./filePath");
await FileManager.write("./filePath", "text");
```

## Manipulate JSON files
It provides functions to easily manipulate data in JSON files.
```typescript
import { System, PuddleJSON } from "https://github.com/PuddleServer/Puddle/raw/v1.1.0-beta/mod.ts";

// Specify the JSON file to be manipulated and its schema.
const USERS = PuddleJSON.USE("./users.json", {
    id:     ["UNIQUE", "NOT NULL", "AUTO INCREMENT"],
    name:   ["NOT NULL"],
    age:    []
});
/*
const USERS = System.JSON.USE("./users.json", {
    id:     ["UNIQUE", "NOT NULL", "AUTO INCREMENT"],
    name:   ["NOT NULL"],
    age:    []
});
*/

// Adding new data.
USERS.INSERT({ name: "Steve", age: 20 });

// Select the data whose id is 1, and get the data of name and age.
USERS.SELECT({ id: 1 }).RESULT("name", "age");
// USERS.SELECT({ id: 1 }, limit).RESULT("name", "age");

// Select the data whose age is 18 or more and get all columns.
USERS.SELECTIF( row => ({ age: Number(row.age) >= 18 }) ).RESULT();

// Update the value of age of the data whose id is 1 to update 21.
USERS.SELECT({ id: 1 }, 1 ).UPDATE({ age: 21 });

// Delete the data whose age is null.
USERS.SELECT({ age: null }).DELETE();
```