class AnimationQueue {

  /**
   * Used to keep track of animations that haven't happened yet.
   */
  constructor() {
    this.queue = []
  }

  /**
   * Used to get the number of animations in the queue.
   */
  get length() {
    return this.queue.length;
  }

  /**
   * Used to add transformations to the queue.
   */
  add() {
    this.queue.push(...arguments);
  }

  /**
   * Removes the first animation from the queue to be processed.
   */
  next() {
    let result;
    result = this.queue.shift();
    return result;
  }

  /**
   * Removes the last animation from the queue in order to merge it with another.
   */
  last() {
    let result;
    result = this.queue.pop();
    return result;
  }

  /**
   * Used to tell what the Animated's properties will look like in the
   * future so we can split animations up properly when merging.
   */
  finalState() {
    return this.queue.map(t=>t.propertyValueMap).reduce((accumulator, currentValue)=>{
      return {...accumulator, ...currentValue};
    }, {});
  }

}