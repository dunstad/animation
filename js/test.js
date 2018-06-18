var container = document.getElementById('container');
var svgContainer = Snap("#" + container.id);

var player = new Player(svgContainer);
var scene = new Scene(player);

// let cube = new External(svgContainer, '/img/cube-outline.svg');  
// cube.vivus.reset();

let mail = new External(svgContainer, '/img/basic_mail.svg');  

// let sky = new Sky(svgContainer);

// mail.moveX(100, 1000).moveY(100, 1000).wait(1000).moveX(0, 1000);

// sky.move(200, 200).moveX(300, 1000).moveY(300, 1000).wait(1000).moveX(200, 1000);

// scene.addActors([mail, sky]);

// player.loadScene(scene);
// player.play();
// player.recordGIF();
// player.recordPNG();

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
    animated.move(100, 100, 500, {
      callback: ()=>{
        if (!(animated.x == 100 && animated.y == 100)) {
          throw new Error('animation assertion failed');
        }
        else {console.log('animation assertion passed');}
      },
    }).rotate(45, 500).move(100, 50, 500).rotate(23, 500).move(0, 0, 500);
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