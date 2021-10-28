# About authentication
## Setting up digest authentication
By connecting the AUTH method to the Route object, we can set up Digest authentication.  
This framework does not provide Basic authentication for security reasons. Use Digest authentication instead of Basic authentication please.
```typescript
System.createRoute("/auth1.html").URL("/auth1").AUTH("username", "pwd");

const route_name = "/auth2.html";
const hash = createHash("md5").upgrade(`username:${route_name}:pwd`).toString(); 
System.createRoute(route_name).URL("/auth2").AUTH(hash);
```

## Authentication using Google API
You can use OAuth 2.0 with the Google API to retrieve user information.  
[For more information](https://developers.google.com/identity/protocols/oauth2)
```typescript
const client_id = "*******.apps.googleusercontent.com";
const client_secret = "*******";
const redirect_url = "http://localhost:8080/google_auth2";
System.AUTH.GOOGLE(client_id, client_secret, redirect_url).URL("/Login")
.LOGIN((
    req:        SystemRequest,
    res:        SystemResponse,
    user_info:  { [key:string]: string; }
)=>{
    // "user_info" is the user information received from Google API.
    console.log(user_info);
    res.setText(JSON.stringify(user_info));
});
```