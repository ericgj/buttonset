require('./rivets-shim.js');

var builder = require('rivets').bind
  , domify   = require('domify')
  , template = require('./template.js')

module.exports = ButtonSetView;

function ButtonSetView(model){
  if (!(this instanceof ButtonSetView)) return new ButtonSetView(model);
  this.el = domify(template)[0];
  builder(this.el, model);
};


