#### components

* New

  * Menu
    * click on / touch the menu items to do things
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

  * eye
    * refactor into parent class with look methods, child class with eyelid
  * alphabet
    * fix letter morphing
  * flame
    * i think the flame moving a random distance every interval makes it look stop-and-go
      * maybe a constant distance would look nicer
  * clouds
    * i'm sure there's a prettier way to draw them
  * clock
    * fancier clock hands, numbers instead of blank marks?
    * ticking animation
  * stars
    * twinkling animation
  * moon
    * doesn't transform properly, center is not where it should be
  * a lot of classes should probably use a config object for appearance stuff
    * add optional glow for moon, star, and flame
    * the moon might need a darker shadow
  
* make delete button move the player towards the clicked tile
* moveNextTo is still weird when going straight up
* clicking entities doesn't trigger tile clicks

#### animation
* AnimationQueue and HexMoveQueue should probably use the same terminology for push, etc.
* shouldn't vivus work on stars and clouds? not sure why it isn't at the moment
* 3d transform methods (stretch, skew, etc.)
* skeletal animation (joints)
  * should be doable with groups inside groups for every successive joint
* make animation helper config parameter object a class (mostly so it's easy to document)

#### player
* fix gif and image export
* figure out why svg isn't stretching to fill width
  * maybe related to viewbox? seems to preserve aspect ratio
* does the scene need to be paused when the tab loses focus?

#### audio
* test howler + web audio recorder for audio exporting

#### maybe
* correct animations for time lost during processing?
  * when playing in real time, the effect of this is that animations play sliiightly faster than they otherwise would
  * not sure if there is any effect when rendering to gif or png
