/*jslint indent: 2, maxlen: 80, continue: false, unparam: false, browser: true */
'use strict';

function tags(c, t) { return Array.from(c.getElementsByTagName(t)); }

function spanSlot(c, h) {
  return '<span class="slot ' + c + '">' + h + '</span>';
}

function distFmt(x) { return spanSlot('distance', x); }
function coordFmt(x) { return spanSlot('coordinate', x); }

function advise(a, elem, v, g, d) {
  a = spanSlot('axis-letter', a);
  v = spanSlot('direction', v);
  elem.innerHTML = (distFmt(d) + ' blocks ' + v + ' of you: ' + a
    + '<sub>G</sub> = ' + coordFmt(g) + '(range: ' + coordFmt(g - 64)
    + ' &le; ' + a + ' &le; ' + coordFmt(g + 63) + ')');
}

function recalc(form) {
  var c = (+form.c.value || 0), g = (Math.floor((c - 64) / 320) * 320) + 64;
  advise(form.axis.name, form.a, form.axis.start, g, c - g);
  advise(form.axis.name, form.b, form.axis.end, g + 320, g + 320 - c);
}

function recalcRetFalse(form) {
  recalc(form);
  return false;
}

function addForm(plh, axis) {
  var form = document.createElement('form'), c, re = recalc.bind(null, form);
  form.action = 'nope://';
  form.method = 'get';
  form.innerHTML = ("\n  <p>Player's " + spanSlot('axis-letter', axis.name)
    + ': <input type="number" id="c" size="5" value="0">'
    + '<input type="submit" name="s" value="&raquo;">\n'
    + 'The nearby grid lines are&hellip;</p>\n'
    + '<p></p>\n<p></p>\n');
  form.onsubmit = recalcRetFalse.bind(null, form);
  plh.parentElement.insertBefore(form, plh);
  c = tags(form, 'p');
  form.a = c[1];
  form.b = c[2];
  form.axis = axis;
  c = form.elements.c;
  c.onblur = re;
  c.onchange = re;
  c.onkeyup = re;
  c.onmouseup = re;
  re();
}

(function install(placeholder) {
  addForm(placeholder, { name: 'x', start: 'west', end: 'east' });
  addForm(placeholder, { name: 'z', start: 'north', end: 'south' });
  document.body.removeChild(placeholder);
}(document.getElementById('loading')));
