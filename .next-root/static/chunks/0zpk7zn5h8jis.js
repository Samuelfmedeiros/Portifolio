(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,86324,e=>{"use strict";var t=e.i(43476),a=e.i(71645),r=e.i(46932);let s=(0,a.forwardRef)(({children:e,className:a="",delay:s=0},o)=>(0,t.jsx)(r.motion.div,{ref:o,initial:{opacity:0,y:20},whileInView:{opacity:1,y:0},transition:{duration:.5,delay:s},viewport:{once:!0},whileHover:{scale:1.02,boxShadow:"0 0 20px color-mix(in srgb, var(--accent) 15%, transparent), 0 0 40px color-mix(in srgb, var(--accent) 8%, transparent)"},className:`glass rounded-xl p-5 md:p-6 border-[var(--border)] transition-shadow ${a}`,children:e}));s.displayName="GlassCard",e.s(["GlassCard",0,s])},6203,e=>{"use strict";var t=e.i(43476),a=e.i(71645),r=e.i(86324),s=e.i(59919),o=e.i(46932);let n=["#ef4444","#22c55e","#3b82f6","#f59e0b"],i=["VERMELHO","VERDE","AZUL","AMARELO"];var c=e.i(88653);let l=["const [data, setData] = useState([])","export async function GET(req) {","SELECT * FROM users WHERE active = true","SELECT name, COUNT(*) FROM projects GROUP BY name","if (error) return NextResponse.json({ error })",'await fetch("/api/data").then(r => r.json())',"CREATE TABLE missions (id SERIAL PRIMARY KEY)","function fibonacci(n) { return n <= 1 ? n : fibonacci(n-1) + fibonacci(n-2) }",'df.groupby("category").sum().sort_values("total")',"npm run build && npm run deploy","docker-compose up -d --build","git push origin main --force-with-lease",'import { createClient } from "@supabase/supabase-js"','const api = new Hono().get("/health", (c) => c.json({ ok: true }))','UPDATE missions SET status = "complete" WHERE id = 42'],d=[{id:"simon",label:"Sequência",icon:"🧠",component:(0,t.jsx)(function(){let[e,r]=(0,a.useState)([]),[s,o]=(0,a.useState)(!1),[c,l]=(0,a.useState)(null),[d,m]=(0,a.useState)(0),[u,x]=(0,a.useState)("idle"),p=(0,a.useRef)(0),h=(0,a.useCallback)(()=>{r([Math.floor(4*Math.random())]),m(0),x("showing"),p.current=0},[]),f=(0,a.useCallback)(async()=>{for(let t=0;t<e.length;t++)await new Promise(e=>setTimeout(e,400)),l(e[t]),await new Promise(e=>setTimeout(e,300)),l(null);o(!0),x("playing"),p.current=0},[e]);(0,a.useEffect)(()=>{"showing"===u&&e.length>0&&f()},[u,e,f]);let v=(0,a.useCallback)(t=>{if(s&&"playing"===u){if(l(t),setTimeout(()=>l(null),250),t!==e[p.current]){x("gameover"),o(!1);return}if(p.current+=1,p.current===e.length){o(!1),m(e=>e+1);let e=Math.floor(4*Math.random());r(t=>[...t,e]),x("showing")}}},[s,u,e]);return(0,t.jsxs)("div",{className:"flex flex-col items-center gap-3 py-2",children:[(0,t.jsxs)("p",{className:"font-mono text-xs text-[var(--text-secondary)]",children:["idle"===u&&"Clique em Iniciar para jogar!","showing"===u&&"👀 Observe a sequência...","playing"===u&&"🎯 Repita a sequência!","gameover"===u&&`💀 Game Over! Pontua\xe7\xe3o: ${d}`]}),(0,t.jsx)("div",{className:"grid grid-cols-2 gap-2 w-40 h-40",children:n.map((e,a)=>(0,t.jsx)("button",{onClick:()=>v(a),disabled:"playing"!==u,className:`rounded-xl transition-all duration-150 ${c===a?"scale-110 brightness-150 shadow-lg shadow-white/20":"brightness-75 hover:brightness-100"} ${"playing"===u?"cursor-pointer":"cursor-default"}`,style:{backgroundColor:e},"aria-label":i[a]},a))}),(0,t.jsxs)("p",{className:"font-mono text-lg font-bold text-[var(--accent)]",children:["Score: ",d]}),"idle"===u||"gameover"===u?(0,t.jsx)("button",{onClick:h,className:"px-4 py-2 rounded-lg bg-[var(--accent)] text-white font-mono text-xs hover:brightness-110 transition-all",children:"gameover"===u?"🔄 Tentar Novamente":"▶ Iniciar Jogo"}):null]})},{})},{id:"asteroid",label:"Asteroids",icon:"🚀",component:(0,t.jsx)(function(){let[e,r]=(0,a.useState)([]),[s,n]=(0,a.useState)(50),[i,l]=(0,a.useState)(0),[d,m]=(0,a.useState)(!1),[u,x]=(0,a.useState)(!1),[p,h]=(0,a.useState)(0),f=(0,a.useRef)(null),v=(0,a.useRef)(0),g=(0,a.useRef)(0),b=(0,a.useRef)(0),y=(0,a.useCallback)(()=>{let e={id:Date.now()+Math.random(),x:90*Math.random()+5,y:-5,size:20*Math.random()+15,speed:2*Math.random()+1.5+.02*b.current,rotation:360*Math.random()};r(t=>[...t,e])},[]),S=(0,a.useCallback)((e,t)=>{let a=e.x-e.size/10,r=e.x+e.size/10,s=e.y+e.size/10,o=e.y-e.size/10;return t+4>a&&t-4<r&&85<s&&90>o},[]);(0,a.useEffect)(()=>{if(!u||d)return;let e=performance.now(),t=a=>{let o=(a-e)/16;e=a,a-g.current>Math.max(400,1e3-20*b.current)&&(y(),g.current=a),l(e=>{let t=e+Math.round(o);return b.current=t,t}),r(e=>{let t=e.map(e=>({...e,y:e.y+e.speed*o})).filter(e=>!(e.y>105));for(let e of t)if(S(e,s)){m(!0),h(e=>Math.max(e,b.current));break}return t}),v.current=requestAnimationFrame(t)};return v.current=requestAnimationFrame(t),()=>cancelAnimationFrame(v.current)},[u,d,s,y,S]);let N=(0,a.useCallback)(()=>{r([]),l(0),m(!1),x(!0),b.current=0,g.current=performance.now()},[]);return(0,t.jsxs)("div",{className:"py-2",children:[(0,t.jsx)("h3",{className:"font-mono text-sm text-[var(--accent)] mb-4 text-center",children:"🚀 ASTEROID DODGE"}),(0,t.jsxs)("div",{className:"flex justify-between items-center mb-3 px-2",children:[(0,t.jsxs)("p",{className:"font-mono text-xs text-[var(--text-secondary)]",children:["Score: ",(0,t.jsx)("span",{className:"text-[var(--accent)]",children:i})]}),(0,t.jsxs)("p",{className:"font-mono text-xs text-[var(--text-secondary)]",children:["Best: ",(0,t.jsx)("span",{className:"text-[var(--accent-alt)]",children:p})]})]}),(0,t.jsxs)("div",{ref:f,onClick:e=>{if(!f.current||d)return;let t=f.current.getBoundingClientRect();n(Math.max(5,Math.min(95,(e.clientX-t.left)/t.width*100)))},onTouchMove:e=>{if(!f.current||d)return;let t=f.current.getBoundingClientRect();n(Math.max(5,Math.min(95,(e.touches[0].clientX-t.left)/t.width*100)))},className:"relative w-full h-48 rounded-lg overflow-hidden bg-[var(--bg-primary)]/50 border border-[var(--border)] cursor-crosshair select-none",children:[(0,t.jsx)("div",{className:"absolute inset-0",children:Array.from({length:20}).map((e,a)=>(0,t.jsx)("div",{className:"absolute w-0.5 h-0.5 rounded-full bg-[var(--accent)]/20",style:{left:`${100*Math.random()}%`,top:`${100*Math.random()}%`}},a))}),(0,t.jsx)(o.motion.div,{className:"absolute bottom-2 text-lg",style:{left:`${s}%`,transform:"translateX(-50%)"},animate:{scale:d?[1,1.5,0]:1},transition:{duration:.3},children:"🛸"}),(0,t.jsx)(c.AnimatePresence,{children:e.map(e=>(0,t.jsx)(o.motion.div,{initial:{opacity:0,scale:0},animate:{opacity:1,scale:1},exit:{opacity:0,scale:0},className:"absolute text-[var(--error)] font-bold",style:{left:`${e.x}%`,top:`${e.y}%`,fontSize:`${e.size}px`,transform:"translate(-50%, -50%)"},children:"🪨"},e.id))}),(!u||d)&&(0,t.jsx)("div",{className:"absolute inset-0 flex items-center justify-center bg-[var(--bg-primary)]/70 backdrop-blur-sm",children:(0,t.jsxs)("div",{className:"text-center",children:[d&&(0,t.jsxs)("p",{className:"font-mono text-sm text-[var(--error)] mb-2",children:["💥 GAME OVER! Score: ",i]}),(0,t.jsx)("button",{onClick:e=>{e.stopPropagation(),N()},className:"px-6 py-2 rounded-lg font-mono text-sm text-[var(--accent)] bg-[var(--accent)]/10 border border-[var(--accent)]/30 hover:bg-[var(--accent)]/20 transition-colors",children:u?"🔄 REINICIAR":"🚀 INICIAR"}),!u&&(0,t.jsx)("p",{className:"font-mono text-[10px] text-[var(--text-secondary)] mt-2",children:"Clique/toque para mover a nave"})]})})]})]})},{})},{id:"typing",label:"Code Type",icon:"⌨️",component:(0,t.jsx)(function(){var e;let r,[s,o]=(0,a.useState)({currentSnippet:l[Math.floor(Math.random()*l.length)],userInput:"",startTime:null,wpm:0,accuracy:100,completed:0,started:!1,finished:!1,timer:0}),n=(0,a.useRef)(null),i=(0,a.useRef)(null);(0,a.useEffect)(()=>{if(s.started&&!s.finished)return i.current=setInterval(()=>{o(e=>({...e,timer:e.timer+1}))},1e3),()=>{i.current&&clearInterval(i.current)}},[s.started,s.finished]),(0,a.useEffect)(()=>{if(s.startTime&&!s.finished){let e=(Date.now()-s.startTime)/6e4,t=s.userInput.length/5,a=e>0?Math.round(t/e):0;o(e=>({...e,wpm:a}))}},[s.userInput,s.startTime,s.finished]),(0,a.useEffect)(()=>{if(0===s.userInput.length)return void o(e=>({...e,accuracy:100}));let e=0;for(let t=0;t<s.userInput.length;t++)s.userInput[t]===s.currentSnippet[t]&&e++;let t=Math.round(e/s.userInput.length*100);o(e=>({...e,accuracy:t}))},[s.userInput,s.currentSnippet]);let c=(0,a.useCallback)(e=>{let t=e.target.value;if(s.started?o(e=>({...e,userInput:t})):o(e=>({...e,started:!0,startTime:Date.now(),userInput:t})),t===s.currentSnippet){let e=s.completed+1,t=l[Math.floor(Math.random()*l.length)];o(a=>({...a,userInput:"",currentSnippet:t,completed:e,finished:e>=5}))}},[s.started,s.currentSnippet,s.completed]),d=(0,a.useCallback)(()=>{o({currentSnippet:l[Math.floor(Math.random()*l.length)],userInput:"",startTime:null,wpm:0,accuracy:100,completed:0,started:!1,finished:!1,timer:0}),n.current?.focus()},[]);return(0,t.jsxs)("div",{className:"py-2",children:[(0,t.jsx)("h3",{className:"font-mono text-sm text-[var(--accent)] mb-4 text-center",children:"⌨️ CODE TYPING CHALLENGE"}),s.finished?(0,t.jsxs)("div",{className:"text-center space-y-3 py-4",children:[(0,t.jsx)("p",{className:"font-mono text-lg text-[var(--accent)]",children:"🏆 MISSÃO CUMPRIDA!"}),(0,t.jsxs)("div",{className:"grid grid-cols-3 gap-4 font-mono text-xs",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"text-[var(--text-secondary)]",children:"WPM"}),(0,t.jsx)("p",{className:"text-[var(--accent)] text-lg",children:s.wpm})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"text-[var(--text-secondary)]",children:"Precisão"}),(0,t.jsxs)("p",{className:"text-[var(--accent)] text-lg",children:[s.accuracy,"%"]})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"text-[var(--text-secondary)]",children:"Tempo"}),(0,t.jsx)("p",{className:"text-[var(--accent)] text-lg",children:(r=Math.floor((e=s.timer)/60),`${r}:${(e%60).toString().padStart(2,"0")}`)})]})]}),(0,t.jsx)("button",{onClick:d,className:"px-6 py-2 rounded-lg font-mono text-sm text-[var(--accent)] bg-[var(--accent)]/10 border border-[var(--accent)]/30 hover:bg-[var(--accent)]/20 transition-colors",children:"🔄 JOGAR NOVAMENTE"})]}):(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)("div",{className:"flex justify-between items-center mb-3 px-2 font-mono text-xs",children:[(0,t.jsxs)("span",{className:"text-[var(--text-secondary)]",children:["WPM: ",(0,t.jsx)("span",{className:"text-[var(--accent)]",children:s.wpm})]}),(0,t.jsxs)("span",{className:"text-[var(--text-secondary)]",children:["Precisão: ",(0,t.jsxs)("span",{className:"text-[var(--accent)]",children:[s.accuracy,"%"]})]}),(0,t.jsxs)("span",{className:"text-[var(--text-secondary)]",children:[s.completed,"/5"]})]}),(0,t.jsx)("div",{className:"w-full h-1 bg-[var(--border)] rounded-full mb-4 overflow-hidden",children:(0,t.jsx)("div",{className:"h-full bg-[var(--accent)] transition-all duration-200 rounded-full",style:{width:`${s.completed/5*100}%`}})}),(0,t.jsx)("div",{className:"bg-[var(--bg-primary)]/40 rounded-lg p-4 mb-4 font-mono text-sm leading-relaxed border border-[var(--border)]",children:s.currentSnippet.split("").map((e,a)=>{let r="text-[var(--text-secondary)]";return a<s.userInput.length?r=s.userInput[a]===e?"text-[var(--accent)]":"text-[var(--error)] bg-[var(--error)]/20":a===s.userInput.length&&(r="text-[var(--accent)] border-b border-[var(--accent)] animate-pulse"),(0,t.jsx)("span",{className:r,children:e},a)})}),(0,t.jsx)("input",{ref:n,type:"text",value:s.userInput,onChange:c,className:"w-full bg-[var(--bg-primary)]/30 border border-[var(--border)] rounded-lg px-4 py-2 font-mono text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)]/50 transition-colors",placeholder:s.started?"":"Comece a digitar...",autoComplete:"off",spellCheck:!1}),!s.started&&(0,t.jsx)("p",{className:"font-mono text-[10px] text-[var(--text-secondary)] mt-2 text-center",children:"Digite o código acima o mais rápido possível!"})]})]})},{})},{id:"memory",label:"Memory",icon:"🔲",component:(0,t.jsx)(function(){let[e,r]=(0,a.useState)(3),[s,n]=(0,a.useState)([]),[i,l]=(0,a.useState)([]),[d,m]=(0,a.useState)("idle"),[u,x]=(0,a.useState)(0),[p,h]=(0,a.useState)(0),[f,v]=(0,a.useState)(0),[g,b]=(0,a.useState)("Pressione INICIAR para jogar"),[y,S]=(0,a.useState)(0),N=e*e,j=Math.min(e+u,N-1),M=(0,a.useCallback)(()=>{let t=e*e,a=new Set;for(;a.size<j;)a.add(Math.floor(Math.random()*t));let r=Array.from(a);return{cells:Array.from({length:t},(e,t)=>({index:t,isTarget:a.has(t),revealed:!1,selected:!1,correct:null})),targets:r}},[e,j]),w=(0,a.useCallback)(()=>{let{cells:e,targets:t}=M();e.forEach(e=>{e.isTarget&&(e.revealed=!0)}),n(e),l(t),m("showing"),b("Memorize as células destacadas..."),S(Math.ceil(Math.max(1e3,3e3-200*u)/1e3))},[M,u]);(0,a.useEffect)(()=>{if("showing"!==d)return;let e=setInterval(()=>{S(t=>t<=1?(clearInterval(e),n(e=>e.map(e=>({...e,revealed:!1}))),m("input"),b("Selecione as células que estavam destacadas!"),0):t-1)},1e3);return()=>clearInterval(e)},[d]);let A=(0,a.useCallback)(()=>{r(3),x(0),h(0),b("Nível 1 — Memorize!"),w()},[w]),I=(0,a.useCallback)(t=>{if("input"!==d)return;let a=s[t];if(a.selected||a.revealed)return;let o=i.includes(t);n(e=>e.map((e,a)=>a===t?{...e,selected:!0,correct:o}:e)),o&&h(e=>e+10);let c=s.filter(e=>e.selected).length+1,l=s.filter(e=>e.selected&&e.correct).length+ +!!o;l===j?(m("result"),b("🎯 NÍVEL COMPLETO!"),h(e=>e+50),v(e=>Math.max(e,p+50+10)),setTimeout(()=>{let t=u+1;x(t),t%3==0&&e<5&&r(e=>Math.min(5,e+1)),b(`N\xedvel ${t+1} — Memorize!`),w()},1500)):!o&&c-l>=2&&(m("result"),b(`❌ GAME OVER! Score: ${p}`),n(e=>e.map(e=>({...e,revealed:e.isTarget,correct:!!e.isTarget||!e.selected&&null}))),v(e=>Math.max(e,p)))},[d,s,i,j,u,e,p,w]);return(0,t.jsxs)("div",{className:"py-2",children:[(0,t.jsx)("h3",{className:"font-mono text-sm text-[var(--accent)] mb-4 text-center",children:"🧠 MEMORY MATRIX"}),(0,t.jsxs)("div",{className:"flex justify-between items-center mb-3 px-2 font-mono text-xs",children:[(0,t.jsxs)("span",{className:"text-[var(--text-secondary)]",children:["Nível: ",(0,t.jsx)("span",{className:"text-[var(--accent)]",children:u+1})]}),(0,t.jsxs)("span",{className:"text-[var(--text-secondary)]",children:["Score: ",(0,t.jsx)("span",{className:"text-[var(--accent)]",children:p})]}),(0,t.jsxs)("span",{className:"text-[var(--text-secondary)]",children:["Best: ",(0,t.jsx)("span",{className:"text-[var(--accent-alt)]",children:f})]})]}),(0,t.jsx)("div",{className:"text-center mb-4",children:(0,t.jsx)("p",{className:"font-mono text-sm text-[var(--text-secondary)]",children:"showing"===d?(0,t.jsxs)("span",{className:"text-[var(--accent)] animate-pulse",children:[y,"s restantes..."]}):g})}),(0,t.jsx)("div",{className:"flex justify-center",children:(0,t.jsx)("div",{className:"grid gap-2",style:{gridTemplateColumns:`repeat(${e}, 1fr)`},children:(0,t.jsx)(c.AnimatePresence,{children:s.map(e=>(0,t.jsxs)(o.motion.button,{onClick:()=>I(e.index),disabled:"input"!==d,className:`w-12 h-12 md:w-14 md:h-14 rounded-lg border-2 transition-all duration-200 ${e.revealed?"bg-[var(--accent)]/30 border-[var(--accent)] shadow-[0_0_15px_var(--accent)]":e.selected?e.correct?"bg-[var(--success)]/20 border-[var(--success)]":"bg-[var(--error)]/20 border-[var(--error)]":"input"===d?"bg-[var(--bg-primary)]/40 border-[var(--border)] hover:border-[var(--accent)]/50 hover:bg-[var(--accent)]/10 cursor-pointer":"bg-[var(--bg-primary)]/30 border-[var(--border)] opacity-60"}`,whileHover:"input"===d?{scale:1.05}:{},whileTap:"input"===d?{scale:.95}:{},children:[e.selected&&e.correct&&(0,t.jsx)("span",{className:"text-[var(--success)] text-sm",children:"✓"}),e.selected&&!1===e.correct&&(0,t.jsx)("span",{className:"text-[var(--error)] text-sm",children:"✗"})]},e.index))})})}),("idle"===d||"result"===d)&&(0,t.jsx)("div",{className:"text-center mt-4",children:(0,t.jsx)("button",{onClick:A,className:"px-6 py-2 rounded-lg font-mono text-sm text-[var(--accent)] bg-[var(--accent)]/10 border border-[var(--accent)]/30 hover:bg-[var(--accent)]/20 transition-colors",children:"result"===d?"🔄 REINICIAR":"🚀 INICIAR"})})]})},{})}];function m(){let[e,s]=(0,a.useState)("simon");return(0,t.jsxs)("div",{className:"py-2",children:[(0,t.jsx)("div",{className:"flex gap-1 mb-4 bg-[var(--bg-primary)]/30 rounded-lg p-1 overflow-x-auto",children:d.map(a=>(0,t.jsxs)("button",{onClick:()=>s(a.id),className:`flex-1 min-w-0 px-3 py-2 rounded-md font-mono text-xs transition-all whitespace-nowrap ${e===a.id?"bg-[var(--accent)]/15 text-[var(--accent)] border border-[var(--accent)]/30":"text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border)]/30"}`,children:[(0,t.jsx)("span",{className:"mr-1",children:a.icon}),(0,t.jsx)("span",{className:"inline sm:inline",children:a.label})]},a.id))}),(0,t.jsx)("div",{className:"text-right mb-2",children:(0,t.jsx)("a",{href:{simon:"https://github.com/Samuelfmedeiros/simon-game",asteroid:"https://github.com/Samuelfmedeiros/asteroid-dodge",typing:"https://github.com/Samuelfmedeiros/code-typing",memory:"https://github.com/Samuelfmedeiros/memory-matrix"}[e],target:"_blank",rel:"noopener noreferrer",className:"text-[10px] font-mono text-[var(--text-secondary)]/50 hover:text-[var(--accent)] transition-colors",children:"Ver código no GitHub →"})}),(0,t.jsx)(r.GlassCard,{className:"min-h-[280px]",children:(0,t.jsx)(o.motion.div,{initial:{opacity:0,y:8},animate:{opacity:1,y:0},transition:{duration:.2},children:d.find(t=>t.id===e)?.component},e)})]})}let u=" ╔══════════════════════════════════════╗\n ║     🛰️  MISSION CONTROL  v2.0      ║\n ║     Samuel Medeiros — Dev Full Stack║\n ╚══════════════════════════════════════╝\n\nDigite 'help' ou pressione Tab para autocompletar.\n",x="C:\\Users\\Visitor",p=["help","ajuda","sobre","projetos","habilidades","contato","limpar","clear","cls","hora","date","whoami","theme","fix","run","matrix","sudo","stack","github","neofetch","uptime","ls","echo","banner","quote","exit","ipconfig","ping","cowsay","whois","pwd","holofote","skills"];e.s(["Terminal",0,function(){let[e,o]=(0,a.useState)(""),[n,i]=(0,a.useState)([{cmd:"",output:u}]),c=(0,a.useRef)(null),l=(0,a.useRef)(null),d=(0,a.useRef)([]),[h,f]=(0,a.useState)(-1),[v,g]=(0,a.useState)(!1),{toggle:b}=(0,s.useTheme)();return(0,a.useEffect)(()=>{l.current?.scrollTo(0,l.current.scrollHeight)},[n]),(0,t.jsxs)("section",{id:"terminal",className:"py-8 md:py-12 px-4 md:px-6",children:[(0,t.jsx)("h2",{className:"text-3xl font-mono text-[var(--accent)] mb-12 text-center",id:"terminal-heading",children:"▸ TERMINAL"}),(0,t.jsxs)(r.GlassCard,{className:"max-w-3xl mx-auto font-mono text-sm",role:"region","aria-labelledby":"terminal-heading",children:[(0,t.jsx)("div",{ref:l,className:"h-48 sm:h-64 md:h-80 overflow-y-auto mb-4 p-4 rounded-lg bg-[var(--bg-primary)]/30 text-[var(--text-primary)] scroll-smooth",children:n.map((e,a)=>(0,t.jsxs)("div",{className:"mb-2",children:[e.cmd&&(0,t.jsxs)("div",{className:"text-[var(--accent)]",children:[(0,t.jsxs)("span",{className:"text-[var(--accent)]",children:[x,">"]})," ",e.cmd]}),(0,t.jsx)("pre",{className:"text-xs text-[var(--text-secondary)] whitespace-pre-wrap mt-1",children:e.output})]},a))}),(0,t.jsxs)("div",{className:"flex items-center gap-2 text-[var(--accent)]",children:[(0,t.jsxs)("span",{className:"text-[var(--accent)] shrink-0",children:[x,">"]}),(0,t.jsx)("input",{ref:c,type:"text",value:e,onChange:e=>o(e.target.value),onKeyDown:t=>{if("Enter"===t.key&&e.trim()){d.current.push(e),f(-1),(e=>{let t=e.replace(/[<>]/g,"").replace(/javascript:/gi,"").replace(/on\w+=/gi,"").replace(/[\x00-\x1F\x7F-\x9F]/g,"").slice(0,500).trim().toLowerCase(),a="";switch(t){case"help":case"ajuda":a=`COMANDOS DISPON\xcdVEIS:
  ajuda         — Mostra esta mensagem
  sobre         — Sobre Samuel
  projetos      — Lista de projetos
  habilidades   — Habilidades t\xe9cnicas
  skills        — N\xedvel de profici\xeancia em cada skill
  contato       — Informa\xe7\xf5es de contato
  limpar        — Limpa o terminal
  hora          — Data e hora atual
  date          — Data formatada completa
  whoami        — Nome do usu\xe1rio
  theme         — Alterna o tema
  stack         — Tech stack do projeto
  github        — Info do GitHub
  neofetch      — System info estilo neofetch
  uptime        — Sess\xe3o uptime
  ls            — Lista arquivos do diret\xf3rio
  pwd           — Mostra diret\xf3rio atual
  echo <text>   — Repete o texto
  banner        — Mostra o banner
  quote         — Cita\xe7\xe3o inspiradora aleat\xf3ria
  ipconfig      — Informa\xe7\xf5es de rede
  ping <host>   — Ping em um servidor
  whois <nome>  — Informa\xe7\xf5es sobre algu\xe9m
  cowsay        — Vaca falante 🐄
  holofote      — Coloca Samuel no holofote

⚡ EASTER EGGS (para devs):
  fix path_variables        — Repara vari\xe1veis do Windows
  run routine:lights_out    — Modo Noturno M\xe1ximo
  matrix                     — Efeito Matrix
  sudo rm -rf /             — ⚠️ N\xe3o fa\xe7a isso`;break;case"sobre":a=`Samuel Medeiros
Analista de Dados — Bras\xedlia/DF

Especialidades:
  • Power BI, SQL, DAX
  • Python, Pandas, Machine Learning
  • ETL e automa\xe7\xe3o
  • IA Generativa e LLMs

Forma\xe7\xe3o:
  • P\xf3s-gradua\xe7\xe3o em Banco de Dados e BI — IESB
  • An\xe1lise e Desenvolvimento de Sistemas — IESB

Experi\xeancia:
  • ANA (Ag\xeancia Nacional de \xc1guas)
  • Global Hitss
  • TRT 10\xaa Regi\xe3o`;break;case"projetos":a=`PROJETOS:
  🐾 DogWalk        — Plataforma de passeio de c\xe3es (Next.js + Supabase)
  🛰️ Mission Control — Este portf\xf3lio (Next.js + Framer Motion)
  📊 ANA Dashboards  — Dashboards de dados (Power BI + SQL)`;break;case"habilidades":a=`HABILIDADES:
  [Linguagens]    Python, SQL, TypeScript
  [BI/Analytics] Power BI, Excel, Power Query, DAX
  [ML/IA]         Scikit-learn, Pandas, LLMs
  [Web]           Next.js, React, Tailwind CSS
  [Banco]         PostgreSQL, Supabase, MySQL
  [Ferramentas]   Docker, Git, Linux, Azure`;break;case"contato":a=`CONTATO:
  📧 Email:    samuelandrademedeiros@gmail.com
  💼 LinkedIn: linkedin.com/in/samuelandrademedeiros
  🐙 GitHub:   github.com/Samuelfmedeiros
  📱 WhatsApp: wa.me/556191191722`;break;case"limpar":case"clear":case"cls":case"clear":case"limpar":i([]);return;case"hora":a=`Hor\xe1rio: ${new Date().toLocaleString("pt-BR")}`;break;case"whoami":a="Samuel Medeiros";break;case"date":a=`Data atual: ${new Date().toLocaleDateString("pt-BR",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}
Hor\xe1rio: ${new Date().toLocaleTimeString("pt-BR")}`;break;case"uptime":let r=Math.floor(Math.floor((Date.now()-performance.now())/1e3)/60);a=`Session uptime: ${r} min`;break;case"stack":a=`TECH STACK:
  Frontend:  Next.js 16, React 19, TypeScript, Tailwind CSS 4
  Anima\xe7\xf5es: Framer Motion, Lucide Icons
  Backend:   Supabase (PostgreSQL), Cloudflare Workers
  Testes:    Vitest, Playwright
  Deploy:    Cloudflare Pages, Vercel
  CI/CD:     GitHub Actions`;break;case"github":a=`GitHub: github.com/Samuelfmedeiros
  Repos p\xfablicos: mission-control, dog-walk e mais
  Linguagens: TypeScript, Python, SQL, JavaScript
  Contribui\xe7\xf5es: Frequentes`;break;case"neofetch":a=`
        ╭───────────────╮         samuel@portfolio
        │   🛰️  MC v2  │         ──────────────────
        │  Mission Ctrl │         OS: Web (Next.js 16)
        ╰───────────────╯         Host: ${"u">typeof navigator?navigator.platform:"unknown"}
                                  Shell: Terminal React
                                  Theme: ${"u">typeof document?document.documentElement.classList.contains("theme-dark")?"Night Vision":"Daylight Ops":"unknown"}
                                  CPU: ${"u">typeof navigator?navigator.hardwareConcurrency||"??":"?"} cores
                                  Memory: ${"u">typeof navigator&&navigator.deviceMemory?navigator.deviceMemory+"GB":"??"}
                                  Browser: ${"u">typeof navigator&&navigator.userAgent.split(" ").pop()||"unknown"}`;break;case"theme":b(),a="Tema alternado com sucesso.";break;case"fix path_variables":a=`> Iniciando reparo do PATH...
> Escaneando vari\xe1veis de ambiente corrompidas...

[OK] USERPROFILE = C:\\Users\\Samuel
[OK] APPDATA = C:\\Users\\Samuel\\AppData\\Roaming
[OK] PATH restaurado para valores padr\xe3o
[WARN] NODE_PATH estava pointing para C:\\Python27
[FIX] Corrigido NODE_PATH -> C:\\Program Files\\nodejs
[OK] JAVA_HOME = C:\\Program Files\\Java\\jdk-17

> Processando... 100%
✅ PATH_variables reparado com sucesso!`;break;case"run routine:lights_out":a=`> Executando rotina LIGHTS_OUT...
> Simulando falha de energia...

█▓▒░ ░▒▓█

> WARNING: Todos os sistemas offline
> BACKUP: Energia de emerg\xeancia ativada
> Modo Noturno M\xe1ximo ATIVADO

✨ Screen brightness: 0%
✨ Animations: disabled
✨ Terminal: HIGH CONTRAST

> Miss\xe3o cumprida, operador.`,document.documentElement.classList.add("lights-out"),setTimeout(()=>document.documentElement.classList.remove("lights-out"),5e3);break;case"matrix":a=`> Iniciando efeito MATRIX...
> Conectando \xe0 fonte de dados...

████████████████████████████
██ 01001000 01100101 01101100 ██
██ 01101100 01101111 00100000 ██
██ 01010100 01100101 01100011 ██
████████████████████████████

> Acesso concedido.
> Bem-vindo ao sistema, Sr. Anderson.`;break;case"sudo rm -rf /":a=`> sudo: acesso root requerido
> 
> ⚠️ ALERTA DE SEGURAN\xc7A ⚠️
> Tentativa de deletar o universo detectada!
> 
> Bloqueando...
> 
> 🙃 Calma, visitante. 
> Isso aqui \xe9 s\xf3 um portf\xf3lio.
> N\xe3o vou deixar voc\xea deletar minha carreira.`;break;case"fix":a=`Uso: fix <componente>
Exemplo: fix path_variables`;break;case"run":a=`Uso: run routine:<nome>
Exemplo: run routine:lights_out`;break;case"sudo":a=`Acesso negado. Este terminal n\xe3o tem privil\xe9gios de root.
(Porque isso \xe9 um portf\xf3lio, n\xe3o um servidor de produ\xe7\xe3o.)`;break;case"ls":a=` Volume in drive C \xe9 WINDOWS
 Volume Serial Number: MC-2026

 Directory of C:\\Users\\Visitor\\

2026-05-27  10:30    <DIR>          .
2026-05-27  10:30    <DIR>          ..
2026-05-27  10:30    <DIR>          Documents
2026-05-27  10:30    <DIR>          Projects
2026-05-27  10:30    <DIR>          Downloads
2026-05-27  10:30    <DIR>          Desktop
2026-05-27  10:30    <DIR>          Music
               0 File(s)              0 bytes
               7 Dir(s)   ∞ bytes free`;break;case"pwd":a=x;break;case"skills":a=`PROFICI\xcaNCIA EM HABILIDADES:

  Power BI           ████████████████████████░  95%  Expert
  SQL & PostgreSQL   ████████████████████████░  95%  Expert
  Python             ████████████████████░░░░░  78%  Advanced
  Machine Learning   ████████████████████░░░░░  78%  Advanced
  Next.js & React    ████████████████████░░░░░  78%  Advanced
  LLMs Locais        ██████████████████░░░░░░░  60%  Proficient
  Docker             ██████████████████░░░░░░░  60%  Proficient
  Git & GitHub       ████████████████████░░░░░  78%  Advanced`;break;case"banner":a=u;break;case"quote":{let e=['"A melhor maneira de prever o futuro é criá-lo." — Peter Drucker','"Dados são o novo petróleo." — Clive Humby','"Sem dados, você é apenas mais uma pessoa com uma opinião." — W. Edwards Deming','"A simplicidade é a sofisticação máxima." — Leonardo da Vinci','"O único jeito de fazer um ótimo trabalho é amar o que você faz." — Steve Jobs','"Não é o mais forte que sobrevive, mas o que melhor se adapta." — Charles Darwin','"A tecnologia move o mundo." — Steve Jobs','"Transformar problemas em oportunidades é a essência da inovação." — Samuel Medeiros','"O sucesso é a soma de pequenos esforços repetidos dia após dia." — Robert Collier','"Se você pode medir, você pode gerenciar." — Peter Drucker'];a=`📜 ${e[Math.floor(Math.random()*e.length)]}`;break}case"ipconfig":a=`Windows IP Configuration

Ethernet adapter Ethernet0:
   Connection-specific DNS Suffix  . : local
   IPv4 Address. . . . . . . . . . . : 192.168.${Math.floor(255*Math.random())}.${Math.floor(255*Math.random())}
   Subnet Mask . . . . . . . . . . . : 255.255.255.0
   Default Gateway . . . . . . . . . : 192.168.1.1

Wireless LAN adapter Wi-Fi:
   Connection-specific DNS Suffix  . : local
   IPv4 Address. . . . . . . . . . . : 10.0.${Math.floor(255*Math.random())}.${Math.floor(255*Math.random())}
   Subnet Mask . . . . . . . . . . . : 255.0.0.0
   Default Gateway . . . . . . . . . : 10.0.0.1

   🛰️ Mission Control Signal: ❚❚❚❚❚❚❚❚❚❚ 100%`;break;case"exit":a=`> Encerrando sess\xe3o...
> Salvando configura\xe7\xf5es...
> 
> Obrigado por visitar! Volte sempre 🚀
> 
> (Dica: Feche esta aba se quiser sair de verdade.)`;break;case"holofote":a=`
╔══════════════════════════════════════════════════════╗
║                                                      ║
║     ☆  ☆  ☆  ☆  ☆  ☆  ☆  ☆  ☆  ☆  ☆  ☆  ☆       ║
║                                                      ║
║          🎯  S A M U E L  M E D E I R O S  🎯        ║
║                                                      ║
║     ☆  ☆  ☆  ☆  ☆  ☆  ☆  ☆  ☆  ☆  ☆  ☆  ☆       ║
║                                                      ║
║     Desenvolvedor Full Stack & Analista de Dados     ║
║     Transformando dados em decisoes estrategicas     ║
║                                                      ║
╚══════════════════════════════════════════════════════╝`;break;default:if(t.startsWith("echo ")){a=t.slice(5);break}if(t.startsWith("ping ")){let e=t.slice(5)||"localhost",r=Math.floor(40*Math.random()+10);a=`Pinging ${e} [192.168.1.${Math.floor(254*Math.random())}] with 32 bytes of data:
Reply from 192.168.1.1: bytes=32 time=${r}ms TTL=64
Reply from 192.168.1.1: bytes=32 time=${r+5}ms TTL=64
Reply from 192.168.1.1: bytes=32 time=${r-3}ms TTL=64
Reply from 192.168.1.1: bytes=32 time=${r+2}ms TTL=64

Ping statistics for 192.168.1.${Math.floor(254*Math.random())}:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
Approximate round trip times in milli-seconds:
    Minimum = ${r-3}ms, Maximum = ${r+5}ms, Average = ${Math.floor(r+1)}ms`;break}if(t.startsWith("whois ")){let e=t.slice(6);a=`WHOIS lookup for "${e}"...

  Nome: ${e}
  Cargo: Analista de Dados / Desenvolvedor Full Stack
  Localiza\xe7\xe3o: Bras\xedlia, DF — Brasil
  Expertise: Power BI, SQL, Python, Machine Learning
  Contato: samuelandrademedeiros@gmail.com
  GitHub: github.com/Samuelfmedeiros
  LinkedIn: linkedin.com/in/samuelandrademedeiros

  [Resultados obtidos do registro WHOIS interno]`;break}if(t.startsWith("cowsay ")){let e=t.slice(7)||"Moo!",r=Math.max(e.length,4),s="─".repeat(r);a=` ┌${s}┐
 │ ${e.padEnd(r-1)} │
 └${s}┘
  \\   ^__^
   \\  (oo)\\_______
      (__)\\       )\\/\\
          ||----w |
          ||     ||`;break}if(t.startsWith("cowsay")){a=` ┌────┐
 │ Moo! │
 └────┘
  \\   ^__^
   \\  (oo)\\_______
      (__)\\       )\\/\\
          ||----w |
          ||     ||`;break}a=`Comando n\xe3o encontrado: '${t}'
Digite 'ajuda' para ver os comandos dispon\xedveis.`}i(t=>[...t,{cmd:e,output:a}])})(e),o("");return}if("ArrowUp"===t.key){if(t.preventDefault(),0===d.current.length)return;let e=-1===h?d.current.length-1:Math.max(0,h-1);f(e),o(d.current[e]);return}if("ArrowDown"===t.key){if(t.preventDefault(),0===d.current.length||-1===h)return;let e=h+1;e>=d.current.length?(f(-1),o("")):(f(e),o(d.current[e]));return}if("Tab"===t.key){t.preventDefault();let a=e.trim().toLowerCase();if(!a)return;let r=p.filter(e=>e.startsWith(a));if(0===r.length)return;if(1===r.length)o(r[0]);else{let e=r.reduce((e,t)=>{let a=0;for(;a<e.length&&a<t.length&&e[a]===t[a];)a++;return e.slice(0,a)});e.length>a.length?o(e):i(e=>[...e,{cmd:`${a}	`,output:r.join("  ")}])}}},onFocus:()=>g(!0),onBlur:()=>g(!1),className:`flex-1 bg-transparent outline-none text-[var(--text-primary)] font-mono text-sm ${v?"caret-[var(--accent)]":""}`,placeholder:"digite um comando...","aria-label":"Digite um comando",role:"textbox",autoFocus:!0})]})]}),(0,t.jsx)("div",{className:"max-w-3xl mx-auto mt-8",children:(0,t.jsx)(m,{})})]})}],6203)}]);