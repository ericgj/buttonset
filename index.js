

/**
 * Module dependencies.
 */

var Emitter = require('emitter')
  , View    = require('view')
  , classes = require('classes')
  , domify  = require('domify');

var buttonEl = domify('<a href="#"></a>')[0];

/**
 * Expose `ButtonSet`.
 */

module.exports = ButtonSet;

/**
 * Initialize a new `ButtonSet`.
 *
 * @param {Element|String} el reference (container) element
 * @param {Object} opts options
 *
 *  - buttons {Array} initial buttons
 *  - unselectable {Boolean} allows unset the current selected option (default false)
 *  - multiple {Boolean} allows multiple selections (default false)
 *  - select {Number} allows select initial option
 *
 * @api public
 */

function ButtonSet(el, opts) {
  if (!(this instanceof ButtonSet)) return new ButtonSet(el, opts);
  Emitter(this);

  if ('string' == typeof el) el = document.querySelector(el);

  View.call(this, {}, el);   // note model not used yet

  classes(this.el).add('buttonset');
  this.options = opts || {};

  // add buttons
  if (this.options.buttons) {
    for (var i = 0; i < this.options.buttons.length; i++) {
      this.add(this.options.buttons[i]);
    }
  }

  // force unselectable if buttonset is multiple
  if (this.options.multiple) this.options.unselectable = true;

  if ('undefined' != typeof this.options.select) this.set(this.options.select);

  // bind click event to onSet
  this.bind('click ' + buttonEl.nodeName, 'onSet');

  return this;
}

/**
 * Inherits from `View.prototype`.
 */

ButtonSet.prototype.__proto__ = View.prototype;

/**
 * Add a new button option
 *
 * @param {String} button button/buttons to add
 * @api public
 */

ButtonSet.prototype.add = function(){
  for (var i = 0; i < arguments.length; ++i) {
    var b = buttonEl.cloneNode(true);
    b.innerHTML = arguments[i];
    this.el.appendChild(b);
  }
  return this;
};

/**
 * onSet event
 *
 * @param {Object} e event object
 * @api private
 */

ButtonSet.prototype.onSet = function(e){
  if (classes(e.target).has('selected')) {
    if (!this.options.unselectable) return;
    return this.unset(e.target);
  }

  if (!this.options.multiple) {
    var selected = this.el.querySelectorAll('.selected');
    if (selected.length) {
      for (var i=0; i<selected.length; ++i) {
        this.unset(selected[i]);
      }
    }
  }

  this.set(e.target);
};

/**
 * Set the given button
 *
 * Emits `set` (el, index) event
 *
 * @param {Element|Number} button option to select
 * @api public
 */

ButtonSet.prototype.set = function(button){
  return this.change(button, true);
};

/**
 * Unset the given button
 *
 * Emits `unset` (el, index) event
 *
 * @param {Element|Number} button option to select
 * @api public
 */

ButtonSet.prototype.unset = function(button){
  return this.change(button, false);
};

/**
 * Set/Unset the given button
 *
 * @param {Element|Number} button option to select
 * @param {Boolean} set defines set or unset button
 * @api private
 */

ButtonSet.prototype.change = function(button, set){
  button = 'number' == typeof button ? this.el.children[button] : button;
  var index = this.getButtonIndex(button);

  classes(button)[set ? 'add' : 'remove']('selected');
  this.emit(set ? 'set' : 'unset', button, this.getButtonIndex(button));
  return true;
};

ButtonSet.prototype.getButtonIndex = function(button) {
  return 0;  // not implemented yet 
}

