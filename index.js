/**
 * Module dependencies.
 */

var Emitter   = require('emitter')
  , delegate  = require('delegate')
  , classes   = require('classes')
  , data      = require('data')
  , domify    = require('domify')
  , event     = require('event')

/**
 * Expose `ButtonSet`.
 */

module.exports = ButtonSet;

/**
 * Initialize a new `ButtonSet`.
 *
 * Emits:
 *
 *  - "remove":   when button removed
 *  - "select":   when button selected
 *  - "deselect": when button deselected
 *  - * :         button slug events are emitted when clicked 
 */

function ButtonSet(opts) {
  if (!(this instanceof ButtonSet)) return new ButtonSet(opts);
  Emitter.call(this);

  this.el = domify('<div class=buttonset>')[0];

  opts = opts || {};
  this.multiple = !!(opts['multiple']);
  // note force unselectable if buttonset is multiple
  this.unselectable = (!!(opts['unselectable']) || this.multiple);
  this.buttonSlug = opts['buttonSlug'] || 'button-slug'

  // bind click event from child buttons to onclick
  delegate.bind(this.el, 'button', 'click', this.onclick.bind(this));

  return this;
}

/**
 * Inherits from `Emitter.prototype`.
 */

ButtonSet.prototype = new Emitter;

/**
 * Add a new button option
 *
 * @param {String} text button text/html to add
 * @param {Function} fn onclick handler for button (optional)
 * @api public
 */

ButtonSet.prototype.add = function(text,fn){
  var slug;
  // slug, text, [fn]
  if ('string' == typeof fn) {
    slug = text;
    text = fn;
    fn = arguments[2];
  } else {
    slug = createSlug(text);
  };
  
  var b = domify('<button>')[0];
  b.innerHTML = text;
  b.setAttribute('data-'+this.buttonSlug, slug); 
  if (fn) event.bind(b, 'click', function(e){fn(e)});
  this.el.appendChild(b);

  return this;
};

ButtonSet.prototype.remove = function(slug){
  var b = this.getButtonElement(slug);
  this.emit('remove', slug);
  this.el.removeChild(b);
  return this;
};

/**
 * Set button (element or slug) to select
 *
 * @param {Element|String} button element or slug
 * @api public
 */
ButtonSet.prototype.set = function(button){
  if ('string'== typeof button) button = this.getButtonElement(button);
  if (classes(button).has('selected')) {
    if (!this.unselectable) return;
    return this.deselectEl(button);
  }

  if (!this.multiple) {
    var selected = this.el.querySelectorAll('.selected');
    if (selected.length) {
      for (var i=0; i<selected.length; i++) {
        this.deselectEl(selected[i]);
      }
    }
  }

  return this.selectEl(button);
};

/**
 * Alias for +set+
 *
 * @param {String} button slug
 * @api public
 */
ButtonSet.prototype.setInput = function(slug){
  return this.set(slug);
};

/**
 * Get button element from slug
 *
 * @param {String} slug button slug
 * @api public
 */

ButtonSet.prototype.getButtonElement = function(slug) {
  return this.el.querySelector('[data-'+this.buttonSlug+'='+slug+']'); 
};


/**
 * Attach this.el to given element (or selector) 
 *
 * @param {Element|String} ref element or selector to attach to
 * @api public
 */

ButtonSet.prototype.attachTo = function(ref) {
  if ('string'== typeof ref) ref = document.querySelector(ref);
  ref.appendChild(this.el);
  return this;
};

/**
 * onclick event handler (delegated from button)
 *
 * @param {Object} e event object
 * @api private
 */

ButtonSet.prototype.onclick = function(e){
  return this.set(e.target);
};

/**
 * Deselect button 
 *
 * @param {Object} button element to deselect 
 * @api private
 */

ButtonSet.prototype.deselectEl = function(button){
  return this.deselect(data(button).get('button-slug'));
};

/**
 * Select button 
 *
 * @param {Object} button element to select 
 * @api private
 */

ButtonSet.prototype.selectEl = function(button){
  return this.select(data(button).get('button-slug'));
};

/**
 * Select the given button (identified by slug)
 *
 * Emits `select` (button) event
 *
 * @param {String} slug button to select
 * @api private
 */

ButtonSet.prototype.select = function(slug){
  return this.change(slug, true);
};

/**
 * Deselect the given button (identified by slug)
 *
 * Emits `deselect` (button) event
 *
 * @param {String} slug button to deselect
 * @api private
 */

ButtonSet.prototype.deselect = function(slug){
  return this.change(slug, false);
};

/**
 * Select/Deselect the given button
 *
 * @param {String} slug button to select/deselect
 * @param {Boolean} set select (true) or deselect (false)
 * @api private
 */

ButtonSet.prototype.change = function(slug, set){
  var button = this.getButtonElement(slug);
  classes(button)[set ? 'add' : 'remove']('selected');
  this.emit(set ? 'select' : 'deselect', button, slug);
  if (set) this.emit(slug); 
  return true;
};


/**
 * Generate a slug from `str`.
 *
 * @param {String} str
 * @return {String}
 * @api private
 */

function createSlug(str) {
  return String(str)
    .toLowerCase()
    .replace(/ +/g, '-')
    .replace(/[^a-z0-9-]/g, '');
};
