var scenes = {

  'draw cube': (scene)=>{
    
    let cube = new External(svgContainer, '/img/cube-outline.svg');
    cube.loadingPromise.then((loadedCube)=>{
      loadedCube.draw(0).move(0, 0).process();
      loadedCube.draw(1, 2000).move(100, 100, 1000);
      scene.addActor(loadedCube);
    });

  },

  'move mail': (scene)=>{
    
    let mail = new External(svgContainer, '/img/basic_mail.svg');
    mail.loadingPromise.then((loadedMail)=>{
      loadedMail.moveX(100, 1000).moveY(100, 1000).wait(1000).moveX(0, 1000);
      scene.addActor(loadedMail);
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

  'fire': (scene)=>{

    let sky = new Sky(svgContainer, 640, 360, 21);
    sky.move(-10, -10).process();

    let fire1 = new Flame(svgContainer, 'red');
    fire1.move(100, 100).process();

    let fire2 = new Flame(svgContainer, 'orange');
    fire2.move(100, 100).process();

    let fire3 = new Flame(svgContainer, 'yellow');
    fire3.move(100, 100).process();

    let fire4 = new Flame(svgContainer, ['yellow', 'white']);
    fire4.move(200, 100).process();

    let duration = 1000;

    for (let i = 0; i < 100; i++) {
      fire1.toStatus(1, duration, {callback: ()=>{fire1.newPath();}});
      fire2.toStatus(1, duration, {callback: ()=>{fire2.newPath();}});
      fire3.toStatus(1, duration, {callback: ()=>{fire3.newPath();}});
      fire4.toStatus(1, duration, {callback: ()=>{fire4.newPath();}});
    }

    scene.addActors([sky, fire1, fire2, fire3, fire4]);

  },

  '': (scene)=>{



  },

};