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
    sky.toHour(24, 10 * 1000);
    scene.addActor(sky);

  },

  'moon phases': (scene)=>{

    let sky = new Sky(svgContainer, 640, 360, 21);

    let moon = new Moon(svgContainer, 50);
    moon.move(100, 100).process();
    moon.toPhase(1, 20000);

    scene.addActors([sky, moon]);

  },

  'star morphing': (scene)=>{

    let sky = new Sky(svgContainer, 640, 360, 21);

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

  'stress test': (scene)=>{

    for (let x of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(n=>n*50)) {
      for (let y of [1, 2, 3, 4, 5, 6].map(n=>n*50)) {

        let clock = new Clock(svgContainer, 10);
        clock.move(x, y).process();
    
        clock.toTime(1, 1000 * 60);
    
        scene.addActor(clock);

      }
    }


  },

  'flame': (scene)=>{

    let sky = new Sky(svgContainer, 640, 360, 21);

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

    let robotoA = new Alphabet(svgContainer, 'Roboto', 'A', 'white', 'black');

    transitionTime = 4000;

    robotoA.move(100, 100).process();

    robotoA.newPath('Roboto', 'B');
    robotoA.toStatus(1, transitionTime, {easingMap: {status: SVG.easing['-']}, callback: ()=>{robotoA.newPath('Roboto', 'E');}});
    
    robotoA.toStatus(1, transitionTime, {easingMap: {status: SVG.easing['-']}});
    
    let stencilA = new Alphabet(svgContainer, 'Allerta Stencil', 'A', 'white', 'black');

    stencilA.move(100, 200).process();

    stencilA.newPath('Allerta Stencil', 'B');
    stencilA.toStatus(1, transitionTime, {easingMap: {status: SVG.easing['-']}, callback: ()=>{stencilA.newPath('Allerta Stencil', 'E');}});
    
    stencilA.toStatus(1, transitionTime, {easingMap: {status: SVG.easing['-']}});

    scene.addActors([robotoA, stencilA]);

  },

  'star and cloud vivus': (scene)=>{

    let star = new Star(svgContainer, 4, 40, 'white', 'black');
    star.move(320, 100).process();

    let cloud = new Cloud(svgContainer, 3, 100, 'white', 'black');
    cloud.move(200, 200).process();

    star.draw(0);
    cloud.draw(0);

    scene.addActors([star, cloud]);
    
  },

  'eye': (scene)=>{

    svgContainer.rect(640, 360).x(0).y(0).attr({fill: 'gray'});

    let eye = new Eye(svgContainer, 50, 20, 10);
    eye.move(100, 100).openTop(1).openBottom(1).process();
    
    eye.wait(250);
    eye.openTop(.5, 500);
    eye.openBottom(.5, 500, {merge: 'start'});
    eye.look(0, 50, 250, {merge: .5});
    eye.look(0, -50, 1000);
    eye.look(90, 50, 500);
    eye.look(180, 50, 400);
    eye.look(270, 50, 300);
    eye.look(360, 50, 200);
    eye.look(360, 0, 100);
    eye.openTop(1, 100, {merge: 'start'});
    eye.openBottom(1, 100, {merge: 'start'});

    scene.addActor(eye);

  },

  'hexgrid': (scene)=>{

    svgContainer.rect(640, 360).x(0).y(0).attr({fill: 'white'});

    let hexgrid = new HexGrid(svgContainer, 5, 5);

    hexgrid.move(200, 100).process();

    let controlledHexMover = new ControlledHexMover(svgContainer, hexgrid.axialGet(2, 1));
    
    let musicMover = new MusicalHexMover(svgContainer, hexgrid.axialGet(2, 0), 'blue');

    function circleMove(hexMover) {

      let duration = 250;
      let easing = SVG.easing['>'];
      let easingMap = {easingMap: {x: easing, y: easing}};
  
      hexMover.moveDownLeft(duration, easingMap);
      hexMover.moveDown(duration, easingMap);
      hexMover.moveDownRight(duration, easingMap);
      hexMover.moveUpRight(duration, easingMap);
      hexMover.moveUp(duration, easingMap);
      hexMover.moveUpLeft(duration, {callback: ()=>{circleMove(hexMover);}, ...easingMap});

    }

    circleMove(musicMover);

    let hexMoveQueue = new HexMoveQueue(svgContainer);
    Object.assign(hexMoveQueue, {x: 20, y: 20});

    let controlToMove = {
      controlUpLeft: 'moveUpLeft',
      controlUp: 'moveUp',
      controlUpRight: 'moveUpRight',
      controlDownLeft: 'moveDownLeft',
      controlDown: 'moveDown',
      controlDownRight: 'moveDownRight',
    };
    for (let [controlName, moveName] of Object.entries(controlToMove)) {
      controlledHexMover.on(controlName, ()=>{
        hexMoveQueue.push(moveName, 100);
      });
    }

    let metronome = new Metronome(svgContainer, 120);
    metronome.x = 20;
    metronome.y = 20;
    
    // metronome.beatsPerMinute = 60;
    // for (let i = 0; i < 20; i++) {
    //   let newBPM = metronome.beatsPerMinute + (10 * (i + 1));
    //   metronome.beat(1.5, {callback: ()=>{metronome.beatsPerMinute = newBPM;}});
    // }
    
    metronome.onBeat((time)=>{

      metronome.scalar = 1; // this should fix it eventually getting stuck at 1.5
      metronome.beat(1.5);
      
      const lagFix = .8;
      let nextMove = hexMoveQueue.shift(metronome.millisecondsPerBeat * lagFix).direction;
      
      if (nextMove) {

        let easing = SVG.easing['>'];
        let easingMap = {easingMap: {x: easing, y: easing}};
        controlledHexMover[nextMove](250, easingMap);
        if (!Object.keys(controlledHexMover.anims).length) {
          controlledHexMover.process();
        }

      }

      musicMover.processOnce();

    });
    metronome.beat(1.5);

    let playButton = new Animated(hexMoveQueue.indicator.clone().cx(300).cy(160));
    svgContainer.add(playButton.element);
    playButton.rotation = 90;
    playButton.scalar = 10;
    playButton.element.first().attr({fill: 'lime'});
    playButton.element.node.addEventListener('click', ()=>{
      playButton.element.remove();
      // this can be replaced by having the play button emit a play event
      // the player can listen for play and pause to give the scene control over playback
      window.player.play(); // todo: remove this GLOBAL
    });

    scene.addActors([hexgrid, controlledHexMover, metronome, hexMoveQueue]);

  },

  'sandbox': (scene)=>{

    svgContainer.rect(640, 360).x(0).y(0).attr({fill: 'white'});

    let squareGrid = new SquareGrid(svgContainer, 80);
    squareGrid.y = 20;

    let pattern = svgContainer.pattern(40, 40, (add)=>{
      let style = {stroke: 'black', fill: '#113837'};
      let style2 = {stroke: 'black', fill: chroma('#113837').darken(.15)};
      add.rect(40, 20).attr(style);
      add.rect(40, 20).x(-20).y(20).attr(style2);
      add.rect(40, 20).x(20).y(20).attr(style2);
    });

    let tileStyle = {
      fill: pattern,
      stroke: 'black',
      'stroke-width': 2,
    };

    for (let x of [0, 1, 2, 3, 4, 5, 6, 7]) {
      for (let y of [0, 1, 2, 3]) {
        squareGrid.tile(x, y, new Tile(svgContainer, squareGrid, tileStyle));
      }
    }

    let adventurer = new Adventurer(svgContainer, squareGrid, {fill: '#FF7D16'});
    squareGrid.occupy(1, 1, adventurer);
    
    let crystal = new Crystal(svgContainer, squareGrid, {fill: '#14ECE3'});
    squareGrid.occupy(2, 2, crystal);
    
    let drill = new Drill(svgContainer, squareGrid, {fill: 'gray'});
    squareGrid.occupy(3, 2, drill);

    let GUI = new SandboxGUI();
    let displayCrystal = crystal.element.clone().x(0).y(0).scale(.65);
    let crystalButton = new ToggleButton(svgContainer, displayCrystal, ()=>{return adventurer.crystals});
    crystalButton.x = 600;
    crystalButton.y = 20;
    GUI.addButton(crystalButton);

    squareGrid.wait(0, {callback: ()=>{setInterval(()=>{
      squareGrid.tick();
      GUI.tick();
    }, 500)}});

    scene.addActors([squareGrid, crystal, drill, adventurer]);

  }

};