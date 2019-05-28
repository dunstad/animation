self.addEventListener('install', (e)=>{
  e.waitUntil(
    caches.open('sandbox').then((cache)=>{
      return Promise.all([
          '/animation/sandbox/index.html',
          '/animation/css/pwa.css',
          '/animation/lib/svg.min.js',
          '/animation/lib/vivus.min.js',
          '/animation/lib/flubber.min.js',
          '/animation/lib/gif.js',
          '/animation/lib/gif.worker.js',
          '/animation/lib/jszip.min.js',
          '/animation/lib/FileSaver.js',
          '/animation/lib/mousetrap.min.js',
          '/animation/lib/hammer.min.js',
          '/animation/js/core/Transformation.js',
          '/animation/js/core/AnimationQueue.js',
          '/animation/js/core/Animated.js',
          '/animation/js/core/MagicContainer.js',
          '/animation/js/core/External.js',
          '/animation/js/components/basic/Eye.js',
          '/animation/js/components/sandbox/Adventurer.js',
          '/animation/js/components/sandbox/Crystal.js',
          '/animation/js/components/sandbox/Drill.js',
          '/animation/js/components/sandbox/SandboxGame.js',
          '/animation/js/components/sandbox/SandboxGUI.js',
          '/animation/js/components/sandbox/SquareGrid.js',
          '/animation/js/components/sandbox/Tile.js',
          '/animation/js/components/sandbox/ToggleButton.js',
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