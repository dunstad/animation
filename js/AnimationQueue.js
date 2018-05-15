class AnimationQueue {

  constructor() {
    this.queue = []
    this.animating = 0;
  }

  get length() {
    return this.queue.length;
  }

  add(transformation) {
    this.queue.push(transformation);
  }

  next() {
    let result;
    if (!this.animating) {
      result = this.queue.shift();
      if (result) {
        this.animating += 1;
      }
    }
    else {
      result = false;
    }
    return result;
  }
  
  animationComplete() {
    this.animating -= 1;
    if (this.animating < 0) {
      throw new Error('animations stopped more times than started');
    }
  }

  isAnimating() {
    return this.animating;
  }

  nextWaits() {
    return this.length ? this.queue[this.length - 1].waitForFinish : true;
  }

}