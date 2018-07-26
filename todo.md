#### components
  * cloud
    * need to tweak the bottom curve still
    * make length animatable
  * tree
    * i kind of like the idea of using pythagoras trees, might be too weird though
    * should have different shapes that can be generated
    * maybe have a numeric season property to determine leaf color
  * analog clock
    * time property, setting it changes the hands
  * moon
    * different phases
    * random craters?
  * eye
    * has a pupil and iris
    * should be able to look in whatever direction
    * maybe a parent class for a set of eyes, since they'll generally all be looking at the same point at once
    * should be able to blink
      * maybe other settings for the eyelids too, perhaps eyebrows for expressions?
  * robot arm
    * not super general maybe as far as use in lots of scenes goes
    * will probably be super fun to make though
    * also lets us get skeletal animation features implemented

#### animation
* skeletal animation (joints)
  * should be doable with groups inside groups for every successive joint
* make animation helper config parameter object a class (mostly so it's easy to document)

#### audio
* test howler + web audio recorder for audio exporting

#### maybe
* correct animations for time lost during processing?
