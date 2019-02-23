#### components
  * alphabet
    * fix letter morphing
  * flame
    * random timing for morph lengths to seem more natural?
  * fire
    * manage a group of flames easily
    * add smoke particles
  * tree
    * should have different shapes that can be generated
    * maybe have a numeric season property to determine leaf color
  * eye
    * bug with translation strings for looking and merging
      * just make it an Animated instead?
  * robot arm
    * not super general maybe as far as use in lots of scenes goes
    * will probably be super fun to make though
    * also lets us get skeletal animation features implemented
  * gears
    * generate a gear with any number of teeth
    * transmission class to match up their rotations?
    * customizable teeth?
  * a lot of classes should probably use a config object for appearance stuff
  * add optional glow for moon, star, and flame
  * i'm sure there's a prettier way to draw clouds
  * fancier clock hands, numbers instead of blank marks?
  * the moon might need a darker shadow
  * twinkle animation for stars
  * ticking animation for clock
  * make a sky with automatic sun, moon, stars, easily controllable clouds


#### animation
* fix merge code so i don't have to keep manually adding new property names
* 'after', or merging onto the back of the queue, requires reading the queue to figure out what values attributes are expected to have at the time of merging
  * otherwise the values end up being 0 and the animations appear to reset before progressing
* {waitForFinish: false} always sending to the start of the queue is inconvenient
  * make it merge onto the back of the queue instead
    * this would eliminate the need for 'after' as well
    * example that would be made possible: thing.move(0, 0).move(10, 10).spin(90, merge)
    * current version: thing.move(0, 0).move(10, 10).spin(90, merge, after: duration of first move)
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
