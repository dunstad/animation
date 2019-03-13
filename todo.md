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
```
possible merge
|--------------------------||--------------------------|
                                    |---------|

current behavior
|--------------------------||--------------------------|
                            |---------|

alternative 2
|--------------------------||--------------------------|
                                             |---------|
```
* add merging alignment options
  * ~~align to start, like alternative 1 above~~ current behavior
  * align to end, like alternative 2 above
  * accept a status number from 0 to 1, and merge the second animation into the first when its progress reaches that point

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
