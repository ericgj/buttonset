var reactive = require('reactive')
  , domify   = require('domify')
  , template = require('./template.js')

module.exports = ButtonSetView;

function ButtonSetView(model){
  if (!(this instanceof ButtonSetView)) return new ButtonSetView(model);
  this.el = domify(template)[0];
  reactive(this.el, model, this);
};


