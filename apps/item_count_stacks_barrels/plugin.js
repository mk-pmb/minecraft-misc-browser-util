/* -*- coding: UTF-8, tab-width: 2 -*- */
'use strict';
(function setup() {
  const EX = {

    name: 'Item count to barrels/stacks/remainder',

    inputs: {

      amount: {
        uiType: 'string',
        uiTypeOpt: { typicalLength: 80 },
        help: `
          One or more numbers, separated by spaces and/or plus signs.
          Numbers can be suffixed with 's' for stack (1s = usually 64)
          or 'b' for barrel (1b = 3*9s = usually 1728).

          For egg-like items, the letter 'e' can be added in front of or
          behind the numbers list to modify the stack size to 1s = 16.

          If a space character is followed by something other than a digit
          or a plus sign, it marks the start of an optional description,
          which is meant to help you remember what the number means if you
          convert lots of numbers.
          A colon (:) or number sign (#) also marks the start of a description.
          `,
        examples: [
          '787 apple',
          'e787 eggs',
          '12s 19 torch',
          '1b 22s 3e pearls',
        ],
      },

    },

    parseCliArgs(ctx) {
      // eslint-disable-next-line no-param-reassign
      ctx.cliArgs = [ctx.cliArgs.join(' ')];
    },

    run(ctx) {
      let a = ctx;
      if (a.inputs) { a = a.inputs.amount; }
      a = String(a || '').trim();
      if (!a) { return '0'; }
      a = a.split(/(\s(?=[^\d\s\+\-])|:|#)/);
      const descr = a.slice(2).join('').replace(/^[\s#]+/, '').trim();
      [a] = a;

      let itemType = '';
      let stackSize = EX.defaultStackSize;
      const specialItemTypeStackSizes = {
        e: EX.eggLikeStackSize,
      };
      a = a.replace(/^[a-z]|[a-z]$/g, function specialItemType(m) {
        const s = specialItemTypeStackSizes[m];
        if (s) {
          itemType = m;
          stackSize = s;
          return '';
        }
        return m;
      });

      const validSuffixes = {
        '': 1,
        s: stackSize,
        b: stackSize * EX.barrelSlotCount,
      };
      let sum = 0;
      a = a.split(/ |\+|(?=\-)/);
      a.forEach(function add(part) {
        if (!part) { return; }
        const [d, s] = part.split(/([a-z])$/);
        const m = validSuffixes[s || ''];
        if (!m) { throw new Error('Unsupported suffix: ' + s); }
        sum += (+d || 0) * m;
      });

      let remain = sum;
      const neg = (sum < 0 ? '-' : '');
      if (neg) { remain = -remain; }
      a = [];
      Object.entries(validSuffixes).reverse().forEach(function take([k, v]) {
        const n = Math.floor(remain / v);
        if (!n) { return; }
        a.push(n + k);
        remain %= v;
      });
      a = neg + (a.join(neg || '+') || '0') + itemType;
      a = sum + itemType + ' = ' + a;
      if (descr) { a += ' # ' + descr; }
      return a;
    },


    defaultStackSize: 64,
    eggLikeStackSize: 16,
    barrelSlotCount: 3 * 9,

  };










  (function unifiedExport(e) {
    /* global define */
    const d = ((typeof define === 'function') && define);
    const m = ((typeof module === 'object') && module);
    if (d && d.amd) { d(function f() { return e; }); }
    if (m && m.exports) { m.exports = e; }
  }(EX));
}());
