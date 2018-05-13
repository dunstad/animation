* merge needs to reference attributes of the Animated the transformation is for
* fix sendToQueue
  * always merge noWait transforms?
  * how do we find which to merge them with?
    * have AnimationQueue do that in the add method?
* merging two things quickly results in wrongly ordered animations
  * make merge check all noWait transforms for overlap
* continuous animations need a new way to know when to stop
* fix animation merging erases callbacks
* correct animations for time lost during processing?