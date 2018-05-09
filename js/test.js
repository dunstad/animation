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

/**
 * @param {Animated} animated 
 */
function testMoveAndRotate(animated) {
  animated.move(100, 100, 1000).rotate(45, 1000).move(100, 50, 1000).rotate(23, 1000).move(0, 0, 1000);
}

/**
 * @param {Animated} animated 
 */
function testAnimateAndUnanimate(animated) {
  animated.move(100, 100).move(0, 0, 1000).move(100, 0);
}

/**
 * @param {Animated} animated 
 */
function testMergeAnimation(animated) {
  animated.rotate(90, 2000);
  setTimeout(()=>{animated.mergeAnimation(new Transformation({scalar: 2, animate: true, milliseconds: 1000}))}, 500);
}

/**
 * @param {Animated} animated 
 */
function testMergeAnimation2(animated) {
  animated.rotate(360, 1000*4);
  setTimeout(()=>{animated.mergeAnimation(new Transformation({scalar: 2, animate: true, milliseconds: 1000}))}, 2000);
}

/**
 * @param {Animated} animated 
 */
function testSeparateXAndY(animated) {
  animated.moveX(500, 1000*10);
  setTimeout(()=>{animated.mergeAnimation(new Transformation({location: {y: 100}, animate: true, milliseconds: 1000}))}, 2000);
}

/**
 * @param {Animated} animated 
 */
function testEasingMap(animated) {
  animated.moveX(500, 1000*10);
  setTimeout(()=>{animated.mergeAnimation(new Transformation({location: {y: 100}, animate: true, milliseconds: 1000, easing: [mina.linear, mina.easeinout, mina.linear, mina.linear]}))}, 2000);
}

/**
 * @param {Animated} animated 
 */
function testAutoMerge(animated) {
  animated.moveX(500, 1000*10);
  setTimeout(()=>{animated.moveY(100, 1000, mina.easeinout, false)}, 2000);
}