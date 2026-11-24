import fs from'node:fs'
const{MAKEFUN_INPUT_DIR:I='/input',MAKEFUN_OUTPUT_DIR:O='/output'}=process.env
for(const d of fs.readdirSync(I)){const P=I+'/'+d,Q=O+'/'+d,[A,E]=run(fs.readFileSync(P+'/program.bin'),fs.readFileSync(P+'/input.bin'));fs.mkdirSync(Q);fs.writeFileSync(Q+'/stdout.bin',A);fs.writeFileSync(Q+'/exit.txt',''+E)}
function run(p,q){
  const J=Int32Array,D=new J(256),C=[],M=new J(256),o=Buffer.alloc(1<<16)
  let s=0,c=0,l=0,ip=0,pc=0,n=0,a,b,U=x=>x>>>0
  const z=x=>[o.slice(0,l),x]
  const F=[()=>a+b,()=>a-b,Math.imul,()=>a/b,()=>a%b,()=>U(a)/U(b),()=>U(a)%U(b),()=>-b,()=>a&b,()=>a|b,()=>a^b,()=>~b,()=>a<<b,()=>a>>b,()=>a>>>b,0,()=>a==b,()=>a<b,()=>U(a)<U(b)]
  for(;;){
    if(++n>1e6)return z(10)
    if(pc>>>0>=p.length)return z(9)
    const op=p[pc],t='0Aq46:;?        999999959995999 999             PTTP0           58              4414'.charCodeAt(op)-48
    if(op>83|t<0)return z(5)
    const v=t&15,m=t>>4
    if(pc+m>=p.length)return z(9)
    const x=pc+1+m,u=v>>2
    if(s<u|s-u+(v&3)>256)return z(s<u?2:3)
    pc=x
    if(m==2&op<51){
      a=p.readInt16LE(x-2)
      if(op<49||(op==49)==!D[--s])pc=x+a
      continue
    }
    switch(op){
      case 0:return z(0)
      case 1:D[s++]=p[x-1]<<24>>24;break
      case 2:D[s++]=p.readInt32LE(x-4);break
      case 3:s--;break
      case 4:case 6:D[s]=D[s-1-(op==6)],s++;break
      case 5:a=D[s-1],D[s-1]=D[s-2],D[s-2]=a;break
      case 7:[D[s-3],D[s-2],D[s-1]]=[D[s-2],D[s-1],D[s-3]];break
      case 51:if(c==64)return z(7);C[c++]=x;pc=p[x-2]|p[x-1]<<8;break
      case 52:if(!c)return z(8);pc=C[--c];break
      case 64:case 65:a=D[s-1];if(U(a)>255)return z(6);if(op<65)D[s-1]=M[a];else s-=2,M[a]=D[s];break
      case 80:a=Buffer.from(''+D[s-1]);if(l+a.length>65536)return z(11);s--;l+=a.copy(o,l);break
      case 81:if(l>>16)return z(11);o[l++]=D[--s]&255;break
      case 82:D[s++]=q[ip++]??-1;break
      case 83:return z(D[--s]&255)
      default:a=D[s-2];b=D[s-1];if(op>18&op<23&!b)return z(4);s-=u;D[s++]=F[op-16](a,b)
    }
  }
}
