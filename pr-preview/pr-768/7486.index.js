"use strict";(self.webpackChunkthebe=self.webpackChunkthebe||[]).push([[7486],{7486:(e,n,t)=>{function r(e){return new RegExp("^(("+e.join(")|(")+"))\\b")}t.r(n),t.d(n,{octave:()=>k});var i=new RegExp("^[\\+\\-\\*/&|\\^~<>!@'\\\\]"),a=new RegExp("^[\\(\\[\\{\\},:=;\\.]"),o=new RegExp("^((==)|(~=)|(<=)|(>=)|(<<)|(>>)|(\\.[\\+\\-\\*/\\^\\\\]))"),c=new RegExp("^((!=)|(\\+=)|(\\-=)|(\\*=)|(/=)|(&=)|(\\|=)|(\\^=))"),m=new RegExp("^((>>=)|(<<=))"),s=new RegExp("^[\\]\\)]"),u=new RegExp("^[_A-Za-z¡-￿][_A-Za-z0-9¡-￿]*"),l=r(["error","eval","function","abs","acos","atan","asin","cos","cosh","exp","log","prod","sum","log10","max","min","sign","sin","sinh","sqrt","tan","reshape","break","zeros","default","margin","round","ones","rand","syn","ceil","floor","size","clear","zeros","eye","mean","std","cov","det","eig","inv","norm","rank","trace","expm","logm","sqrtm","linspace","plot","title","xlabel","ylabel","legend","text","grid","meshgrid","mesh","num2str","fft","ifft","arrayfun","cellfun","input","fliplr","flipud","ismember"]),f=r(["return","case","switch","else","elseif","end","endif","endfunction","if","otherwise","do","for","while","try","catch","classdef","properties","events","methods","global","persistent","endfor","endwhile","printf","sprintf","disp","until","continue","pkg"]);function h(e,n){return e.sol()||"'"!==e.peek()?(n.tokenize=d,d(e,n)):(e.next(),n.tokenize=d,"operator")}function p(e,n){return e.match(/^.*%}/)?(n.tokenize=d,"comment"):(e.skipToEnd(),"comment")}function d(e,n){if(e.eatSpace())return null;if(e.match("%{"))return n.tokenize=p,e.skipToEnd(),"comment";if(e.match(/^[%#]/))return e.skipToEnd(),"comment";if(e.match(/^[0-9\.+-]/,!1)){if(e.match(/^[+-]?0x[0-9a-fA-F]+[ij]?/))return e.tokenize=d,"number";if(e.match(/^[+-]?\d*\.\d+([EeDd][+-]?\d+)?[ij]?/))return"number";if(e.match(/^[+-]?\d+([EeDd][+-]?\d+)?[ij]?/))return"number"}if(e.match(r(["nan","NaN","inf","Inf"])))return"number";var t=e.match(/^"(?:[^"]|"")*("|$)/)||e.match(/^'(?:[^']|'')*('|$)/);return t?t[1]?"string":"error":e.match(f)?"keyword":e.match(l)?"builtin":e.match(u)?"variable":e.match(i)||e.match(o)?"operator":e.match(a)||e.match(c)||e.match(m)?null:e.match(s)?(n.tokenize=h,null):(e.next(),"error")}const k={name:"octave",startState:function(){return{tokenize:d}},token:function(e,n){var t=n.tokenize(e,n);return"number"!==t&&"variable"!==t||(n.tokenize=h),t},languageData:{commentTokens:{line:"%"}}}}}]);
//# sourceMappingURL=7486.index.js.map