class Transformation {

    constructor(transformationObject) {
        transformationObject = transformationObject || {};
        this.location = transformationObject.location;
        this.rotation = transformationObject.rotation;
        this.scalar = transformationObject.scalar;
        this.milliseconds = transformationObject.milliseconds;
        this.animate = transformationObject.animate;
        this.easing = transformationObject.easing;
        this.easingMap = transformationObject.easingMap;
        this.callback = transformationObject.callback;
    }

    setLocation(x, y) {
        this.location = {
            x: x,
            y: y,
        };
    }

}