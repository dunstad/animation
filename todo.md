* fix animation merging erases easing and callbacks
    * write custom update function to deal with different easing for different parameters
    * update mergeAnimation to combine easings from different animations
* come up with a decent way to specify when to merge an animation in versus when to queue it up