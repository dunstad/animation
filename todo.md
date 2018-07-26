#### components
  * cloud
    * various colors
    * should be able to generate different shapes
    * look at how clouds can be made from lots of long thin ovals
  * airplane
    * mostly static, custom colors for body, wings, tail
    * spot for a logo
  * tree
    * i kind of like the idea of using pythagoras trees, might be too weird though
    * should have different shapes that can be generated
    * maybe have a numeric season property to determine leaf color
  * clock
    * just analog is fine for now
    * time property, setting it changes the hands

#### animation
* when using gradients, render to gif is glitchy
  * it seems like gif frames are being created before the image fully renders to canvas
  * need to find a way to wait for the canvas to render fully before making the frame
* gif frames are only being created when requestAnimationFrame is called
  * this means when scenes take a long time to draw, we're skipping over lots of frames
* add svg morphing with flubber
* skeletal animation (joints)
* make animation helper config parameter object a class (mostly so it's easy to document)

#### audio
* test howler + web audio recorder for audio exporting

#### maybe
* correct animations for time lost during processing?
