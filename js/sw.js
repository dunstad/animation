self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open('file-store').then(function(cache) {
      return cache.addAll([
        '/hexgrid.html',
        '/css/hexgrid.css',
        '/lib/snap.svg.js',
        '/lib/vivus.min.js',
        '/lib/flubber.min.js',
        '/lib/gif.js',
        '/lib/gif.worker.js',
        '/lib/jszip.min.js',
        '/lib/FileSaver.js',
        '/lib/honeycomb.min.js',
        '/lib/Tone.js',
        '/lib/mousetrap.min.js',
        '/lib/hammer.min.js',
        '/js/Transformation.js',
        '/js/AnimationQueue.js',
        '/js/Animated.js',
        '/js/External.js',
        '/js/HexGrid.js',
        '/js/HexMover.js',
        '/js/MusicalHexMover.js',
        '/js/ControlledHexMover.js',
        '/js/Metronome.js',
        '/js/HexMoveQueue.js',
        '/js/Player.js',
        '/js/Scene.js',
        '/js/scenes.js',
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