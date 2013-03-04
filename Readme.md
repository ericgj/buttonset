
# ButtonSet

  ButtonSet component, now with dropdown support

  ![js buttonset component](http://imgur.com/Odolaeo.png)

## Installation

```
$ component install ericgj/buttonset
```

## Events

  - `select` (button) when a button is selected.
  - `<slug>` (button) when a button is selected.
  - `deselect` (button) when a button is deselected.
  - `show` (button) when a button is shown.
  - `hide` (button) when a button is hidden.

## Example

```js
var ButtonSet = require('buttonset'),
    ButtonSetView = require('buttonset/view.js');

var bset = new ButtonSet();
bset.add('A');
bset.add('B', 'C', 'D');

bset.on('select', function(button){
  console.log('SELECT button "%s". label: %s', button.slug, button.label);
});

bset.on('deselect', function(button){
  console.log('DESELECT button "%s". label: %s', button.slug, button.label);
});

// slug-based event handling
bset.on('d', function(){ alert('D was pressed!'); });

bset.button('special').select();

// view binding
var view = ButtonSetView(bset);

// adding a dropdown
view.dropdown('C', someMenu);

// DOM insertion
document.getElementById('my-buttonset').appendChild(view.el);

```

## API

### ButtonSet(options)

  Creates a new `ButtonSet` with the following (optional) options.

  - unselectable {Boolean} allows unset the current selected option (default false)
  - multiple {Boolean} allows multiple selections (default false)

### ButtonSet#add(label,slug)

  Add a button with the given label and (optional) slug to the buttonset.
  The `slug` is used to emit button-select events.

### ButtonSet#deselect

  Deselect all buttons in buttonset.

### ButtonSet#button(id)
  
  Button accessor by array position, button slug or button label.

-----

### Button#select

  Select button (emulate click on button element) 

### Button#deselect

  Deselect button

### Button#show

  Show button

### Button#hide

  Hide button

-----

### ButtonSetView#button(slug)

   Button element accessor by button slug

### ButtonSetView#dropdown(slug, menu)

   Display dropdown menu at given button. 
   Note that `menu` must respond to `#attachTo(el)` and emit `select`.


## Implementation notes

  This is a jQuery-free implementation, API adapted from 
  [retrofox/buttonset](http://github.com/retrofox/buttonset)

  It is designed to showcase the use of declarative, two-way, iteration binding with 
  [rivets.js](http://rivetsjs.com).
  
## License

(The MIT License) <br/>
Copyright(c) 2013 Eric Gjertsen <ericgj72@gmail.com>

Adapted from API/code <br/>
Copyright(c) 2012 Damian Suarez <rdsuarez@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
