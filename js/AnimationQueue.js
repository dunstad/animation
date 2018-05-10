class AnimationQueue {

  constructor() {
    this.queue = []
    this.animating = false;
  }

  add(transformation) {
    this.queue.push(transformation);
  }

  next() {
    let result;
    if (!this.animating) {
      result = this.queue.shift();
      if (result) {
        this.animating = true;
      }
    }
    else {
      result = false;
    }
    return result;
  }
  
  animationComplete() {
    this.animating = false;
  }

  isAnimating() {
    return this.animating;
  }

  nextWaits() {
    return this.queue[this.queue.length - 1].waitForFinish;
  }

}