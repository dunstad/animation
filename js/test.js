var container = document.getElementById('container');
var svgContainer = Snap("#" + container.id);

var player = new Player(svgContainer);
var scene = new Scene(player);

// let cube = new External(svgContainer, '/img/cube-outline.svg');  
// cube.draw(0);

// let mail = new External(svgContainer, '/img/basic_mail.svg');  

// let sky = new Sky(svgContainer);

// mail.moveX(100, 1000).moveY(100, 1000).wait(1000).moveX(0, 1000);

// sky.move(200, 200).moveX(300, 1000).moveY(300, 1000).wait(1000).moveX(200, 1000);

// scene.addActors([mail, sky]);

let sky = new Sky(svgContainer, 640, 360, 21);
sky.move(-10, -10).process();

let star = new Star(svgContainer, 2, 40, '#ffffc0');
star.move(320, 100).process();

let maxPoints = 7;
let transitionTime = 500;

for (let numPoints = 3; numPoints < maxPoints; numPoints++) {
  star.toPoints(numPoints, transitionTime);
}

for (let numPoints = maxPoints; numPoints > 1; numPoints--) {
  star.toPoints(numPoints, transitionTime);
}

scene.addActors([sky, star]);

player.loadScene(scene);
player.play();
// player.recordGIF();
// player.recordPNG();

/**
 * @param {Animated} animated 
 */
function reset(animated) {
  animated.move(0, 0).rotate(0).scale(1).draw(1);
  animated.animationQueue.queue = [];
}

animatedTests = [

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
    animated.rotate(90, 2000).scale(2, 1000, {after: 500, waitForFinish: false});
  },

  /**
   * @param {Animated} animated
   */
  function testSeparateXAndY(animated) {
    animated.moveX(300, 1000*4).moveY(100, 1000, {after: 2000, waitForFinish: false});
  },
  
  /**
   * @param {Animated} animated
   */
  function testEasingMap(animated) {
    animated.moveX(300, 1000*4).moveY(100, 1000, {after: 2000, waitForFinish: false, easingMap: {y: mina.easeinout}});
  },

  /**
   * @param {Animated} animated
   */
  function testAutoMerge(animated) {
    animated.moveX(300, 1000*2).moveY(100, 500, {easingMap: {y: mina.easeinout}, waitForFinish: false, after: 1000})
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
    animated.addTransformation({propertyValueMap: {}, after: 1500, waitForFinish: false, callback: ()=>{animated.toggleSpin();}});
  },

  /**
   * @param {Animated} animated
   */
  function testMergeWithoutMilliseconds(animated) {
    animated.moveX(100);
    animated.moveY(100, 1000, {waitForFinish: false});
  },

  /**
   * @param {Animated} animated
   */
  function testMergeWithoutMilliseconds2(animated) {
    animated.moveX(100, 1000);
    animated.moveY(100, {waitForFinish: false});
  },

  /**
   * @param {Animated} animated
   */
  function testAfterWithoutMerge(animated) {
    animated.moveX(100, 1000);
    animated.moveY(100, 1000, {after: 500});
  },

  /**
   * @param {Animated} animated
   */
  function testVivus(animated) {
    animated.draw(0);
    animated.draw(1, 2000);
  },

];

let skyTests = [
  /**
   * @param {Sky} sky
   */
  function testTimeIncrement(sky) {
    sky.toHour(12, 4000);
  },

  /**
   * @param {Sky} sky
   */
  function testMidnightLoop(sky) {
    sky.toHour(20);
    sky.toHour(28, 4000);
  }
];

for (let test of animatedTests + skyTests) {
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