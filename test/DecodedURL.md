
# class DecodedURL extends URL
## Unit Test
### constructor
> #### **Case 1**
> **Arguments**
> | name | Type | Value |
> | - | - | - |
> | url | USVString | `"http://example.com/サンプル?параметр#hash"` |
> 
> **Return**  
> Type  
> *&emsp;DecodedURL*  
>
> **Test**  
> Value : `new DecodedURL("http://example.com/サンプル?параметр#hash")`
> 
> `JSON.stringify(`Value`)`
> ```typescript
> `"http://example.com/%E3%82%B5%E3%83%B3%E3%83%97%E3%83%AB?%D0%BF%D0%B0%D1%80%D0%B0%D0%BC%D0%B5%D1%82%D1%80#hash"`
> ```
> Value`.toString()`  
> ```typescript
> `http://example.com/サンプル?параметр#hash`
> ```
> <br>
<br>

> #### **Case 2**
> **Arguments**
> | name | Type | Value |
> | - | - | - |
> | url | USVString | `/サンプル?параметр#hash` |
> | base | USVString | `http://example.com` |
> 
> **Return**  
> Type  
> *&emsp;DecodedURL*  
>
> **Test**  
> Value : `new DecodedURL("http://example.com/サンプル?параметр#hash")`
> 
> `JSON.stringify(`Value`)`
> ```typescript
> `"http://example.com/%E3%82%B5%E3%83%B3%E3%83%97%E3%83%AB?%D0%BF%D0%B0%D1%80%D0%B0%D0%BC%D0%B5%D1%82%D1%80#hash"`
> ```
> Value`.toString()`  
> ```typescript
> `http://example.com/サンプル?параметр#hash`
> ```
> <br>
<br>

### hash
> #### **Case 1**
> 
> **Return**  
> Type  
> *&emsp;USVString*  
>
> **Test**  
> URL : `new DecodedURL("http://example.com/サンプル?параметр#hash")`
> 
> URL`.hash`
> ```typescript
> `#hash`
> ```
> <br>
<br>

### host
> #### **Case 1**
> 
> **Return**  
> Type  
> *&emsp;USVString*  
>
> **Test**  
> URL : `new DecodedURL("http://example.com/サンプル?параметр#hash")`
> 
> URL`.host`
> ```typescript
> `example.com`
> ```
> <br>
<br>

> #### **Case 2**
> 
> **Return**  
> Type  
> *&emsp;USVString*  
>
> **Test**  
> URL : `new DecodedURL("http://example.com:4097/サンプル?параметр#hash")`
> 
> URL`.host`
> ```typescript
> `example.com:4097`
> ```
> <br>
<br>

### href
> #### **Case 1**
> 
> **Return**  
> Type  
> *&emsp;USVString*  
>
> **Test**  
> URL : `new DecodedURL("http://example.com/サンプル?параметр#hash")`
> 
> URL`.href`
> ```typescript
> `http://example.com/サンプル?параметр#hash`
> ```
> <br>
<br>

### origin
> #### **Case 1**
> 
> **Return**  
> Type  
> *&emsp;USVString*  
>
> **Test**  
> URL : `new DecodedURL("http://example.com/サンプル?параметр#hash")`
> 
> URL`.origin`
> ```typescript
> `http://example.com`
> ```
> <br>
<br>

### password
> #### **Case 1**
> 
> **Return**  
> Type  
> *&emsp;USVString*  
>
> **Test**  
> URL : `new DecodedURL("http://ユーザー:パスワード@example.com/サンプル?параметр#hash")`
> 
> URL`.password`
> ```typescript
> `パスワード`
> ```
> <br>
<br>

### pathname
> #### **Case 1**
> 
> **Return**  
> Type  
> *&emsp;USVString*  
>
> **Test**  
> URL : `new DecodedURL("http://example.com/サンプル?параметр#hash")`
> 
> URL`.pathname`
> ```typescript
> `/サンプル`
> ```
> <br>
<br>

### port
> #### **Case 1**
> 
> **Return**  
> Type  
> *&emsp;USVString*  
>
> **Test**  
> URL : `new DecodedURL("http://example.com:80/サンプル?параметр#hash")`
> 
> URL`.port`
> ```typescript
> ``
> ```
> <br>
<br>

> #### **Case 2**
> 
> **Return**  
> Type  
> *&emsp;USVString*  
>
> **Test**  
> URL : `new DecodedURL("http://example.com:4097/サンプル?параметр#hash")`
> 
> URL`.port`
> ```typescript
> `4097`
> ```
> <br>
<br>

### protocol
> #### **Case 1**
> 
> **Return**  
> Type  
> *&emsp;USVString*  
>
> **Test**  
> URL : `new DecodedURL("http://example.com/サンプル?параметр#hash")`
> 
> URL`.protocol`
> ```typescript
> `http:`
> ```
> <br>
<br>

### search
> #### **Case 1**
> 
> **Return**  
> Type  
> *&emsp;USVString*  
>
> **Test**  
> URL : `new DecodedURL("http://example.com/サンプル?параметр#hash")`
> 
> URL`.search`
> ```typescript
> `?параметр`
> ```
> <br>
<br>

### searchParams
> #### **Case 1**
> 
> **Return**  
> Type  
> *&emsp;USVString*  
>
> **Test**  
> URL : `new DecodedURL("http://example.com/サンプル?名前=太郎&年齢=20")`
> 
> URL`.searchParams.toString()`
> ```typescript
> `%E5%90%8D%E5%89%8D=%E5%A4%AA%E9%83%8E&%E5%B9%B4%E9%BD%A2=20`
> ```
> 
> URL`.searchParams.get("名前")`
> ```typescript
> `太郎`
> ```
> 
> URL`.searchParams.has("年齢")`
> ```typescript
> true
> ```
> <br>
<br>

### username
> #### **Case 1**
> 
> **Return**  
> Type  
> *&emsp;USVString*  
>
> **Test**  
> URL : `new DecodedURL("http://ユーザー:パスワード@example.com/サンプル?параметр#hash")`
> 
> URL`.username`
> ```typescript
> `ユーザー`
> ```
> <br>
<br>