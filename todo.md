* fix sendToQueue
  * always merge noWait transforms?
  * how do we find which to merge them with?
    * have AnimationQueue do that in the add method?
* merging two things quickly results in wrongly ordered animations
  * break mergeAnimation into two functions
  * one accepts two transformations and returns two merged transformations
  * the other accepts one transformation and a transformation queue and combines the given transformation with any overlapping transformations in the queue
* continuous animations need a new way to know when to stop
* fix animation merging erases callbacks
* correct animations for time lost during processing?