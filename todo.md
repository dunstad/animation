#### components

* New

  * HexTile
    * piece of a hexgrid
  * tree
    * should have different shapes that can be generated
    * maybe have a numeric season property to determine leaf color
  * robot arm
    * not super general maybe as far as use in lots of scenes goes
    * will probably be super fun to make though
    * also lets us get skeletal animation features implemented
  * gears
    * generate a gear with any number of teeth
    * transmission class to match up their rotations?
    * customizable teeth?
  * fire
    * manage a group of flames easily
    * add smoke particles
  * make a sky with automatic sun, moon, stars, easily controllable clouds
  
* Improvements

  * HexMover
    * animation for failing to move
    * don't move into cells with other hexmovers
  * hexgrid
    * configurable shapes
    * ability to create a grid from HexTiles
  * ControlledHexMover
    * use Tone.js to produce notes on movement
  * alphabet
    * fix letter morphing
  * flame
    * random timing for morph lengths to seem more natural?
  * clouds
    * i'm sure there's a prettier way to draw them
  * clock
    * fancier clock hands, numbers instead of blank marks?
    * ticking animation
  * stars
    * twinkling animation
  * a lot of classes should probably use a config object for appearance stuff
    * add optional glow for moon, star, and flame
    * the moon might need a darker shadow
  


#### animation
* shouldn't vivus work on stars and clouds? not sure why it isn't at the moment
* 3d transform methods (stretch, skew, etc.)
* skeletal animation (joints)
  * should be doable with groups inside groups for every successive joint
* make animation helper config parameter object a class (mostly so it's easy to document)

#### audio
* test howler + web audio recorder for audio exporting

#### maybe
* correct animations for time lost during processing?
  * when playing in real time, the effect of this is that animations play sliiightly faster than they otherwise would
  * not sure if there is any effect when rendering to gif or png
