var Emitter = require('emitter'),
    react   = require('react')

module.exports = ButtonSet;

Behaviors = {
  button: {
    deselect: function(btn){ btn.deselect() },
    noop: function(){}
  },
  buttonset: {
    noop: function(){},
    deselect: function(bset){ bset.deselect() }
  }
};

function ButtonSet(opts){
  opts = opts || {};
  this.buttonBehavior = 
    opts.unselectable ? 
      Behaviors.button.deselect :
      Behaviors.button.noop

  this.buttonsetBehavior = 
    opts.multiple ?
      Behaviors.buttonset.noop :
      Behaviors.buttonset.deselect
                                 
  this.buttons = [];
  return this;
};

ButtonSet.prototype = new Emitter();

ButtonSet.prototype.add = function(label,slug){
  this.buttons.push( new Button(this,label,slug) );
  return this;
};

ButtonSet.prototype.deselect = function(){
  this.buttons.forEach(function(button){
    button.deselect();
  });
  return this;
};


function Button(bset,label,slug){
  this.bset  = bset;
  this.label = label;
  this.slug  = slug || createSlug(label);
  this.selected = false;
  this.shown = true;
  return react(this);
};

Button.prototype.select = function(){
  if (this.selected){
    this.bset.buttonBehavior(this); return;
  }
  this.bset.buttonsetBehavior(this.bset);
  this.selected = true;
  this.bset.emit('select', this);
  this.bset.emit(this.slug, this);
};

Button.prototype.deselect = function(){
  if (!(this.selected)) return;
  this.selected = false;
  this.bset.emit('deselect', this);
};

Button.prototype.show = function(){
  this.shown = true;
  this.bset.emit('show', this);
};

Button.prototype.hide = function(){
  this.shown = false;
  this.bset.emit('hide', this);
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

