class AnimationQueue {

  constructor() {
    this.queue = []
  }

  get length() {
    return this.queue.length;
  }

  add(transformation) {
    this.queue.push(transformation);
  }

  next() {
    let result;
    result = this.queue.shift();
    return result;
  }

  finalState() {
    return this.queue.map(t=>t.propertyValueMap).reduce((accumulator, currentValue)=>{return {...accumulator, ...currentValue};}, {});
  }

}