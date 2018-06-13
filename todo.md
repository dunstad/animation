#### scene actions prototype code
```
var sky = new Sky();

var x = {
  mail: [
    {
      propertyValueMap: {x: 100},
      milliseconds: 1000,
    },
    {
      propertyValueMap: {y: 100},
      milliseconds: 1000,
    },
    {
      propertyValueMap: {},
      milliseconds: 1000,
    },
    {
      propertyValueMap: {x: 0},
      milliseconds: 1000,
    },
  ],
  sky: [
    {
      propertyValueMap: {
        x: 200,
        y: 200,
      },
    },
    {
      propertyValueMap: {x: 300},
      milliseconds: 1000,
    },
    {
      propertyValueMap: {y: 300},
      milliseconds: 1000,
    },
    {
      milliseconds: 1000,
    },
    {
      propertyValueMap: {x: 200},
      milliseconds: 1000,
    },
  ],
}

Object.keys(x).forEach(key=>x[key] = x[key].map(o=>window[key].addTransformation(o)));
```
* make waitForFinish=false work when milliseconds isn't specified
* after fails sometimes if the milliseconds are too long
  * callback is getting called twice in rapid succession
  * after speeds up rotation if specified shortly before the current animation will end, until the after transformation is merged
* after right now is sort of like a delay + waitForFinish=false, maybe make it just a delay
* make toggle cancels easily queueable
  * seems to work fine without using after
* a Scene's Actions should be a map of assets and lists of transformations
* make recording easier
* make some tests for Sky
* make the tests more general and easy to run
* test howler + web audio recorder for audio exporting
* correct animations for time lost during processing?