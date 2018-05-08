class Transformation {

    constructor(transformationObject) {
        transformationObject = transformationObject || {};
        
        // {x: number, y: number}, can leave out either x or y
        this.location = transformationObject.location;
        
        // number
        this.rotation = transformationObject.rotation;
        
        // number
        this.scalar = transformationObject.scalar;
        
        // number
        this.milliseconds = transformationObject.milliseconds;
        
        // boolean
        this.animate = transformationObject.animate;
        
        // an array of four functions
        this.easing = transformationObject.easing;

        // function
        this.callback = transformationObject.callback;

        // boolean
        this.waitForFinish = transformationObject.waitForFinish;
    }

    setLocation(x, y) {
        this.location = {
            x: x,
            y: y,
        };
    }

}