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

    let realEye = new Eye(svgContainer, {
      whiteRadius: 50,
      irisRadius: 20,
      pupilRadius: 10,
    });
    realEye.move(100, 100).openTop(1).openBottom(1).process();
    
    let wildEye = new Eye(svgContainer, {
      whiteRadius: 50,
      irisRadius: 0,
      pupilRadius: 10,
      shape: 'circular',
    });
    wildEye.move(250, 100).openTop(1).openBottom(1).process();

    let cuteEye = new Eye(svgContainer, {
      whiteRadius: 0,
      irisRadius: 0,
      pupilRadius: 40,
      shape: 'circular',
    });
    cuteEye.move(100, 200).openTop(1).openBottom(1).process();
    
    let animeEye = new Eye(svgContainer, {
      whiteRadius: 50,
      irisRadius: 40,
      pupilRadius: 20,
    });
    animeEye.move(250, 200).openTop(1).openBottom(1).process();

    let eyes = [realEye, wildEye, cuteEye, animeEye];

    for (let eye of eyes) {
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
    }

    scene.addActors(eyes);

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

    let game = new SandboxGame({svgContainer: svgContainer});

    let squareGrid = game.grid;
    squareGrid.y = 20;

    let pattern = svgContainer.pattern(40, 40, (add)=>{
      let style = {stroke: 'black', fill: '#006562'};
      let style2 = {stroke: 'black', fill: chroma(style.fill).darken(.15)};
      add.rect(40, 20).attr(style);
      add.rect(40, 20).x(-20).y(20).attr(style2);
      add.rect(40, 20).x(20).y(20).attr(style2);
    });

    let tileStyle = {
      fill: pattern,
      stroke: 'black',
      'stroke-width': 2,
    };

    for (let x of [0, 1, 2, 3, 4, 5, 6]) {
      for (let y of [0, 1, 2, 3]) {
        squareGrid.tile(x, y, new Tile(svgContainer, squareGrid, tileStyle));
      }
    }

    let adventurer = new Adventurer(svgContainer, squareGrid, {
      fill: '#FFD1A4',
      stroke: 'black',
      'stroke-width': 3,
    });
    game.player = adventurer;
    squareGrid.occupy(1, 1, adventurer);
    adventurer.inventory.Crystal = 18;
    
    let crystal;
    for (let coords of [[0, 0], [2, 2], [0, 3], [5, 3], [5, 1], [6, 0]]) {
      crystal = new Crystal(svgContainer, squareGrid, {
        fill: '#00FFF5',
        stroke: 'black',
        'stroke-width': 3,
      });
      squareGrid.occupy(coords[0], coords[1], crystal);
    }
    
    let drill = new Drill(svgContainer.defs(), squareGrid, {
      fill: 'gray',
      stroke: 'black',
      'stroke-width': 3,
    });
    // squareGrid.occupy(3, 2, drill);

    let GUI = game.GUI;

    let displayCrystal = crystal.element.clone().x(0).y(0);
    let crystalButton = new ToggleButton(svgContainer, displayCrystal, 'Crystal', {
      countGetter: ()=>{return adventurer.inventory.Crystal;}
    });
    crystalButton.x = 560;
    crystalButton.y = 20;
    GUI.addButton(crystalButton);
    
    let displayDrill = drill.element.clone().x(0).y(0);
    let drillButton = new ToggleButton(svgContainer, displayDrill, 'Drill', {
      countGetter: ()=>{return adventurer.inventory.Drill;}
    });
    drillButton.x = 560;
    drillButton.y = 100;
    GUI.addButton(drillButton);
    
    // let plus = svgContainer.path('M 20 0 20 40 M 0 20 40 20');
    // plus.attr({
    //   stroke: 'yellow',
    //   'stroke-width': 10,
    //   'stroke-linecap': 'round',
    // });
    let plus = svgContainer.text('Buy Drill');
    plus.attr({
      fill: 'white',
    });
    let plusButton = new ToggleButton(svgContainer, plus, 'plus', {countGetter: ()=>{return 20;}});
    plusButton.x = 560;
    plusButton.y = 180;
    GUI.addButton(plusButton);

    plusButton.element.node.addEventListener('click', (function() {
      console.log(this)
      if (this.player.inventory.Crystal >= 20) {
        this.player.inventory.Crystal -= 20;
        this.player.inventory.Drill += 1;
      }
      else {
        console.log('not enough crystals!');
      }
      this.GUI.unselect();
    }).bind(game));

    // let cross = svgContainer.path('M 0 0 40 40 M 40 0 0 40');
    // cross.attr({
    //   stroke: 'red',
    //   'stroke-width': 10,
    //   'stroke-linecap': 'round',
    // });
    let cross = svgContainer.text('Pick Up');
    cross.attr({
      fill: 'white',
    });
    let crossButton = new ToggleButton(svgContainer, cross, 'cross');
    crossButton.x = 560;
    crossButton.y = 260;
    GUI.addButton(crossButton);

    squareGrid.wait(0, {callback: ()=>{setInterval(()=>{
      squareGrid.tick();
      GUI.tick();
    }, 500)}});

    scene.addActors([squareGrid, crystal, drill, adventurer]);

  }

};