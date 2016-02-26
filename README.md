# MaskedInput
A Backbone.js input masking module.

A Backbone.View for applying Masks to inputs. This uses the
[inputmask-core engine](https://github.com/insin/inputmask-core), and is 
based heavily on the [react-maskedinput](https://github.com/insin/react-maskedinput)
implementation of that engine. I have basically modified react-maskedinput
to use jQuery events through Backbone rather than the react event system,
and a few other minor fixes and adjustments.

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
