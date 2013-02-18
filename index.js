/**
 * Module dependencies.
 */

var Emitter   = require('emitter')
  , delegate  = require('delegate')
  , classes   = require('classes')
  , data      = require('data')
  , domify    = require('domify')

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
  if (fn) b.onclick = function(e){fn(e)};
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
 * onclick event handler (delegated from button)
 *
 * @param {Object} e event object
 * @api private
 */

ButtonSet.prototype.onclick = function(e){
  if (classes(e.target).has('selected')) {
    if (!this.unselectable) return;
    return this.deselectEl(e.target);
  }

  if (!this.multiple) {
    var selected = this.el.querySelectorAll('.selected');
    if (selected.length) {
      for (var i=0; i<selected.length; i++) {
        this.deselectEl(selected[i]);
      }
    }
  }

  return this.selectEl(e.target);
};

ButtonSet.prototype.deselectEl = function(button){
  return this.deselect(data(button).get('button-slug'));
};

ButtonSet.prototype.selectEl = function(button){
  return this.select(data(button).get('button-slug'));
};

/**
 * Select the given button
 *
 * Emits `select` (button) event
 *
 * @param {String} slug button to select
 * @api public
 */

ButtonSet.prototype.select = function(slug){
  return this.change(slug, true);
};

/**
 * Deselect the given button
 *
 * Emits `deselect` (button) event
 *
 * @param {String} slug button to deselect
 * @api public
 */

ButtonSet.prototype.deselect = function(slug){
  return this.change(slug, false);
};

/**
 * Select/Deselect the given button
 *
 * @param {String} slug button to select/deselect
 * @param {Boolean} set select (true) or deselect (false)
 * @api public
 */

ButtonSet.prototype.change = function(slug, set){
  var button = this.getButtonElement(slug);
  classes(button)[set ? 'add' : 'remove']('selected');
  this.emit(set ? 'select' : 'deselect', button);
  if (set) this.emit(slug); 
  return true;
};

/**
 * Get button element from slug
 *
 * @api public
 */

ButtonSet.prototype.getButtonElement = function(slug) {
  return this.el.querySelector('[data-'+this.buttonSlug+'='+slug+']'); 
}


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
