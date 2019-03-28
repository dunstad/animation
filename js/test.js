var container = document.getElementById('container');
var svgContainer = Snap("#" + container.id);
var player = new Player(svgContainer);

function makeScene(setupFunc) {

  let scene = new Scene(player);

  scene.prepareActors(setupFunc);
  
  return scene;

}

let sceneSelect = document.getElementById('sceneSelect');
for (let [sceneName, sceneFunc] of Object.entries(scenes)) {
  let sceneOption = document.createElement('option');
  sceneOption.value = sceneName;
  sceneOption.textContent = sceneName;
  sceneSelect.appendChild(sceneOption);
}

function onSceneSelect(e) {
  localStorage.setItem('currentScene', e.target.value);
  player.svgElement.clear();
  player.loadScene(makeScene(scenes[e.target.value]));
}

sceneSelect.addEventListener('change', onSceneSelect);

let currentSceneName;
// makes sharing specific scenes easier
if (document.location.hash) {
  currentSceneName = decodeURI(document.location.hash).substring(1);
}
else {
  currentSceneName = localStorage.getItem('currentScene') || sceneSelect.value;
}

sceneSelect.value = currentSceneName;

player.loadScene(makeScene(scenes[currentSceneName]));

/**
 * @param {Animated} animated 
 */
function reset(animated) {
  animated.animationQueue.queue = [];
  animated.move(0, 0).rotate(0).scale(1).draw(1);
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
    animated.rotate(90, 2000).scale(2, 1000, {merge: .25});
  },

  /**
   * @param {Animated} animated
   */
  function testSeparateXAndY(animated) {
    animated.moveX(300, 4000).moveY(100, 1000, {merge: .5});
  },
  
  /**
   * @param {Animated} animated
   */
  function testEasingMap(animated) {
    animated.moveX(300, 4000).moveY(100, 1000, {merge: .5, easingMap: {y: mina.easeinout}});
  },

  /**
   * @param {Animated} animated
   */
  function testAutoMerge(animated) {
    animated.moveX(300, 2000).moveY(100, 500, {easingMap: {y: mina.easeinout}, merge: .5})
  },
  
  /**
   * @param {Animated} animated
   */
  function testAutoMerge2(animated) {
    animated.moveX(300, 1000*4);
    animated.moveY(100, 1000*4, {merge: 'start'});
    animated.rotate(360, 1000*4, {merge: 'start'});
  },

  /**
   * @param {Animated} animated
   */
  function testEqualTimeSmallNumberMerge(animated) {
    animated.moveX(100, 2000);
    animated.scale(2, 1000, {merge: 'start'});
    animated.scale(.5, 1000, {merge: 'start'});
  },
  
  /**
   * @param {Animated} animated
   */
  function testMergeWithQueue(animated) {
    animated.moveX(300, 1000);
    animated.rotate(360, 2000, {merge: 'start'});
    animated.moveY(100, 1000, {merge: 'start'});
  },

  /**
   * @param {Animated} animated
   */
  function testMergePreservesCallbacks(animated) {
    animated.toggleSpin(360, 1000);
    animated.moveX(100, 1000, {merge: 'start'});
    animated.wait(500, {merge: .5, callback: ()=>{animated.toggleSpin();}});
  },

  /**
   * @param {Animated} animated
   */
  function testMergeWithoutMilliseconds(animated) {
    animated.moveX(100);
    animated.moveY(100, 1000, {merge: 'start'});
  },

  /**
   * @param {Animated} animated
   */
  function testMergeWithoutMilliseconds2(animated) {
    animated.moveX(100, 1000);
    animated.moveY(100, {merge: 'start'});
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

for (let test of animatedTests.concat(skyTests)) {
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