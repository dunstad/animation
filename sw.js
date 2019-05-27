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
          '/animation/js/core/Transformation.js',
          '/animation/js/core/AnimationQueue.js',
          '/animation/js/core/Animated.js',
          '/animation/js/core/MagicContainer.js',
          '/animation/js/core/External.js',
          '/animation/js/components/hexical/HexGrid.js',
          '/animation/js/components/hexical/HexMover.js',
          '/animation/js/components/hexical/MusicalHexMover.js',
          '/animation/js/components/hexical/ControlledHexMover.js',
          '/animation/js/components/hexical/Metronome.js',
          '/animation/js/components/hexical/HexMoveQueue.js',
          '/animation/js/core/Player.js',
          '/animation/js/core/Scene.js',
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