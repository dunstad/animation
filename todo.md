* merging two things quickly results in wrongly ordered animations
  * break mergeAnimation into two functions
  * one accepts two transformations and returns two merged transformations
  * the other accepts one transformation and a transformation queue and combines the given transformation with any overlapping transformations in the queue
* continuous animations need a new way to know when to stop
* fix animation merging erases callbacks