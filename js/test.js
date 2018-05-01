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
  animated.animate().move(100, 100).rotate(45).move(100, 50).rotate(23).move(0, 0).unanimate();
}

function testAnimateAndUnanimate(animated) {
  animated.move(100, 100).animate().move(0, 0).unanimate().move(100, 0);
}

function testMilisecondParameter(animated) {
  animated.animate().move(100, 100, 500).rotate(45, 2000).move(100, 50, 500).rotate(23, 2000).move(0, 0, 500).unanimate();
}

function testSeparateAnimationQueues(animated) {
  animated.toggleSpin(360, 1000 * 60).togglePulse(2, 1000 * 5);
}

function testMergeAnimation(animated) {
  animated.animate().rotate(90, 2000).unanimate();
  setTimeout(()=>{animated.mergeAnimation({scalar: 2, animate: true, milliseconds: 1000})}, 500);
}