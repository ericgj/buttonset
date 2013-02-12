

/**
 * Module dependencies.
 */

var Emitter   = require('emitter')
  , delegate  = require('delegate')
  , classes   = require('classes')
  , data      = require('data')
  , domify    = require('domify')
  , tmplBtn   = require('./template-button');

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
 *  - indexattr {String} data- attribute for storing button index (default 'button-index')
 *
 * @api public
 */

function ButtonSet(el, opts) {
  if (!(this instanceof ButtonSet)) return new ButtonSet(el, opts);
  Emitter.call(this);

  this.el = (('string' == typeof el) ? document.querySelector(el) : el);
  classes(this.el).add('buttonset');
  this.options = opts || {};
  this.length = 0;

  // force unselectable if buttonset is multiple
  if (this.options.multiple) this.options.unselectable = true;

  // set button index attribute or default
  this.options.indexattr = this.options.indexattr || 'button-index';

  // add buttons
  if (this.options.buttons) {
    for (var i = 0; i < this.options.buttons.length; i++) {
      this.add(this.options.buttons[i]);
    }
  }

  // bind click event from child buttons to onSet
  delegate.bind(this.el, 
                this.getButtonTemplate().nodeName, 'click', 
                this.onSet.bind(this)
               );

  // set initial select index if given
  if ('undefined' != typeof this.options.select) this.set(this.options.select);

  return this;
}

/**
 * Inherits from `Emitter.prototype`.
 */

ButtonSet.prototype.__proto__ = Emitter.prototype;

/**
 * Add a new button option
 *
 * @param {String} button button/buttons to add
 * @api public
 */

ButtonSet.prototype.add = function(){
  for (var i = 0; i < arguments.length; i++) {
    var b = this.getButtonTemplate().cloneNode(true);
    b.innerHTML = arguments[i];
    b.setAttribute('data-'+this.options.indexattr, this.length++);
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
      for (var i=0; i<selected.length; i++) {
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

/**
 * Get button element from template (memoized)
 *
 * @api private
 */

ButtonSet.prototype.getButtonTemplate = function() {
  return this.buttonTemplate || (this.buttonTemplate = domify(tmplBtn)[0]);
}

/**
 * Get button index element from data- attribute
 *
 * @api public
 */

ButtonSet.prototype.getButtonIndex = function(button) {
  return data(button).get(this.options.indexattr);
}

