self.addEventListener('install', (e)=>{
  e.waitUntil(
    caches.open('file-store').then((cache)=>{
      return Promise.all([
          '/animation/hexgrid.html',
          '/animation/css/hexgrid.css',
          '/animation/lib/svg.min.js',
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
        ].map((url)=>{cache.add(url);})
      );
    }).catch(console.error)
  );
 });
 
 self.addEventListener('fetch', (e)=>{
   console.log(e.request.url);
   e.respondWith(
     caches.match(e.request).then((response)=>{
       return response || fetch(e.request);
     }).catch(console.error)
   );
 });