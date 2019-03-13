class AnimationQueue {

  constructor() {
    this.queue = []
  }

  get length() {
    return this.queue.length;
  }

  /**
   * Used to add transformations to the queue.
   */
  add() {
    this.queue.push(...arguments);
  }

  next() {
    let result;
    result = this.queue.shift();
    return result;
  }

  last() {
    let result;
    result = this.queue.pop();
    return result;
  }

  finalState() {
    return this.queue.map(t=>t.propertyValueMap).reduce((accumulator, currentValue)=>{return {...accumulator, ...currentValue};}, {});
  }

}