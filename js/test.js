container = document.getElementById('container');

svgData = {
  'mail': '/img/basic_mail.svg',
  'cube': '/img/cube-outline.svg',
}

new Loader(container, svgData).then((assets)=>{
  for (let name in assets) {
    window[name] = assets[name];
  }

  cube.element.attr({visibility: 'hidden'});

});

/**
 * @param {Animated} animated 
 */
function reset(animated) {
  animated.move(0, 0).rotate(0).scale(1);
}

tests = [

  /**
   * @param {Animated} animated
   */
  function testMoveAndRotate(animated) {
    animated.move(100, 100, 500).rotate(45, 500).move(100, 50, 500).rotate(23, 500).move(0, 0, 500);
  },

  /**
   * @param {Animated} animated
   */
  function testAnimateAndUnanimate(animated) {
    animated.move(100, 100).move(0, 0, 1000).move(100, 0);
  },

  /**
   * @param {Animated} animated
   */
  function testMergeAnimation(animated) {
    animated.rotate(90, 2000).after({propertyValueMap: {scalar: 2}, milliseconds: 1000}, 500);
  },

  /**
   * @param {Animated} animated
   */
  function testMergeAnimation2(animated) {
    animated.rotate(360, 1000*4);
    setTimeout(()=>{animated.mergeAnimation(new Transformation({propertyValueMap: {scalar: 2}, milliseconds: 1000}))}, 1000);
  },

  /**
   * @param {Animated} animated
   */
  function testSeparateXAndY(animated) {
    animated.moveX(300, 1000*4);
    setTimeout(()=>{animated.mergeAnimation(new Transformation({propertyValueMap: {y: 100}, milliseconds: 1000}))}, 2000);
  },

  /**
   * @param {Animated} animated
   */
  function testEasingMap(animated) {
    animated.moveX(300, 1000*4);
    setTimeout(()=>{animated.mergeAnimation(new Transformation({propertyValueMap: {y: 100}, milliseconds: 1000, easingMap: {y: mina.easeinout}}))}, 2000);
  },

  /**
   * @param {Animated} animated
   */
  function testAutoMerge(animated) {
    animated.moveX(300, 1000*2);
    setTimeout(()=>{animated.moveY(100, 500, {easingMap: {y: mina.easeinout}, waitForFinish: false})}, 1000);
  },
  
  /**
   * @param {Animated} animated
   */
  function testAutoMerge2(animated) {
    animated.moveX(300, 1000*4);
    animated.moveY(100, 1000*4, {waitForFinish: false});
    animated.rotate(360, 1000*4, {waitForFinish: false});
  },
  
  /**
   * @param {Animated} animated
   */
  function testMergeWithQueue(animated) {
    animated.moveX(300, 1000*1);
    animated.moveY(100, 1000*1);
    animated.rotate(360, 1000*2, {waitForFinish: false});
  },

  /**
   * @param {Animated} animated
   */
  function testMergePreservesCallbacks(animated) {
    animated.toggleSpin(360, 1000);
    animated.moveX(100, 1000, {waitForFinish: false});
    setTimeout(()=>{animated.toggleSpin(360, 1000);}, 1500);
  },

];

for (let test of tests) {
  window[test.name] = test;
}

function runTests(animated, tests) {
  var counter = 0;
  let runOneTest = ()=>{
    let test = tests[counter];
    reset(animated);
    animated.process();
    console.log(test.name);
    test(animated);
    animated.process();
    counter++;
  };

  runOneTest();
  setInterval(runOneTest, 1000 * 5);
  
}