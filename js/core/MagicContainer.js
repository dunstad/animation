SVG.MagicContainer = SVG.invent({

  // Define the type of element that should be created
  create: function() {
    
    let magicContainer = this.nested();
    magicContainer.attr({overflow: 'visible'});
    
    let group = this.group();
    magicContainer.add(group);
    
    for (let methodName of [
      'transform',
      'add',
      'clipper',
      'clipWith',
      'unclip',
      'masker',
      'maskWith',
      'unmask',
      'children',
    ]) {
      magicContainer[methodName] = magicContainer[methodName].bind(group);
    }
    
    return magicContainer;

  },

  // Specify from which existing class this shape inherits
  inherit: SVG.Svg,

  // Add custom methods to invented shape
  extend: {},

  // Add method to parent elements
  construct: {

    // Create a rounded element
    magicContainer: function() {
      return this.put(new SVG.MagicContainer);
    }

  },

});
