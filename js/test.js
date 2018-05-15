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
function reset(animated) {
  animated.move(0, 0).rotate(0).scale(1);
}

tests = [

  /**
   * @param {Animated} animated
   */
  function testMoveAndRotate(animated) {
    animated.move(100, 100, 1000).rotate(45, 1000).move(100, 50, 1000).rotate(23, 1000).move(0, 0, 1000);
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
    animated.rotate(90, 2000);
    setTimeout(()=>{animated.mergeAnimation(new Transformation({scalar: 2, animate: true, milliseconds: 1000}))}, 500);
  },

  /**
   * @param {Animated} animated
   */
  function testMergeAnimation2(animated) {
    animated.rotate(360, 1000*4);
    setTimeout(()=>{animated.mergeAnimation(new Transformation({scalar: 2, animate: true, milliseconds: 1000}))}, 1000);
  },

  /**
   * @param {Animated} animated
   */
  function testSeparateXAndY(animated) {
    animated.moveX(300, 1000*4);
    setTimeout(()=>{animated.mergeAnimation(new Transformation({location: {y: 100}, animate: true, milliseconds: 1000}))}, 2000);
  },

  /**
   * @param {Animated} animated
   */
  function testEasingMap(animated) {
    animated.moveX(300, 1000*4);
    setTimeout(()=>{animated.mergeAnimation(new Transformation({location: {y: 100}, animate: true, milliseconds: 1000, easing: [mina.linear, mina.easeinout, mina.linear, mina.linear]}))}, 2000);
  },

  /**
   * @param {Animated} animated
   */
  function testAutoMerge(animated) {
    animated.moveX(300, 1000*4);
    setTimeout(()=>{animated.moveY(100, 1000, mina.easeinout, false)}, 2000);
  },
  
  /**
   * @param {Animated} animated
   */
  function testAutoMerge2(animated) {
    animated.moveX(300, 1000*4);
    animated.moveY(100, 1000*4, undefined, false);
    animated.rotate(360, 1000*4, undefined, false);
  },
  
  /**
   * @param {Animated} animated
   */
  function testMergeWithQueue(animated) {
    animated.moveX(300, 1000*1);
    animated.moveY(100, 1000*1, undefined, true);
    animated.rotate(360, 1000*2, undefined, false);
  },

  /**
   * @param {Animated} animated
   */
  function testMergePreservesCallbacks(animated) {
    animated.toggleSpin(360, 1000);
    animated.moveX(100, 1000, undefined, false);
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
    console.log(test.name);
    test(animated);
    counter++;
  };

  runOneTest();
  setInterval(runOneTest, 1000 * 5);
  
}