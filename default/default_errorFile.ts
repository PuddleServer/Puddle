export const errorHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{status}} {{description}}</title>
</head>
<body>
    <img id="error" src="https://github.com/PuddleServer/Artwork/raw/main/assets/{{status}}.png" alt="{{status}} {{description}}">
    <p>Puddle Framework {{version}}</p>
    <style>
        img#error {
            position: relative;
            top: 50vh;
            left: 50%;
            transform: translateY(-55%) translateX(-50%);
            width: 70vmin;
            height: 70vmin;
            max-width: 1000px;
            max-height: 1000px;
            object-fit: cover;
        }
        p {
            position: fixed;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            white-space: nowrap;
        }
    </style>
</body>
</html>
`;