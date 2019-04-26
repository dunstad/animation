self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open('file-store').then(function(cache) {
      return cache.addAll([
        '/animation/hexgrid.html',
        '/animation/css/hexgrid.css',
        '/animation/lib/snap.svg.js',
        '/animation/lib/vivus.min.js',
        '/animation/lib/flubber.min.js',
        '/animation/lib/gif.js',
        '/animation/lib/gif.worker.js',
        '/animation/lib/jszip.min.js',
        '/animation/lib/FileSaver.js',
        '/animation/lib/honeycomb.min.js',
        '/animation/lib/Tone.js',
        '/animation/lib/mousetrap.min.js',
        '/animation/lib/hammer.min.js',
        '/animation/js/Transformation.js',
        '/animation/js/AnimationQueue.js',
        '/animation/js/Animated.js',
        '/animation/js/External.js',
        '/animation/js/HexGrid.js',
        '/animation/js/HexMover.js',
        '/animation/js/MusicalHexMover.js',
        '/animation/js/ControlledHexMover.js',
        '/animation/js/Metronome.js',
        '/animation/js/HexMoveQueue.js',
        '/animation/js/Player.js',
        '/animation/js/Scene.js',
        '/animation/js/scenes.js',
      ]);
    }).catch(console.error)
  );
 });
 
 self.addEventListener('fetch', function(e) {
   console.log(e.request.url);
   e.respondWith(
     caches.match(e.request).then(function(response) {
       return response || fetch(e.request);
     })
   );
 });