# class PuddleJSON

## Unit Test

### static stringify(data: {[key:string]: any;}|string)
> #### **Case 1**
> **Arguments**
> | name | Type |
> | :- | :- |
> | data | string |
> 
> **Return**  
> Type  
> *&emsp;string*  
>
> **Test**  
> Preparation
> ```typescript
> const data = `[{"name":"Jonh", "age": 20},{"name":"Alex", "age": 18}]`;
> const answer = '[\n{"name":"Jonh", "age": 20},\n{"name":"Alex", "age": 18}\n]'
> ```
> 
> Implementation  
> `PuddleJSON.stringify(data) === answer`
> ```typescript
> true
> ```
<br>

> #### **Case 2**
> **Arguments**
> | name | Type |
> | :- | :- |
> | data | {[key:string]: any;} |
> 
> **Return**  
> Type  
> *&emsp;string*  
>
> **Test**  
> Preparation
> ```typescript
> const data = [{name:"Jonh", age: 20},{name:"Alex", age: 18}];
> const answer = '[\n{"name":"Jonh", "age": 20},\n{"name":"Alex", "age": 18}\n]'
> ```
> 
> Implementation  
> `PuddleJSON.stringify(data) === answer`
> ```typescript
> true
> ```
<br>

---

### static checkSchema(data: ROW[], SCHEMA: SCHEMA)
> #### **Case 1**
> **Arguments**
> | name | Type |
> | :- | :- |
> | data | ROW[] |
> | SCHEMA | SCHEMA |
> 
> **Return**  
> Type  
> *&emsp;ROW[]*  
>
> **Test**  
> Preparation
> ```typescript
> const data = [{id:1}];
> const SCHEMA: SCHEMA = {id: ["UNIQUE", "NOT NULL"], name: []};
> const answer = [{id:1,name:null}]
> ```
> 
> Implementation  
> `JSON.stringify(PuddleJSON.checkSchema(data, SCHEMA)) === JSON.stringify(answer)`
> ```typescript
> true
> ```
<br>

> #### **Case 2**
> **Arguments**
> | name | Type |
> | :- | :- |
> | data | ROW[] |
> | SCHEMA | SCHEMA |
> 
> **Return**  
> Type  
> *&emsp;ROW[]*  
>
> **Test**  
> Preparation
> ```typescript
> const data = [{id:1}];
> const SCHEMA: SCHEMA = {id: ["NOT NULL"], name: "NOT NULL"};
> ```
> 
> Implementation  
> `PuddleJSON.checkSchema(data, SCHEMA)`
> ```bash
> [PuddleJSON] Schema error.
> ```
<br>

> #### **Case 3**
> **Arguments**
> | name | Type |
> | :- | :- |
> | data | ROW[] |
> | SCHEMA | SCHEMA |
> 
> **Return**  
> Type  
> *&emsp;ROW[]*  
>
> **Test**  
> Preparation
> ```typescript
> const data = [{id:1}, {id:1}];
> const SCHEMA: SCHEMA = {id: "UNIQUE"};
> ```
> 
> Implementation  
> `PuddleJSON.checkSchema(data, SCHEMA)`
> ```bash
> [PuddleJSON] Schema error.
> ```
<br>

---

### static autoIncrement(data: ROW[], KeyAndValue: ROW, SCHEMA: SCHEMA)
> #### **Case 1**
> **Arguments**
> | name | Type |
> | :- | :- |
> | data | ROW[] |
> | KeyAndValue | ROW |
> | SCHEMA | SCHEMA |
> 
> **Return**  
> Type  
> *&emsp;ROW*  
>
> **Test**  
> Preparation
> ```typescript
> const SCHEMA: SCHEMA = {id: "AUTO INCREMENT"};
> ```
> 
> Implementation  
> `PuddleJSON.autoIncrement([], {}, SCHEMA).id`
> ```typescript
> 1
> ```
> `PuddleJSON.autoIncrement([{id:1}], {}, SCHEMA).id`
> ```typescript
> 2
> ```
> `PuddleJSON.autoIncrement([{id:1}], {id:10}, SCHEMA).id`
> ```typescript
> 10
> ```
<br>

---

### static CREATE(filePath: string, SCHEMA?: SCHEMA)
> #### **Case 1**
> **Arguments**
> | name | Type |
> | :- | :- |
> | filePath | string |
> | SCHEMA | SCHEMA |
> 
> **Return**  
> Type  
> *&emsp;ROW*  
>
> **Test**  
> Preparation
> ```typescript
> FileManager.ensureFileSync("../testdata/assets/users.json");
> await FileManager.write("../testdata/assets/users.json", "");
> const SCHEMA: SCHEMA = {
>      id:["UNIQUE", "AUTO INCREMENT", "NOT NULL"], 
>      name:"NOT NULL", 
>      age:[]
> };
> const result = PuddleJSON.CREATE("../testdata/assets/users.json", SCHEMA);
> ```
> 
> Implementation  
> `result instanceof PuddleJSON`
> ```typescript
> true
> ```
> `"../testdata/assets/users.json" in PuddleJSON.TABLE`
> ```typescript
> true
> ```
<br>

---

### static USE(filePath: string, SCHEMA?: SCHEMA)
> #### **Case 1**
> **Arguments**
> | name | Type |
> | :- | :- |
> | filePath | string |
> | SCHEMA | SCHEMA |
> 
> **Return**  
> Type  
> *&emsp;ROW*  
>
> **Test**  
> Preparation
> ```typescript
> FileManager.ensureFileSync("../testdata/assets/users.json");
> await FileManager.write("../testdata/assets/users.json", "");
> const SCHEMA: SCHEMA = {
>      id:["UNIQUE", "AUTO INCREMENT", "NOT NULL"], 
>      name:"NOT NULL", 
>      age:[]
> };
> const users = PuddleJSON.USE("../testdata/assets/users.json", SCHEMA);
> ```
> 
> Implementation  
> `users instanceof PuddleJSON`
> ```typescript
> true
> ```
> `PuddleJSON.USE("../testdata/assets/users.json") === users`
> ```typescript
> true
> ```
<br>

---

### constructor
> #### **Case 1**
> **Arguments**
> | name | Type |
> | :- | :- |
> | filePath | string |
> | SCHEMA | SCHEMA |
> 
> **Return**  
> Type  
> *&emsp;ROW*  
>
> **Test**  
> Preparation
> ```typescript
> FileManager.ensureFileSync("../testdata/assets/users.json");
> await FileManager.write("../testdata/assets/users.json", "");
> const SCHEMA: SCHEMA = {
>      id:["UNIQUE", "AUTO INCREMENT", "NOT NULL"], 
>      name:"NOT NULL", 
>      age:[]
> };
> const users = new PuddleJSON("../testdata/assets/users.json", SCHEMA);
> ```
> 
> Implementation  
> `users instanceof PuddleJSON`
> ```typescript
> true
> ```
> `"../testdata/assets/users.json" in PuddleJSON.TABLE`
> ```typescript
> true
> ```
<br>

---

### INSERT(KeyAndValue:  ROW)
> #### **Case 1**
> **Arguments**
> | name | Type |
> | :- | :- |
> | filePath | string |
> | SCHEMA | SCHEMA |
> 
> **Return**  
> Type  
> *&emsp;ROW*  
>
> **Test**  
> Preparation
> ```typescript
> FileManager.ensureFileSync("../testdata/assets/users.json");
> await FileManager.write("../testdata/assets/users.json", "");
> const SCHEMA: SCHEMA = {
>      id:["UNIQUE", "AUTO INCREMENT", "NOT NULL"], 
>      name:"NOT NULL", 
>      age:[]
> };
> const users = PuddleJSON.USE("../testdata/assets/users.json", SCHEMA);
> const inserted_data = users.INSERT({name: "John", age: 20});
> ```
> 
> Implementation  
> `inserted_data === {name: "John", age: 20, id: 1}`
> ```typescript
> true
> ```
<br>

---

### SELECT(WHERE: ROW = {}, LIMIT: number = Infinity)
> #### **Case 1**
> **Arguments**
> | name | Type |
> | :- | :- |
> | WHERE | ROW |
> | LIMIT | number |
> 
> **Return**  
> Type  
> *&emsp;ResultOfPuddleJSON*  
>
> **Test**  
> Preparation
> ```typescript
> FileManager.ensureFileSync("../testdata/assets/users.json");
> await FileManager.write("../testdata/assets/users.json", "");
> const SCHEMA: SCHEMA = {
>      id:["UNIQUE", "AUTO INCREMENT", "NOT NULL"], 
>      name:"NOT NULL", 
>      age:[]
> };
> const users = PuddleJSON.USE("../testdata/assets/users.json", SCHEMA);
> const inserted_data = users.INSERT({name: "select_test"});
> users.INSERT({name: "select_test"});
> ```
> 
> Implementation  
> ``PuddleJSON.SELECT({name: "select_test"}) instanceof ResultOfPuddleJSON`
> ```typescript
> true
> ```
> `PuddleJSON.SELECT({name: "select_test"}).selectedRows[0] === inserted_data`
> ```typescript
> true
> ```
> `PuddleJSON.SELECT({name: "select_test"}).selectedRows.length`
> ```typescript
> 2
> ```
> `PuddleJSON.SELECT({name: "select_test"}, 1).selectedRows.length`
> ```typescript
> 1
> ```
<br>

---

### SELECTIF(criteria: SelectCriteria, LIMIT: number = Infinity)
> #### **Case 1**
> **Arguments**
> | name | Type |
> | :- | :- |
> | criteria | SelectCriteria |
> | LIMIT | number |
> 
> **Return**  
> Type  
> *&emsp;ResultOfPuddleJSON*  
>
> **Test**  
> Preparation
> ```typescript
> FileManager.ensureFileSync("../testdata/assets/users.json");
> await FileManager.write("../testdata/assets/users.json", "");
> const SCHEMA: SCHEMA = {
>      id:["UNIQUE", "AUTO INCREMENT", "NOT NULL"], 
>      name:"NOT NULL", 
>      age:[]
> };
> const users = PuddleJSON.USE("../testdata/assets/users.json", SCHEMA);
> users.INSERT({name: "selectif_test", age: 18});
> users.INSERT({name: "selectif_test", age: 18});
> users.INSERT({name: "selectif_test", age: 20});
> users.INSERT({name: "selectif_test", age: 20});
> users.INSERT({name: "selectif_test", age: 20});
> ```
> 
> Implementation  
> `PuddleJSON.SELECTIF(row=>({ id: Number(row.age) >= 20 })) instanceof ResultOfPuddleJSON`
> ```typescript
> true
> ```
> `PuddleJSON.SELECTIF(row=>({ id: Number(row.age) >= 20 })).selectedRows.length`
> ```typescript
> 3
> ```
> `PuddleJSON.SELECTIF(row=>({ id: Number(row.age) >= 0 })).selectedRows.length`
> ```typescript
> 5
> ```
> `PuddleJSON.SELECTIF(row=>({ id: Number(row.age) >= 0 }), 1).selectedRows.length`
> ```typescript
> 1
> ```
<br>