require('./rivets-shim.js');

var binder = require('rivets').bind
  , domify   = require('domify')
  , template = require('./template.js')

module.exports = ButtonSetView;

function ButtonSetView(model){
  if (!(this instanceof ButtonSetView)) return new ButtonSetView(model);
  this.el = domify(template)[0];
  this.model = model;
  binder(this.el, model);
};

ButtonSetView.prototype.button = function(slug){
  return this.el.querySelector('[data-button-slug='+createSlug(slug)+']');
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

