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
> const filePath = "../testdata/assets/users.json"
> ```
> 
> Implementation  
> `PuddleJSON.stringify(data) === answer`
> ```typescript
> true
> ```
<br>
