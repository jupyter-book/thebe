"use strict";(self.webpackChunkthebe=self.webpackChunkthebe||[]).push([[1001],{1001:(e,n,t)=>{t.r(n),t.d(n,{ntriples:()=>i});function r(e,n){var t,r=e.location;t=0==r&&"<"==n?1:0==r&&"_"==n?2:3==r&&"<"==n?4:5==r&&"<"==n?6:5==r&&"_"==n?7:5==r&&'"'==n?8:1==r&&">"==n||2==r&&" "==n?3:4==r&&">"==n?5:6==r&&">"==n||7==r&&" "==n||8==r&&'"'==n||9==r&&" "==n||10==r&&">"==n?11:8==r&&"@"==n?9:8==r&&"^"==n?10:" "!=n||0!=r&&3!=r&&5!=r&&11!=r?11==r&&"."==n?0:12:r,e.location=t}const i={name:"ntriples",startState:function(){return{location:0,uris:[],anchors:[],bnodes:[],langs:[],types:[]}},token:function(e,n){var t=e.next();if("<"==t){r(n,t);var i="";return e.eatWhile((function(e){return"#"!=e&&">"!=e&&(i+=e,!0)})),n.uris.push(i),e.match("#",!1)||(e.next(),r(n,">")),"variable"}if("#"==t){var u="";return e.eatWhile((function(e){return">"!=e&&" "!=e&&(u+=e,!0)})),n.anchors.push(u),"url"}if(">"==t)return r(n,">"),"variable";if("_"==t){r(n,t);var a="";return e.eatWhile((function(e){return" "!=e&&(a+=e,!0)})),n.bnodes.push(a),e.next(),r(n," "),"builtin"}if('"'==t)return r(n,t),e.eatWhile((function(e){return'"'!=e})),e.next(),"@"!=e.peek()&&"^"!=e.peek()&&r(n,'"'),"string";if("@"==t){r(n,"@");var s="";return e.eatWhile((function(e){return" "!=e&&(s+=e,!0)})),n.langs.push(s),e.next(),r(n," "),"string.special"}if("^"==t){e.next(),r(n,"^");var l="";return e.eatWhile((function(e){return">"!=e&&(l+=e,!0)})),n.types.push(l),e.next(),r(n,">"),"variable"}" "==t&&r(n,t),"."==t&&r(n,t)}}}}]);
//# sourceMappingURL=1001.index.js.map