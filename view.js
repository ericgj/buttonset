require('./rivets-shim.js');

var binder = require('rivets').bind
  , domify   = require('domify')
  , template = require('./template.js')

module.exports = ButtonSetView;

function ButtonSetView(model){
  if (!(this instanceof ButtonSetView)) return new ButtonSetView(model);
  this.el = domify(template)[0];
  binder(this.el, model);
};


