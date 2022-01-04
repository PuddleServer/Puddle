# class ConfigReader

## Unit Test

### static async read(filePath: string)
> #### **Case 1**
> **Arguments**
> | name | Type |
> | :- | :- |
> | filePath | string |
> 
> **Return**  
> Type  
> *&emsp;Promise&lt;Config&gt;*  
>
> **Test**  
> Preparation
> ```typescript
> const temp = { SERVER: { HOST: "localhost", PORT: 8080 } };
> const conf = ConfigReader.read("../testdata/assets/conf.json");
> ```
> 
> Implementation  
> `JSON.stringify(conf) === JSON.stringify(temp)`
> ```typescript
> true
> ```
<br>

> #### **Case 2**
> **Arguments**
> | name | Type |
> | :- | :- |
> | filePath | string |
> 
> **Return**  
> Type  
> *&emsp;Promise&lt;Config&gt;*  
>
> **Test**  
> Preparation
> ```typescript
> const temp = { SERVER: { HOST: "localhost", PORT: 8080 } };
> const conf = ConfigReader.read("../testdata/assets/conf.env");
> ```
> 
> Implementation  
> `JSON.stringify(conf) === JSON.stringify(temp)`
> ```typescript
> true
> ```
<br>

---

### static decodeEnv(file_data: string)
> #### **Case 1**
> **Arguments**
> | name | Type |
> | :- | :- |
> | file_data | string |
> 
> **Return**  
> Type  
> *&emsp;Promise&lt;Config&gt;*  
>
> **Test**  
> Preparation
> ```typescript
> const temp = { SERVER: { HOST: "localhost", PORT: 8080 } };
> const data = `SERVER.HOST=localhost\nSERVER.PORT=8080`;
> ```
> 
> Implementation  
> `JSON.stringify(ConfigReader.decodeEnv(data)) === JSON.stringify(temp)`
> ```typescript
> true
> ```
<br>