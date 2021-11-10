# How to create a Route in a text file
If you write `{{createPath( ./anyFilePath )}}` in a text file, a Route will be created automatically.
```html
<link rel="stylesheet" href="{{createPath(./style.css)}}">

<script type="text/script" src="{{createPath(./main.js)}}"></script>
```

# How to embed variables in a text file
If you write `{{ anyVariableName }}` in the text, the preset value will be inserted.
```typescript
Sytem.createRoute("greeting").URL("/").GET( async (req: SystemRequest, res: SystemResponse) => {

    // Set variables.
    res.preset({ variableName: "world"});

    res.setText("hello {{variableName}}");
    await res.setFile("./greeting.html");

})
```
```html
<!DOCTYPE html>
<html>
<head>
    <title>Hello {{variableName}}!</title>
</head>
<body>
    <h1>Hello {{variableName}}!</h1>
</body>
</html>
```