# MaskedInput
A Backbone.js input masking module.

A Backbone.View for applying Masks to inputs. This uses the
[inputmask-core engine](https://github.com/insin/inputmask-core), and is 
based heavily on the [react-maskedinput](https://github.com/insin/react-maskedinput)
implementation of that engine. I have basically modified react-maskedinput
to use jQuery events through Backbone rather than the react event system,
and a few other minor fixes and adjustments.

## API
```js
/**
 * Creates a new MaskedInput
 * @constructor
 * @param {Object} options
 * @param {HTMLInputElement} options.el - The input to attach the mask to
 * @param {string} options.pattern - The mask pattern to apply. '(111) 111-1111'.
 * See the documentation for inputmask-core for acceptable values.
 * @param {string} [options.placeholderChar='_'] - The character which is used to 
 * fill in editable slots for which there is no input yet when getting the 
 * mask's current value.
 */
 function MaskedInput(options) {}
```

## Usage
```js
var MaskedInput = require('./maskedInput'),
    phoneMask, socialMask, postalMask;

phoneMask = new MaskedInput({
    el: $('#phonenumber')[0],
    pattern: '(111) 111-1111',
});

socialMask = new MaskedInput({
    el: $('#governmentid')[0],
    pattern: '111-11-1111',
    value: '123-45-6789' //optional seed value
});
    
postalMask = new MaskedInput({
    el: $('#postalcode')[0],
    pattern: '11111',
    value: 29410
});

```

## Why not xyz masking plugin?
I have looked through many of the masking plugins available and found them
all to be lacking in several ways. 

1. They're mostly all jQuery plugins. I prefer using modules and a true 
object-oriented style of progamming in JavaScript.
2. Have you looked at the code? Many of the plugins available are very
large and they are very difficult to read through. I needed a plugin with 
a smaller footprint and cleaner code.

## TODO
* Add unit tests - although unit testing this type of functionality is
very difficult.
* Publish to npm, add package.json.
* Add gulp build tasks (jshint, jscs)
