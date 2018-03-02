class AnimationQueue {

  constructor() {
    this.queue = []
    this.animate = false;
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

  start() {
    this.animate = true;
  }

  stop() {
    this.animate = false;
  }

  shouldContinue() {
    return this.animate;
  }

}