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

}