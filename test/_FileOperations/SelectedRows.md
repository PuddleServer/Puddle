# class SelectedRows

## Unit Test

### constructor
> #### **Case 1**
> **Arguments**
> | name | Type |
> | :- | :- |
> | selectedRows | ROW[] |
> | filePath | string |
> | schema | SCHEMA |
> 
> **Return**  
> Type  
> *&emsp;string*  
>
> **Test**  
> Preparation
> ```typescript
> const selectedRows = [
>   {"name":"Jonh", "age": 20},
>   {"name":"Alex", "age": 18}
> ];
> const filePath = "../testdata/assets/users.json";
> const newObject = new SelectedRows(selectedRows, filePath, {"name": [], "age": []});
> ```
> 
> Implementation  
> `newObject instanceof SelectedRows`
> ```typescript
> true
> ```
<br>

### get rows()
> #### **Case 1**
> 
> **Return**  
> Type  
> *&emsp;ROW[]*  
>
> **Test**  
> Preparation
> ```typescript
> const selectedRows = [
>   {"name":"Jonh", "age": 20},
>   {"name":"Alex", "age": 18}
> ];
> const filePath = "../testdata/assets/users.json";
> const newObject = new SelectedRows(selectedRows, filePath, {"name": [], "age": []});
> ```
> 
> Implementation  
> `selectedRows === newObject.rows`
> ```typescript
> true
> ```
<br>

### RESULT(...keys: string[])
> #### **Case 1**
> 
> **Return**  
> Type  
> *&emsp;ROW[]*  
>
> **Test**  
> Preparation
> ```typescript
> const selectedRows = [
>   {"name":"Jonh", "age": 20},
>   {"name":"Alex", "age": 18}
> ];
> const filePath = "../testdata/assets/users.json";
> const newObject = new SelectedRows(selectedRows, filePath, {"name": [], "age": []});
> ```
> 
> Implementation  
> `selectedRows === newObject.RESULT()`
> ```typescript
> true
> ```
<br>

> #### **Case 2**
> **Arguments**
> | name | Type |
> | :- | :- |
> | arguments[0] | string |
> 
> **Return**  
> Type  
> *&emsp;ROW[]*  
>
> **Test**  
> Preparation
> ```typescript
> const selectedRows = [
>   {"name":"Jonh", "age": 20},
>   {"name":"Alex", "age": 18}
> ];
> const filePath = "../testdata/assets/users.json";
> const newObject = new SelectedRows(selectedRows, filePath, {"name": [], "age": []});
> ```
> 
> Implementation  
> `selectedRows.map(row=>({"name":row.name})) === newObject.RESULT("name")`
> ```typescript
> true
> ```
<br>

> #### **Case 3**
> **Arguments**
> | name | Type |
> | :- | :- |
> | arguments[0] | string |
> 
> **Return**  
> Type  
> *&emsp;ROW[]*  
>
> **Test**  
> Preparation
> ```typescript
> const selectedRows = [
>   {"name":"Jonh", "age": 20},
>   {"name":"Alex", "age": 18}
> ];
> const filePath = "../testdata/assets/users.json";
> const newObject = new SelectedRows(selectedRows, filePath, {"name": [], "age": []});
> ```
> 
> Implementation  
> `selectedRows.map(row=>({"test":undefined})) === newObject.RESULT("test")`
> ```typescript
> true
> ```
<br>

### UPDATE(KeyAndValue: ROW)
> #### **Case 1**
> **Arguments**
> | name | Type |
> | :- | :- |
> | KeyAndValue | ROW |
> 
> **Return**  
> Type  
> *&emsp;ROW[]*  
>
> **Test**  
> Preparation
> ```typescript
> const filePath = "../testdata/assets/users.json";
> FileManager.ensureFileSync(filePath);
> await FileManager.write(filePath, `[
>   {"name":"Jonh", "age": 20},
>   {"name":"Alex", "age": 18}
> ]`);
> const selectedRows = PuddleJSON.USE(filePath).SELECT();
> const result = selectedRows.UPDATE({"age": 10});
> ```
> 
> Implementation  
> `result`
> ```typescript
> [
>   {"name":"Jonh", "age": 10},
>   {"name":"Alex", "age": 10}
> ]
> ```
> `PuddleJSON.USE(filePath).SELECT().rows`
> ```typescript
> [
>   {"name":"Jonh", "age": 10},
>   {"name":"Alex", "age": 10}
> ]
> ```
<br>

### REMOVE()
> #### **Case 1**
> 
> **Return**  
> Type  
> *&emsp;ROW[]*  
>
> **Test**  
> Preparation
> ```typescript
> const filePath = "../testdata/assets/users.json";
> FileManager.ensureFileSync(filePath);
> await FileManager.write(filePath, `[
>   {"name":"Jonh", "age": 20},
>   {"name":"Alex", "age": 18}
> ]`);
> const selectedRows = PuddleJSON.USE(filePath).SELECT({"name":"Jonh"});
> const result = selectedRows.REMOVE();
> ```
> 
> Implementation  
> `result`
> ```typescript
> [
>   {"name":"Alex", "age": 18}
> ]
> ```
> `PuddleJSON.USE(filePath).SELECT().rows`
> ```typescript
> [
>   {"name":"Alex", "age": 18}
> ]
> ```
<br>

### DELETE()
> #### **Case 1**
> 
> **Return**  
> Type  
> *&emsp;ROW[]*  
>
> **Test**  
> Preparation
> ```typescript
> const filePath = "../testdata/assets/users.json";
> FileManager.ensureFileSync(filePath);
> await FileManager.write(filePath, `[
>   {"name":"Jonh", "age": 20},
>   {"name":"Alex", "age": 18}
> ]`);
> const selectedRows = PuddleJSON.USE(filePath).SELECT({"name":"Jonh"});
> const result = selectedRows.DELETE();
> ```
> 
> Implementation  
> `result`
> ```typescript
> 1
> ```
> `PuddleJSON.USE(filePath).SELECT().rows`
> ```typescript
> [
>   {"name":"Alex", "age": 18}
> ]
> ```
<br>