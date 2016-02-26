/**
 * A Backbone.View for applying Masks to inputs. This uses the
 * inputmask-core engine, and is based heavily on the react-maskedinput
 * implementation of that engine (https://github.com/insin/react-maskedinput)
 * 
 * @module views/inputMask
 */
'use strict';

var InputMask = require('inputmask-core'),  
    Backbone = require('backbone'),  
    keyCode = {
        "Backspace": 8,
        "Tab": 9,
        "Clear": 12,
        "Enter": 13,
        "Shift": 16,
        "Control": 17,
        "Alt": 18,
        "Pause": 19,
        "CapsLock": 20,
        "Escape": 27,
        " ": 32,
        "PageUp": 33,
        "PageDown": 34,
        "End": 35,
        "Home": 36,
        "ArrowLeft": 37,
        "ArrowUp": 38,
        "ArrowRight": 39,
        "ArrowDown": 40,
        "Insert": 45,
        "Delete": 46,
        "Z": 90,
        "Y": 89,
        "Meta": 224
    };

module.exports = Backbone.View.extend({
    /**
     * @param {Object} options
     * @param {HTMLInputElement} options.el - The input to attach the mask to
     * @param {string} options.pattern - The mask pattern to apply. '(111) 111-1111'.
     * See the documentation for inputmask-core for acceptable values.
     * @param {string} [options.placeholderChar='_'] - The character which is used to 
     * fill in editable slots for which there is no input yet when getting the 
     * mask's current value.
     */
    initialize: function (options) {      
        var maskValue;  
        this.mask = new InputMask({ 
            pattern: options.pattern,
            value: this.el.value,
            placeholderChar: options.placeholderChar || '_'
        });        
        
        maskValue = this.mask.getValue();
        this.el.value = maskValue !== this.mask.emptyValue ? maskValue : '';         
    },
    
    events: {
        'change': 'onChange',
        'keydown': 'onKeyDown',
        'keypress': 'onKeyPress',
        'paste': 'onPaste'        
    },
    
    onChange: function (e) {
        var maskValue = this.mask.getValue(),
            sizeDiff, value;
            
        if (e.target.value !== maskValue) {
            // Cut or delete operations will have shortened the value
            if (e.target.value.length < maskValue.length) {
                sizeDiff = maskValue.length - e.target.value.length;
                this.updateMaskSelection();
                this.mask.selection.end = this.mask.selection.start + sizeDiff;
                this.mask.backspace();
            }
            value = this.getDisplayValue();
            e.target.value = value;
            if (value) {
                this.updateInputSelection();
            }
        }
    },
    
    onKeyDown: function (e) {
        if (isUndo(e)) {
            this.handleUndo(e);
            return;
        } else if (isRedo(e)) {
            this.handleRedo(e);
            return;
        }
        if (e.which === keyCode.Backspace) {
            this.handleBackspace(e);
        }        
    },
    
    handleUndo: function (e) {
        e.preventDefault();
        if (this.mask.undo()) {
            e.target.value = this.getDisplayValue();
            this.updateInputSelection();                
        }
    },
    
    handleRedo: function (e) {
        e.preventDefault();
        if (this.mask.redo()) {
            e.target.value = this.getDisplayValue();
            this.updateInputSelection();                
        }
    },
    
    handleBackspace: function (e) {
        var value;
        e.preventDefault();
        this.updateMaskSelection();
        if (this.mask.backspace()) {
            value = this.getDisplayValue();
            e.target.value = value;
            if (value) {
                this.updateInputSelection();
            }
        }
    },
    
    onKeyPress: function (e) {    
        var character;
        // Ignore modified key presses
        // Ignore enter key to allow form submission
        if (e.metaKey || e.altKey || e.ctrlKey || e.which === keyCode.Enter) { 
            return; 
        }

        e.preventDefault();
        character = String.fromCharCode(e.which);
        this.updateMaskSelection();
        if (this.mask.input(character)) {
            e.target.value = this.mask.getValue();
            this.updateInputSelection();            
        }    
    },
    
    onPaste: function (e) {
        e.preventDefault();
        this.updateMaskSelection();        
        if (this.mask.paste(getPasteData(e))) {
            e.target.value = this.mask.getValue();
            
            // TODO: Is this true?
            // Timeout needed for IE
            setTimeout(this.updateInputSelection.bind(this), 0);            
        }    
    },
    
    updateMaskSelection: function () {
        this.mask.selection = getSelection(this.el);   
    },  
    
    getDisplayValue: function () {
        var value = this.mask.getValue();
        return value === this.mask.emptyValue ? '' : value;
    },
    
    updateInputSelection: function () {
        setSelection(this.el, this.mask.selection);
    }
});

function isUndo(e) {
    return (e.ctrlKey || e.metaKey) && e.keyCode === (e.shiftKey ? keyCode.Y : keyCode.Z);
}

function isRedo(e) {
    return (e.ctrlKey || e.metaKey) && e.keyCode === (e.shiftKey ? keyCode.Z : keyCode.Y);
}

function getPasteData(e) {
    var content;
    if (e.originalEvent.clipboardData) {
        content = e.originalEvent.clipboardData.getData('text/plain');
    } else if (window.clipboardData) {
        content = window.clipboardData.getData('Text');
    }
    return content;
}

/**
 * Gets the selection bounds of a focused input. If we need to improve browser support
 * then we can use the implementation here: http://stackoverflow.com/a/4207763/1717490,
 * or here: https://github.com/facebook/react/blob/master/src/renderers/dom/client/ReactInputSelection.js 
 */
function getSelection(input) {
    var selection;

    if ('selectionStart' in input) {
        // Modern browser with input or textarea.
        selection = {
            start: input.selectionStart,
            end: input.selectionEnd
        };
    }
    
    return selection;
}

/**
 * If we need to improve browser support, look at the links for getSelection
 */
function setSelection(input, offsets) {
    var start = offsets.start,
        end = offsets.end;
    
    if (end === undefined) {
        end = start;
    }

    if ('selectionStart' in input) {
        input.selectionStart = start;
        input.selectionEnd = Math.min(end, input.value.length);
    }
}
