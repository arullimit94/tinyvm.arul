import{readdirSync as R,readFileSync as F,mkdirSync as K,writeFileSync as W}from"fs"
let T="01146abfeeeeeeee999999959995999e999eeeeeeeeeeeee04400eeeeeeeeeee58eeeeeeeeeeeeee4414",E=0
let B=[(x,y)=>x+y|0,(x,y)=>x-y|0,Math.imul,(x,y)=>x/y|0,(x,y)=>x%y|0,(x,y)=>(x>>>0)/(y>>>0)|0,(x,y)=>(x>>>0)%(y>>>0)|0,0,(x,y)=>x&y,(x,y)=>x|y,(x,y)=>x^y,0,(x,y)=>x<<(y&31),(x,y)=>x>>(y&31),(x,y)=>(x>>>(y&31))|0,0,(x,y)=>+(x==y),(x,y)=>+(x<y),(x,y)=>+(x>>>0<y>>>0)]
let V=(P,I)=>{
let O="",S=[],C=[],M=[],p=0,j=0,n=0,J=()=>P.readInt16LE(p+1)
try{for(;;){
if(n>=1e6)throw 10;
if(p>>>0>=P.length)throw 9;
let o=P[p],v=+("0x"+(T[o]||"e"));
if(v==14)throw 5;
let L=o==1?1:o==2?4:o>47&&o<52?2:0;
if(p+1+L>P.length)throw 9;
n++;
let U=v>>2,H=v&3;
if(S.length<U)throw 2;
if(S.length-U+H>256)throw 3;
let a=S.at(-1),b=S.at(-2);
if(o==0)throw 0;
else if(o<3)S.push(o==1?P[p+1]<<24>>24:P.readInt32LE(p+1));
else if(o==3)S.pop();
else if(o==4)S.push(a);
else if(o==5)S.push(S.splice(-2,1)[0]);
else if(o==6)S.push(b);
else if(o==7)S.push(S.splice(-3,1)[0]);
else if(o==23)S[S.length-1]=-a|0;
else if(o==27)S[S.length-1]=~a;
else if(o>15&&o<35){if(o>18&&o<23&&!a)throw 4;S.length-=2;S.push(B[o-16](b,a))}
else if(o==48){p+=3+J();continue}
else if(o==49){S.pop();if(!a){p+=3+J();continue}}
else if(o==50){S.pop();if(a){p+=3+J();continue}}
else if(o==51){if(C.length>63)throw 7;C.push(p+3);p=P[p+1]|P[p+2]<<8;continue}
else if(o==52){if(!C.length)throw 8;p=C.pop();continue}
else if(o==64){if(a>>>0>255)throw 6;S[S.length-1]=M[a]||0}
else if(o==65){if(a>>>0>255)throw 6;M[a]=b;S.length-=2}
else if(o==80){if(O.length+(""+a).length>65536)throw 11;O+=a;S.pop()}
else if(o==81){if(O.length>65535)throw 11;O+=String.fromCharCode(a&255);S.pop()}
else if(o==82)S.push(j<I.length?I[j++]:-1);
else if(o==83)throw a&255;
p+=1+L;
}}catch(x){E=x}
return O
}
for(let d of R("/input")){
let o=V(F("/input/"+d+"/program.bin"),F("/input/"+d+"/input.bin")),t="/output/"+d+"/";
K(t,{recursive:true});
W(t+"stdout.bin",Buffer.from(o,"latin1"));
W(t+"exit.txt",E+"");
}
