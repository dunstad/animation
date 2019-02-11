[This](https://danmarshall.github.io/google-font-to-svg-path/) is the website I got the SVG font paths from.

This script helps get all the paths from the app automatically:

```
let letterPaths = [];
let timeout = 0;
for (let letter of 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz') {
  setTimeout(()=>{
    document.getElementById('input-text').value = letter;
    app.renderCurrent();

    setTimeout(()=>{
      letterPaths.push(document.getElementById('output-svg').value);
    }, 200);
    
  }, timeout);
  timeout += 1000;
}
```

The first font I've grabbed is Roboto, and the next will be Allerta Stencil.