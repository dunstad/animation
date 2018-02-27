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
  animated.animate().move(100, 100).rotate(45);
}