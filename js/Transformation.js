class Transformation {

    constructor(transformationObject) {
        this.location = transformationObject.location || {x: 0, y: 0};
        this.rotation = transformationObject.rotation || 0;
        this.scalar = transformationObject.scalar || 1;
        this.milliseconds = transformationObject.milliseconds || 0;
        this.animate = transformationObject.animate || false;
    }

}