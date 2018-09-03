var scenes = {

  'draw cube': (scene)=>{
    
    let cube = new External(svgContainer, '/img/cube-outline.svg');
    scene.addActor(cube);
    cube.loadingPromise.then((loadedCube)=>{
      loadedCube.draw(0).move(0, 0).process();
      loadedCube.draw(1, 2000).move(100, 100, 1000);
    });

  },

  'move mail': (scene)=>{
    
    let mail = new External(svgContainer, '/img/basic_mail.svg');
    scene.addActor(mail);
    mail.loadingPromise.then((loadedMail)=>{
      loadedMail.moveX(100, 1000).moveY(100, 1000).wait(1000).moveX(0, 1000);
    });

  },

  'animate sky': (scene)=>{

    let sky = new Sky(svgContainer, 640, 360, 0);
    sky.move(-10, -10).process();
    sky.toHour(24, 10 * 1000);
    scene.addActor(sky);

  },

  'moon phases': (scene)=>{

    let sky = new Sky(svgContainer, 640, 360, 21);
    sky.move(-10, -10).process();

    let moon = new Moon(svgContainer, 50);
    moon.move(100, 100).process();
    moon.toPhase(1, 20000);

    scene.addActors([sky, moon]);

  },

  'star morphing': (scene)=>{

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
    
  },
  
  'cloud morphing': (scene)=>{
    
    let sky = new Sky(svgContainer, 640, 360, 21);
    sky.move(-10, -10).process();
    
    let cloud = new Cloud(svgContainer, 3, 100, 'white');
    cloud.move(200, 200).process();

    let maxArcs = 8;
    let transitionTime = 10000;

    for (let numArcs = 4; numArcs < maxArcs; numArcs++) {
      cloud.toBumps(numArcs, transitionTime);
    }

    for (let numArcs = maxArcs; numArcs > 2; numArcs--) {
      cloud.toBumps(numArcs, transitionTime);
    }
    
    scene.addActors([sky, cloud]);

  },

  'clock': (scene)=>{

    let clock = new Clock(svgContainer, 50);
    clock.move(100, 100).process();

    clock.toTime(1, 1000 * 60);

    scene.addActor(clock);

  },

  'flame': (scene)=>{

    let sky = new Sky(svgContainer, 640, 360, 21);
    sky.move(-10, -10).process();

    let flame1 = new Flame(svgContainer, 'red');
    flame1.move(100, 100).process();

    let flame2 = new Flame(svgContainer, 'orange');
    flame2.move(100, 100).process();

    let flame3 = new Flame(svgContainer, 'yellow');
    flame3.move(100, 100).process();

    let flame4 = new Flame(svgContainer, ['yellow', 'white']);
    flame4.move(200, 100).process();

    let duration = 1000;

    for (let i = 0; i < 100; i++) {
      flame1.toStatus(1, duration, {callback: ()=>{flame1.newPath();}});
      flame2.toStatus(1, duration, {callback: ()=>{flame2.newPath();}});
      flame3.toStatus(1, duration, {callback: ()=>{flame3.newPath();}});
      flame4.toStatus(1, duration, {callback: ()=>{flame4.newPath();}});
    }

    scene.addActors([sky, flame1, flame2, flame3, flame4]);

  },

  'letter morph': (scene)=>{

    let letterA = new Alphabet(svgContainer, 'A');

    letterA.move(100, 100).process();

    letterA.newPath('B');
    letterA.toStatus(1, 2000, {easingMap: {status: mina.easeinout}, callback: ()=>{letterA.newPath('E');}});
    
    letterA.toStatus(1, 2000, {easingMap: {status: mina.easein}});
    letterA.toStatus(1, 2000, {easingMap: {status: mina.easeout}});
    letterA.scale(.5, 2000, {waitForFinish: false, after: 2000, easingMap: {scalar: mina.easein}});
    letterA.scale(1, 2000, {waitForFinish: false, after: 4000, easingMap: {scalar: mina.easeout}});

    scene.addActor(letterA);

  },

};