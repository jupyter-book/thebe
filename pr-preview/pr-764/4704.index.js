"use strict";(self.webpackChunkthebe=self.webpackChunkthebe||[]).push([[4704],{4704:(e,t,n)=>{function r(e,t,n){return t(n),n(e,t)}n.r(t),n.d(t,{elm:()=>b});var i=/[a-z]/,o=/[A-Z]/,a=/[a-zA-Z0-9_]/,u=/[0-9]/,f=/[0-9A-Fa-f]/,s=/[-&*+.\\/<>=?^|:]/,l=/[(),[\]{}]/,c=/[ \v\f]/;function p(){return function(e,t){if(e.eatWhile(c))return null;var n=e.next();if(l.test(n))return"{"===n&&e.eat("-")?r(e,t,h(1)):"["===n&&e.match("glsl|")?r(e,t,g):"builtin";if("'"===n)return r(e,t,x);if('"'===n)return e.eat('"')?e.eat('"')?r(e,t,k):"string":r(e,t,m);if(o.test(n))return e.eatWhile(a),"type";if(i.test(n)){var p=1===e.pos;return e.eatWhile(a),p?"def":"variable"}if(u.test(n)){if("0"===n){if(e.eat(/[xX]/))return e.eatWhile(f),"number"}else e.eatWhile(u);return e.eat(".")&&e.eatWhile(u),e.eat(/[eE]/)&&(e.eat(/[-+]/),e.eatWhile(u)),"number"}return s.test(n)?"-"===n&&e.eat("-")?(e.skipToEnd(),"comment"):(e.eatWhile(s),"keyword"):"_"===n?"keyword":"error"}}function h(e){return 0==e?p():function(t,n){for(;!t.eol();){var r=t.next();if("{"==r&&t.eat("-"))++e;else if("-"==r&&t.eat("}")&&0==--e)return n(p()),"comment"}return n(h(e)),"comment"}}function k(e,t){for(;!e.eol();)if('"'===e.next()&&e.eat('"')&&e.eat('"'))return t(p()),"string";return"string"}function m(e,t){for(;e.skipTo('\\"');)e.next(),e.next();return e.skipTo('"')?(e.next(),t(p()),"string"):(e.skipToEnd(),t(p()),"error")}function x(e,t){for(;e.skipTo("\\'");)e.next(),e.next();return e.skipTo("'")?(e.next(),t(p()),"string"):(e.skipToEnd(),t(p()),"error")}function g(e,t){for(;!e.eol();)if("|"===e.next()&&e.eat("]"))return t(p()),"string";return"string"}var d={case:1,of:1,as:1,if:1,then:1,else:1,let:1,in:1,type:1,alias:1,module:1,where:1,import:1,exposing:1,port:1};const b={name:"elm",startState:function(){return{f:p()}},copyState:function(e){return{f:e.f}},token:function(e,t){var n=t.f(e,(function(e){t.f=e})),r=e.current();return d.hasOwnProperty(r)?"keyword":n},languageData:{commentTokens:{line:"--"}}}}}]);
//# sourceMappingURL=4704.index.js.map