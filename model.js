var Emitter = require('emitter')

module.exports = ButtonSet;

function ButtonSet(){
  this.buttons = [];
  for (var i=0;i<arguments.length;++i) {
    this.add(arguments[i]);
  }
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
};

Button.prototype.select = function(){
  if (this.selected) return;
  this.bset.deselect();
  this.selected = true;
  this.bset.emit('select', this.slug, this.label);
  this.bset.emit(this.slug, this.label);
};

Button.prototype.deselect = function(){
  if (!(this.selected)) return;
  this.selected = false;
  this.bset.emit('deselect', this.slug, this.label);
};

Button.prototype.show = function(){
  this.shown = true;
  this.bset.emit('show', this.slug, this.label);
};

Button.prototype.hide = function(){
  this.shown = false;
  this.bset.emit('hide', this.slug, this.label);
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

