class Adventurer extends Animated {

  constructor(svgContainer, grid, options) {

    super(svgContainer.magicContainer());

    let headGroup = svgContainer.group();
    this.element.add(headGroup);

    let head = svgContainer.circle(40, 40);
    head.attr(options);
    headGroup.add(head);

    let eyeOptions = {
      whiteRadius: 0,
      irisRadius: 0,
      pupilRadius: 40,
      shape: 'circular',
    };
    let face = new Face(svgContainer, {eyeOptions: eyeOptions});
    face.leftEye.bottomEyelidOpen = 1;
    face.rightEye.bottomEyelidOpen = 1;
    window.face = face;
    face.x = -30;
    face.y = 20;
    face.scalar = .13;
    headGroup.add(face.element);

    let keys = {
      w: 'controlUp',
      a: 'controlLeft',
      s: 'controlDown',
      d: 'controlRight',
    };

    for (let [key, eventName] of Object.entries(keys)) {
      Mousetrap.bind(key, ()=>{
        let controlEvent = new CustomEvent(eventName);
        this.element.node.dispatchEvent(controlEvent);
      });
    }

    let hammer = new Hammer(svgContainer.node);
    hammer.get('swipe').set({ direction: Hammer.DIRECTION_ALL });

    hammer.on('swipeup', (event)=>{
      this.element.node.dispatchEvent(new CustomEvent('controlUp'));
    });
    
    hammer.on('swipedown', (event)=>{
      this.element.node.dispatchEvent(new CustomEvent('controlDown'));
    });
    
    hammer.on('swipeleft', (event)=>{
      this.element.node.dispatchEvent(new CustomEvent('controlLeft'));
    });
    
    hammer.on('swiperight', (event)=>{
      this.element.node.dispatchEvent(new CustomEvent('controlRight'));
    });

    this.element.node.addEventListener('controlUp', ()=>{
      this.destination = {x: this.tile.gridX, y: this.tile.gridY - 1};
    });
    this.element.node.addEventListener('controlDown', ()=>{
      this.destination = {x: this.tile.gridX, y: this.tile.gridY + 1};
    });
    this.element.node.addEventListener('controlLeft', ()=>{
      this.destination = {x: this.tile.gridX - 1, y: this.tile.gridY};
    });
    this.element.node.addEventListener('controlRight', ()=>{
      this.destination = {x: this.tile.gridX + 1, y: this.tile.gridY};
    });

  } 

}