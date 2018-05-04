container = document.getElementById('container');

svgData = {
  'mail': '/img/basic_mail.svg',
  'cube': '/img/cube-outline.svg',
}

loader = new Loader(container, svgData);

loader.then((assets)=>{
  for (let name in assets) {
    window[name] = assets[name];
  }

  cube.element.attr({visibility: 'hidden'});

})

function testMoveAndRotate(animated) {
  animated.queue().move(100, 100, 1000).rotate(45, 1000).move(100, 50, 1000).rotate(23, 1000).move(0, 0, 1000).unqueue();
}

function testAnimateAndUnanimate(animated) {
  animated.move(100, 100).queue().move(0, 0, 1000).unqueue().move(100, 0);
}

function testMilisecondParameter(animated) {
  animated.queue().move(100, 100, 500).rotate(45, 2000).move(100, 50, 500).rotate(23, 2000).move(0, 0, 500).unqueue();
}

function testSeparateAnimationQueues(animated) {
  animated.toggleSpin(360, 1000 * 60).togglePulse(2, 1000 * 5);
}

function testMergeAnimation(animated) {
  animated.queue().rotate(90, 2000).unqueue();
  setTimeout(()=>{animated.mergeAnimation({scalar: 2, animate: true, milliseconds: 1000})}, 500);
}

function testMergeAnimation2(animated) {
  animated.queue().rotate(360, 1000*4).unqueue();
  setTimeout(()=>{animated.mergeAnimation({scalar: 2, animate: true, milliseconds: 1000})}, 2000);
}

function testSeparateXAndY(animated) {
  animated.queue().moveX(500, 1000*10).unqueue();
  setTimeout(()=>{animated.mergeAnimation({location: {y: 100}, animate: true, milliseconds: 1000})}, 2000);
}