module.exports=[72282,a=>{"use strict";var b=a.i(87924),c=a.i(72131),d=a.i(51709),e=a.i(1221),f=a.i(46271);let g=["#ef4444","#22c55e","#3b82f6","#f59e0b"],h=["VERMELHO","VERDE","AZUL","AMARELO"];var i=a.i(62036);let j=["const [data, setData] = useState([])","export async function GET(req) {","SELECT * FROM users WHERE active = true","SELECT name, COUNT(*) FROM projects GROUP BY name","if (error) return NextResponse.json({ error })",'await fetch("/api/data").then(r => r.json())',"CREATE TABLE missions (id SERIAL PRIMARY KEY)","function fibonacci(n) { return n <= 1 ? n : fibonacci(n-1) + fibonacci(n-2) }",'df.groupby("category").sum().sort_values("total")',"npm run build && npm run deploy","docker-compose up -d --build","git push origin main --force-with-lease",'import { createClient } from "@supabase/supabase-js"','const api = new Hono().get("/health", (c) => c.json({ ok: true }))','UPDATE missions SET status = "complete" WHERE id = 42'],k=[{id:"simon",label:"Sequência",icon:"🧠",component:(0,b.jsx)(function(){let[a,d]=(0,c.useState)([]),[e,f]=(0,c.useState)(!1),[i,j]=(0,c.useState)(null),[k,l]=(0,c.useState)(0),[m,n]=(0,c.useState)("idle"),o=(0,c.useRef)(0),p=(0,c.useCallback)(()=>{d([Math.floor(4*Math.random())]),l(0),n("showing"),o.current=0},[]),q=(0,c.useCallback)(async()=>{for(let b=0;b<a.length;b++)await new Promise(a=>setTimeout(a,400)),j(a[b]),await new Promise(a=>setTimeout(a,300)),j(null);f(!0),n("playing"),o.current=0},[a]);(0,c.useEffect)(()=>{"showing"===m&&a.length>0&&q()},[m,a,q]);let r=(0,c.useCallback)(b=>{if(e&&"playing"===m){if(j(b),setTimeout(()=>j(null),250),b!==a[o.current]){n("gameover"),f(!1);return}if(o.current+=1,o.current===a.length){f(!1),l(a=>a+1);let a=Math.floor(4*Math.random());d(b=>[...b,a]),n("showing")}}},[e,m,a]);return(0,b.jsxs)("div",{className:"flex flex-col items-center gap-3 py-2",children:[(0,b.jsxs)("p",{className:"font-mono text-xs text-[var(--text-secondary)]",children:["idle"===m&&"Clique em Iniciar para jogar!","showing"===m&&"👀 Observe a sequência...","playing"===m&&"🎯 Repita a sequência!","gameover"===m&&`💀 Game Over! Pontua\xe7\xe3o: ${k}`]}),(0,b.jsx)("div",{className:"grid grid-cols-2 gap-2 w-40 h-40",children:g.map((a,c)=>(0,b.jsx)("button",{onClick:()=>r(c),disabled:"playing"!==m,className:`rounded-xl transition-all duration-150 ${i===c?"scale-110 brightness-150 shadow-lg shadow-white/20":"brightness-75 hover:brightness-100"} ${"playing"===m?"cursor-pointer":"cursor-default"}`,style:{backgroundColor:a},"aria-label":h[c]},c))}),(0,b.jsxs)("p",{className:"font-mono text-lg font-bold text-[var(--accent)]",children:["Score: ",k]}),"idle"===m||"gameover"===m?(0,b.jsx)("button",{onClick:p,className:"px-4 py-2 rounded-lg bg-[var(--accent)] text-white font-mono text-xs hover:brightness-110 transition-all",children:"gameover"===m?"🔄 Tentar Novamente":"▶ Iniciar Jogo"}):null]})},{})},{id:"asteroid",label:"Asteroids",icon:"🚀",component:(0,b.jsx)(function(){let[a,d]=(0,c.useState)([]),[e,g]=(0,c.useState)(50),[h,j]=(0,c.useState)(0),[k,l]=(0,c.useState)(!1),[m,n]=(0,c.useState)(!1),[o,p]=(0,c.useState)(0),q=(0,c.useRef)(null),r=(0,c.useRef)(0),s=(0,c.useRef)(0),t=(0,c.useRef)(0),u=(0,c.useCallback)(()=>{let a={id:Date.now()+Math.random(),x:90*Math.random()+5,y:-5,size:20*Math.random()+15,speed:2*Math.random()+1.5+.02*t.current,rotation:360*Math.random()};d(b=>[...b,a])},[]),v=(0,c.useCallback)((a,b)=>{let c=a.x-a.size/10,d=a.x+a.size/10,e=a.y+a.size/10,f=a.y-a.size/10;return b+4>c&&b-4<d&&85<e&&90>f},[]);(0,c.useEffect)(()=>{if(!m||k)return;let a=performance.now(),b=c=>{let f=(c-a)/16;a=c,c-s.current>Math.max(400,1e3-20*t.current)&&(u(),s.current=c),j(a=>{let b=a+Math.round(f);return t.current=b,b}),d(a=>{let b=a.map(a=>({...a,y:a.y+a.speed*f})).filter(a=>!(a.y>105));for(let a of b)if(v(a,e)){l(!0),p(a=>Math.max(a,t.current));break}return b}),r.current=requestAnimationFrame(b)};return r.current=requestAnimationFrame(b),()=>cancelAnimationFrame(r.current)},[m,k,e,u,v]);let w=(0,c.useCallback)(()=>{d([]),j(0),l(!1),n(!0),t.current=0,s.current=performance.now()},[]);return(0,b.jsxs)("div",{className:"py-2",children:[(0,b.jsx)("h3",{className:"font-mono text-sm text-[var(--accent)] mb-4 text-center",children:"🚀 ASTEROID DODGE"}),(0,b.jsxs)("div",{className:"flex justify-between items-center mb-3 px-2",children:[(0,b.jsxs)("p",{className:"font-mono text-xs text-[var(--text-secondary)]",children:["Score: ",(0,b.jsx)("span",{className:"text-[var(--accent)]",children:h})]}),(0,b.jsxs)("p",{className:"font-mono text-xs text-[var(--text-secondary)]",children:["Best: ",(0,b.jsx)("span",{className:"text-[var(--accent-alt)]",children:o})]})]}),(0,b.jsxs)("div",{ref:q,onClick:a=>{if(!q.current||k)return;let b=q.current.getBoundingClientRect();g(Math.max(5,Math.min(95,(a.clientX-b.left)/b.width*100)))},onTouchMove:a=>{if(!q.current||k)return;let b=q.current.getBoundingClientRect();g(Math.max(5,Math.min(95,(a.touches[0].clientX-b.left)/b.width*100)))},className:"relative w-full h-48 rounded-lg overflow-hidden bg-[var(--bg-primary)]/50 border border-[var(--border)] cursor-crosshair select-none",children:[(0,b.jsx)("div",{className:"absolute inset-0",children:Array.from({length:20}).map((a,c)=>(0,b.jsx)("div",{className:"absolute w-0.5 h-0.5 rounded-full bg-[var(--accent)]/20",style:{left:`${100*Math.random()}%`,top:`${100*Math.random()}%`}},c))}),(0,b.jsx)(f.motion.div,{className:"absolute bottom-2 text-lg",style:{left:`${e}%`,transform:"translateX(-50%)"},animate:{scale:k?[1,1.5,0]:1},transition:{duration:.3},children:"🛸"}),(0,b.jsx)(i.AnimatePresence,{children:a.map(a=>(0,b.jsx)(f.motion.div,{initial:{opacity:0,scale:0},animate:{opacity:1,scale:1},exit:{opacity:0,scale:0},className:"absolute text-[var(--error)] font-bold",style:{left:`${a.x}%`,top:`${a.y}%`,fontSize:`${a.size}px`,transform:"translate(-50%, -50%)"},children:"🪨"},a.id))}),(!m||k)&&(0,b.jsx)("div",{className:"absolute inset-0 flex items-center justify-center bg-[var(--bg-primary)]/70 backdrop-blur-sm",children:(0,b.jsxs)("div",{className:"text-center",children:[k&&(0,b.jsxs)("p",{className:"font-mono text-sm text-[var(--error)] mb-2",children:["💥 GAME OVER! Score: ",h]}),(0,b.jsx)("button",{onClick:a=>{a.stopPropagation(),w()},className:"px-6 py-2 rounded-lg font-mono text-sm text-[var(--accent)] bg-[var(--accent)]/10 border border-[var(--accent)]/30 hover:bg-[var(--accent)]/20 transition-colors",children:m?"🔄 REINICIAR":"🚀 INICIAR"}),!m&&(0,b.jsx)("p",{className:"font-mono text-[10px] text-[var(--text-secondary)] mt-2",children:"Clique/toque para mover a nave"})]})})]})]})},{})},{id:"typing",label:"Code Type",icon:"⌨️",component:(0,b.jsx)(function(){var a;let d,[e,f]=(0,c.useState)({currentSnippet:j[Math.floor(Math.random()*j.length)],userInput:"",startTime:null,wpm:0,accuracy:100,completed:0,started:!1,finished:!1,timer:0}),g=(0,c.useRef)(null),h=(0,c.useRef)(null);(0,c.useEffect)(()=>{if(e.started&&!e.finished)return h.current=setInterval(()=>{f(a=>({...a,timer:a.timer+1}))},1e3),()=>{h.current&&clearInterval(h.current)}},[e.started,e.finished]),(0,c.useEffect)(()=>{if(e.startTime&&!e.finished){let a=(Date.now()-e.startTime)/6e4,b=e.userInput.length/5,c=a>0?Math.round(b/a):0;f(a=>({...a,wpm:c}))}},[e.userInput,e.startTime,e.finished]),(0,c.useEffect)(()=>{if(0===e.userInput.length)return void f(a=>({...a,accuracy:100}));let a=0;for(let b=0;b<e.userInput.length;b++)e.userInput[b]===e.currentSnippet[b]&&a++;let b=Math.round(a/e.userInput.length*100);f(a=>({...a,accuracy:b}))},[e.userInput,e.currentSnippet]);let i=(0,c.useCallback)(a=>{let b=a.target.value;if(e.started?f(a=>({...a,userInput:b})):f(a=>({...a,started:!0,startTime:Date.now(),userInput:b})),b===e.currentSnippet){let a=e.completed+1,b=j[Math.floor(Math.random()*j.length)];f(c=>({...c,userInput:"",currentSnippet:b,completed:a,finished:a>=5}))}},[e.started,e.currentSnippet,e.completed]),k=(0,c.useCallback)(()=>{f({currentSnippet:j[Math.floor(Math.random()*j.length)],userInput:"",startTime:null,wpm:0,accuracy:100,completed:0,started:!1,finished:!1,timer:0}),g.current?.focus()},[]);return(0,b.jsxs)("div",{className:"py-2",children:[(0,b.jsx)("h3",{className:"font-mono text-sm text-[var(--accent)] mb-4 text-center",children:"⌨️ CODE TYPING CHALLENGE"}),e.finished?(0,b.jsxs)("div",{className:"text-center space-y-3 py-4",children:[(0,b.jsx)("p",{className:"font-mono text-lg text-[var(--accent)]",children:"🏆 MISSÃO CUMPRIDA!"}),(0,b.jsxs)("div",{className:"grid grid-cols-3 gap-4 font-mono text-xs",children:[(0,b.jsxs)("div",{children:[(0,b.jsx)("p",{className:"text-[var(--text-secondary)]",children:"WPM"}),(0,b.jsx)("p",{className:"text-[var(--accent)] text-lg",children:e.wpm})]}),(0,b.jsxs)("div",{children:[(0,b.jsx)("p",{className:"text-[var(--text-secondary)]",children:"Precisão"}),(0,b.jsxs)("p",{className:"text-[var(--accent)] text-lg",children:[e.accuracy,"%"]})]}),(0,b.jsxs)("div",{children:[(0,b.jsx)("p",{className:"text-[var(--text-secondary)]",children:"Tempo"}),(0,b.jsx)("p",{className:"text-[var(--accent)] text-lg",children:(d=Math.floor((a=e.timer)/60),`${d}:${(a%60).toString().padStart(2,"0")}`)})]})]}),(0,b.jsx)("button",{onClick:k,className:"px-6 py-2 rounded-lg font-mono text-sm text-[var(--accent)] bg-[var(--accent)]/10 border border-[var(--accent)]/30 hover:bg-[var(--accent)]/20 transition-colors",children:"🔄 JOGAR NOVAMENTE"})]}):(0,b.jsxs)(b.Fragment,{children:[(0,b.jsxs)("div",{className:"flex justify-between items-center mb-3 px-2 font-mono text-xs",children:[(0,b.jsxs)("span",{className:"text-[var(--text-secondary)]",children:["WPM: ",(0,b.jsx)("span",{className:"text-[var(--accent)]",children:e.wpm})]}),(0,b.jsxs)("span",{className:"text-[var(--text-secondary)]",children:["Precisão: ",(0,b.jsxs)("span",{className:"text-[var(--accent)]",children:[e.accuracy,"%"]})]}),(0,b.jsxs)("span",{className:"text-[var(--text-secondary)]",children:[e.completed,"/5"]})]}),(0,b.jsx)("div",{className:"w-full h-1 bg-[var(--border)] rounded-full mb-4 overflow-hidden",children:(0,b.jsx)("div",{className:"h-full bg-[var(--accent)] transition-all duration-200 rounded-full",style:{width:`${e.completed/5*100}%`}})}),(0,b.jsx)("div",{className:"bg-[var(--bg-primary)]/40 rounded-lg p-4 mb-4 font-mono text-sm leading-relaxed border border-[var(--border)]",children:e.currentSnippet.split("").map((a,c)=>{let d="text-[var(--text-secondary)]";return c<e.userInput.length?d=e.userInput[c]===a?"text-[var(--accent)]":"text-[var(--error)] bg-[var(--error)]/20":c===e.userInput.length&&(d="text-[var(--accent)] border-b border-[var(--accent)] animate-pulse"),(0,b.jsx)("span",{className:d,children:a},c)})}),(0,b.jsx)("input",{ref:g,type:"text",value:e.userInput,onChange:i,className:"w-full bg-[var(--bg-primary)]/30 border border-[var(--border)] rounded-lg px-4 py-2 font-mono text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)]/50 transition-colors",placeholder:e.started?"":"Comece a digitar...",autoComplete:"off",spellCheck:!1}),!e.started&&(0,b.jsx)("p",{className:"font-mono text-[10px] text-[var(--text-secondary)] mt-2 text-center",children:"Digite o código acima o mais rápido possível!"})]})]})},{})},{id:"memory",label:"Memory",icon:"🔲",component:(0,b.jsx)(function(){let[a,d]=(0,c.useState)(3),[e,g]=(0,c.useState)([]),[h,j]=(0,c.useState)([]),[k,l]=(0,c.useState)("idle"),[m,n]=(0,c.useState)(0),[o,p]=(0,c.useState)(0),[q,r]=(0,c.useState)(0),[s,t]=(0,c.useState)("Pressione INICIAR para jogar"),[u,v]=(0,c.useState)(0),w=a*a,x=Math.min(a+m,w-1),y=(0,c.useCallback)(()=>{let b=a*a,c=new Set;for(;c.size<x;)c.add(Math.floor(Math.random()*b));let d=Array.from(c);return{cells:Array.from({length:b},(a,b)=>({index:b,isTarget:c.has(b),revealed:!1,selected:!1,correct:null})),targets:d}},[a,x]),z=(0,c.useCallback)(()=>{let{cells:a,targets:b}=y();a.forEach(a=>{a.isTarget&&(a.revealed=!0)}),g(a),j(b),l("showing"),t("Memorize as células destacadas..."),v(Math.ceil(Math.max(1e3,3e3-200*m)/1e3))},[y,m]);(0,c.useEffect)(()=>{if("showing"!==k)return;let a=setInterval(()=>{v(b=>b<=1?(clearInterval(a),g(a=>a.map(a=>({...a,revealed:!1}))),l("input"),t("Selecione as células que estavam destacadas!"),0):b-1)},1e3);return()=>clearInterval(a)},[k]);let A=(0,c.useCallback)(()=>{d(3),n(0),p(0),t("Nível 1 — Memorize!"),z()},[z]),B=(0,c.useCallback)(b=>{if("input"!==k)return;let c=e[b];if(c.selected||c.revealed)return;let f=h.includes(b);g(a=>a.map((a,c)=>c===b?{...a,selected:!0,correct:f}:a)),f&&p(a=>a+10);let i=e.filter(a=>a.selected).length+1,j=e.filter(a=>a.selected&&a.correct).length+ +!!f;j===x?(l("result"),t("🎯 NÍVEL COMPLETO!"),p(a=>a+50),r(a=>Math.max(a,o+50+10)),setTimeout(()=>{let b=m+1;n(b),b%3==0&&a<5&&d(a=>Math.min(5,a+1)),t(`N\xedvel ${b+1} — Memorize!`),z()},1500)):!f&&i-j>=2&&(l("result"),t(`❌ GAME OVER! Score: ${o}`),g(a=>a.map(a=>({...a,revealed:a.isTarget,correct:!!a.isTarget||!a.selected&&null}))),r(a=>Math.max(a,o)))},[k,e,h,x,m,a,o,z]);return(0,b.jsxs)("div",{className:"py-2",children:[(0,b.jsx)("h3",{className:"font-mono text-sm text-[var(--accent)] mb-4 text-center",children:"🧠 MEMORY MATRIX"}),(0,b.jsxs)("div",{className:"flex justify-between items-center mb-3 px-2 font-mono text-xs",children:[(0,b.jsxs)("span",{className:"text-[var(--text-secondary)]",children:["Nível: ",(0,b.jsx)("span",{className:"text-[var(--accent)]",children:m+1})]}),(0,b.jsxs)("span",{className:"text-[var(--text-secondary)]",children:["Score: ",(0,b.jsx)("span",{className:"text-[var(--accent)]",children:o})]}),(0,b.jsxs)("span",{className:"text-[var(--text-secondary)]",children:["Best: ",(0,b.jsx)("span",{className:"text-[var(--accent-alt)]",children:q})]})]}),(0,b.jsx)("div",{className:"text-center mb-4",children:(0,b.jsx)("p",{className:"font-mono text-sm text-[var(--text-secondary)]",children:"showing"===k?(0,b.jsxs)("span",{className:"text-[var(--accent)] animate-pulse",children:[u,"s restantes..."]}):s})}),(0,b.jsx)("div",{className:"flex justify-center",children:(0,b.jsx)("div",{className:"grid gap-2",style:{gridTemplateColumns:`repeat(${a}, 1fr)`},children:(0,b.jsx)(i.AnimatePresence,{children:e.map(a=>(0,b.jsxs)(f.motion.button,{onClick:()=>B(a.index),disabled:"input"!==k,className:`w-12 h-12 md:w-14 md:h-14 rounded-lg border-2 transition-all duration-200 ${a.revealed?"bg-[var(--accent)]/30 border-[var(--accent)] shadow-[0_0_15px_var(--accent)]":a.selected?a.correct?"bg-[var(--success)]/20 border-[var(--success)]":"bg-[var(--error)]/20 border-[var(--error)]":"input"===k?"bg-[var(--bg-primary)]/40 border-[var(--border)] hover:border-[var(--accent)]/50 hover:bg-[var(--accent)]/10 cursor-pointer":"bg-[var(--bg-primary)]/30 border-[var(--border)] opacity-60"}`,whileHover:"input"===k?{scale:1.05}:{},whileTap:"input"===k?{scale:.95}:{},children:[a.selected&&a.correct&&(0,b.jsx)("span",{className:"text-[var(--success)] text-sm",children:"✓"}),a.selected&&!1===a.correct&&(0,b.jsx)("span",{className:"text-[var(--error)] text-sm",children:"✗"})]},a.index))})})}),("idle"===k||"result"===k)&&(0,b.jsx)("div",{className:"text-center mt-4",children:(0,b.jsx)("button",{onClick:A,className:"px-6 py-2 rounded-lg font-mono text-sm text-[var(--accent)] bg-[var(--accent)]/10 border border-[var(--accent)]/30 hover:bg-[var(--accent)]/20 transition-colors",children:"result"===k?"🔄 REINICIAR":"🚀 INICIAR"})})]})},{})}];function l(){let[a,e]=(0,c.useState)("simon");return(0,b.jsxs)("div",{className:"py-2",children:[(0,b.jsx)("div",{className:"flex gap-1 mb-4 bg-[var(--bg-primary)]/30 rounded-lg p-1 overflow-x-auto",children:k.map(c=>(0,b.jsxs)("button",{onClick:()=>e(c.id),className:`flex-1 min-w-0 px-3 py-2 rounded-md font-mono text-xs transition-all whitespace-nowrap ${a===c.id?"bg-[var(--accent)]/15 text-[var(--accent)] border border-[var(--accent)]/30":"text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border)]/30"}`,children:[(0,b.jsx)("span",{className:"mr-1",children:c.icon}),(0,b.jsx)("span",{className:"inline sm:inline",children:c.label})]},c.id))}),(0,b.jsx)("div",{className:"text-right mb-2",children:(0,b.jsx)("a",{href:{simon:"https://github.com/Samuelfmedeiros/simon-game",asteroid:"https://github.com/Samuelfmedeiros/asteroid-dodge",typing:"https://github.com/Samuelfmedeiros/code-typing",memory:"https://github.com/Samuelfmedeiros/memory-matrix"}[a],target:"_blank",rel:"noopener noreferrer",className:"text-[10px] font-mono text-[var(--text-secondary)]/50 hover:text-[var(--accent)] transition-colors",children:"Ver código no GitHub →"})}),(0,b.jsx)(d.GlassCard,{className:"min-h-[280px]",children:(0,b.jsx)(f.motion.div,{initial:{opacity:0,y:8},animate:{opacity:1,y:0},transition:{duration:.2},children:k.find(b=>b.id===a)?.component},a)})]})}let m=" ╔══════════════════════════════════════╗\n ║     🛰️  MISSION CONTROL  v2.0      ║\n ║     Samuel Medeiros — Dev Full Stack║\n ╚══════════════════════════════════════╝\n\nDigite 'help' ou pressione Tab para autocompletar.\n",n="C:\\Users\\Visitor",o=["help","ajuda","sobre","projetos","habilidades","contato","limpar","clear","cls","hora","date","whoami","theme","fix","run","matrix","sudo","stack","github","neofetch","uptime","ls","echo","banner","quote","exit","ipconfig","ping","cowsay","whois","pwd","holofote","skills"];a.s(["Terminal",0,function(){let[a,f]=(0,c.useState)(""),[g,h]=(0,c.useState)([{cmd:"",output:m}]),i=(0,c.useRef)(null),j=(0,c.useRef)(null),k=(0,c.useRef)([]),[p,q]=(0,c.useState)(-1),[r,s]=(0,c.useState)(!1),{toggle:t}=(0,e.useTheme)();return(0,c.useEffect)(()=>{j.current?.scrollTo(0,j.current.scrollHeight)},[g]),(0,b.jsxs)("section",{id:"terminal",className:"py-8 md:py-12 px-4 md:px-6",children:[(0,b.jsx)("h2",{className:"text-3xl font-mono text-[var(--accent)] mb-12 text-center",id:"terminal-heading",children:"▸ TERMINAL"}),(0,b.jsxs)(d.GlassCard,{className:"max-w-3xl mx-auto font-mono text-sm",role:"region","aria-labelledby":"terminal-heading",children:[(0,b.jsx)("div",{ref:j,className:"h-48 sm:h-64 md:h-80 overflow-y-auto mb-4 p-4 rounded-lg bg-[var(--bg-primary)]/30 text-[var(--text-primary)] scroll-smooth",children:g.map((a,c)=>(0,b.jsxs)("div",{className:"mb-2",children:[a.cmd&&(0,b.jsxs)("div",{className:"text-[var(--accent)]",children:[(0,b.jsxs)("span",{className:"text-[var(--accent)]",children:[n,">"]})," ",a.cmd]}),(0,b.jsx)("pre",{className:"text-xs text-[var(--text-secondary)] whitespace-pre-wrap mt-1",children:a.output})]},c))}),(0,b.jsxs)("div",{className:"flex items-center gap-2 text-[var(--accent)]",children:[(0,b.jsxs)("span",{className:"text-[var(--accent)] shrink-0",children:[n,">"]}),(0,b.jsx)("input",{ref:i,type:"text",value:a,onChange:a=>f(a.target.value),onKeyDown:b=>{if("Enter"===b.key&&a.trim()){k.current.push(a),q(-1),(a=>{let b=a.replace(/[<>]/g,"").replace(/javascript:/gi,"").replace(/on\w+=/gi,"").replace(/[\x00-\x1F\x7F-\x9F]/g,"").slice(0,500).trim().toLowerCase(),c="";switch(b){case"help":case"ajuda":c=`COMANDOS DISPON\xcdVEIS:
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
  sudo rm -rf /             — ⚠️ N\xe3o fa\xe7a isso`;break;case"sobre":c=`Samuel Medeiros
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
  • TRT 10\xaa Regi\xe3o`;break;case"projetos":c=`PROJETOS:
  🐾 DogWalk        — Plataforma de passeio de c\xe3es (Next.js + Supabase)
  🛰️ Mission Control — Este portf\xf3lio (Next.js + Framer Motion)
  📊 ANA Dashboards  — Dashboards de dados (Power BI + SQL)`;break;case"habilidades":c=`HABILIDADES:
  [Linguagens]    Python, SQL, TypeScript
  [BI/Analytics] Power BI, Excel, Power Query, DAX
  [ML/IA]         Scikit-learn, Pandas, LLMs
  [Web]           Next.js, React, Tailwind CSS
  [Banco]         PostgreSQL, Supabase, MySQL
  [Ferramentas]   Docker, Git, Linux, Azure`;break;case"contato":c=`CONTATO:
  📧 Email:    samuelandrademedeiros@gmail.com
  💼 LinkedIn: linkedin.com/in/samuelandrademedeiros
  🐙 GitHub:   github.com/Samuelfmedeiros
  📱 WhatsApp: wa.me/556191191722`;break;case"limpar":case"clear":case"cls":case"clear":case"limpar":h([]);return;case"hora":c=`Hor\xe1rio: ${new Date().toLocaleString("pt-BR")}`;break;case"whoami":c="Samuel Medeiros";break;case"date":c=`Data atual: ${new Date().toLocaleDateString("pt-BR",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}
Hor\xe1rio: ${new Date().toLocaleTimeString("pt-BR")}`;break;case"uptime":let d=Math.floor(Math.floor((Date.now()-performance.now())/1e3)/60);c=`Session uptime: ${d} min`;break;case"stack":c=`TECH STACK:
  Frontend:  Next.js 16, React 19, TypeScript, Tailwind CSS 4
  Anima\xe7\xf5es: Framer Motion, Lucide Icons
  Backend:   Supabase (PostgreSQL), Cloudflare Workers
  Testes:    Vitest, Playwright
  Deploy:    Cloudflare Pages, Vercel
  CI/CD:     GitHub Actions`;break;case"github":c=`GitHub: github.com/Samuelfmedeiros
  Repos p\xfablicos: mission-control, dog-walk e mais
  Linguagens: TypeScript, Python, SQL, JavaScript
  Contribui\xe7\xf5es: Frequentes`;break;case"neofetch":c=`
        ╭───────────────╮         samuel@portfolio
        │   🛰️  MC v2  │         ──────────────────
        │  Mission Ctrl │         OS: Web (Next.js 16)
        ╰───────────────╯         Host: ${"u">typeof navigator?navigator.platform:"unknown"}
                                  Shell: Terminal React
                                  Theme: ${"u">typeof document?document.documentElement.classList.contains("theme-dark")?"Night Vision":"Daylight Ops":"unknown"}
                                  CPU: ${"u">typeof navigator?navigator.hardwareConcurrency||"??":"?"} cores
                                  Memory: ${"u">typeof navigator&&navigator.deviceMemory?navigator.deviceMemory+"GB":"??"}
                                  Browser: ${"u">typeof navigator&&navigator.userAgent.split(" ").pop()||"unknown"}`;break;case"theme":t(),c="Tema alternado com sucesso.";break;case"fix path_variables":c=`> Iniciando reparo do PATH...
> Escaneando vari\xe1veis de ambiente corrompidas...

[OK] USERPROFILE = C:\\Users\\Samuel
[OK] APPDATA = C:\\Users\\Samuel\\AppData\\Roaming
[OK] PATH restaurado para valores padr\xe3o
[WARN] NODE_PATH estava pointing para C:\\Python27
[FIX] Corrigido NODE_PATH -> C:\\Program Files\\nodejs
[OK] JAVA_HOME = C:\\Program Files\\Java\\jdk-17

> Processando... 100%
✅ PATH_variables reparado com sucesso!`;break;case"run routine:lights_out":c=`> Executando rotina LIGHTS_OUT...
> Simulando falha de energia...

█▓▒░ ░▒▓█

> WARNING: Todos os sistemas offline
> BACKUP: Energia de emerg\xeancia ativada
> Modo Noturno M\xe1ximo ATIVADO

✨ Screen brightness: 0%
✨ Animations: disabled
✨ Terminal: HIGH CONTRAST

> Miss\xe3o cumprida, operador.`,document.documentElement.classList.add("lights-out"),setTimeout(()=>document.documentElement.classList.remove("lights-out"),5e3);break;case"matrix":c=`> Iniciando efeito MATRIX...
> Conectando \xe0 fonte de dados...

████████████████████████████
██ 01001000 01100101 01101100 ██
██ 01101100 01101111 00100000 ██
██ 01010100 01100101 01100011 ██
████████████████████████████

> Acesso concedido.
> Bem-vindo ao sistema, Sr. Anderson.`;break;case"sudo rm -rf /":c=`> sudo: acesso root requerido
> 
> ⚠️ ALERTA DE SEGURAN\xc7A ⚠️
> Tentativa de deletar o universo detectada!
> 
> Bloqueando...
> 
> 🙃 Calma, visitante. 
> Isso aqui \xe9 s\xf3 um portf\xf3lio.
> N\xe3o vou deixar voc\xea deletar minha carreira.`;break;case"fix":c=`Uso: fix <componente>
Exemplo: fix path_variables`;break;case"run":c=`Uso: run routine:<nome>
Exemplo: run routine:lights_out`;break;case"sudo":c=`Acesso negado. Este terminal n\xe3o tem privil\xe9gios de root.
(Porque isso \xe9 um portf\xf3lio, n\xe3o um servidor de produ\xe7\xe3o.)`;break;case"ls":c=` Volume in drive C \xe9 WINDOWS
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
               7 Dir(s)   ∞ bytes free`;break;case"pwd":c=n;break;case"skills":c=`PROFICI\xcaNCIA EM HABILIDADES:

  Power BI           ████████████████████████░  95%  Expert
  SQL & PostgreSQL   ████████████████████████░  95%  Expert
  Python             ████████████████████░░░░░  78%  Advanced
  Machine Learning   ████████████████████░░░░░  78%  Advanced
  Next.js & React    ████████████████████░░░░░  78%  Advanced
  LLMs Locais        ██████████████████░░░░░░░  60%  Proficient
  Docker             ██████████████████░░░░░░░  60%  Proficient
  Git & GitHub       ████████████████████░░░░░  78%  Advanced`;break;case"banner":c=m;break;case"quote":{let a=['"A melhor maneira de prever o futuro é criá-lo." — Peter Drucker','"Dados são o novo petróleo." — Clive Humby','"Sem dados, você é apenas mais uma pessoa com uma opinião." — W. Edwards Deming','"A simplicidade é a sofisticação máxima." — Leonardo da Vinci','"O único jeito de fazer um ótimo trabalho é amar o que você faz." — Steve Jobs','"Não é o mais forte que sobrevive, mas o que melhor se adapta." — Charles Darwin','"A tecnologia move o mundo." — Steve Jobs','"Transformar problemas em oportunidades é a essência da inovação." — Samuel Medeiros','"O sucesso é a soma de pequenos esforços repetidos dia após dia." — Robert Collier','"Se você pode medir, você pode gerenciar." — Peter Drucker'];c=`📜 ${a[Math.floor(Math.random()*a.length)]}`;break}case"ipconfig":c=`Windows IP Configuration

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

   🛰️ Mission Control Signal: ❚❚❚❚❚❚❚❚❚❚ 100%`;break;case"exit":c=`> Encerrando sess\xe3o...
> Salvando configura\xe7\xf5es...
> 
> Obrigado por visitar! Volte sempre 🚀
> 
> (Dica: Feche esta aba se quiser sair de verdade.)`;break;case"holofote":c=`
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
╚══════════════════════════════════════════════════════╝`;break;default:if(b.startsWith("echo ")){c=b.slice(5);break}if(b.startsWith("ping ")){let a=b.slice(5)||"localhost",d=Math.floor(40*Math.random()+10);c=`Pinging ${a} [192.168.1.${Math.floor(254*Math.random())}] with 32 bytes of data:
Reply from 192.168.1.1: bytes=32 time=${d}ms TTL=64
Reply from 192.168.1.1: bytes=32 time=${d+5}ms TTL=64
Reply from 192.168.1.1: bytes=32 time=${d-3}ms TTL=64
Reply from 192.168.1.1: bytes=32 time=${d+2}ms TTL=64

Ping statistics for 192.168.1.${Math.floor(254*Math.random())}:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
Approximate round trip times in milli-seconds:
    Minimum = ${d-3}ms, Maximum = ${d+5}ms, Average = ${Math.floor(d+1)}ms`;break}if(b.startsWith("whois ")){let a=b.slice(6);c=`WHOIS lookup for "${a}"...

  Nome: ${a}
  Cargo: Analista de Dados / Desenvolvedor Full Stack
  Localiza\xe7\xe3o: Bras\xedlia, DF — Brasil
  Expertise: Power BI, SQL, Python, Machine Learning
  Contato: samuelandrademedeiros@gmail.com
  GitHub: github.com/Samuelfmedeiros
  LinkedIn: linkedin.com/in/samuelandrademedeiros

  [Resultados obtidos do registro WHOIS interno]`;break}if(b.startsWith("cowsay ")){let a=b.slice(7)||"Moo!",d=Math.max(a.length,4),e="─".repeat(d);c=` ┌${e}┐
 │ ${a.padEnd(d-1)} │
 └${e}┘
  \\   ^__^
   \\  (oo)\\_______
      (__)\\       )\\/\\
          ||----w |
          ||     ||`;break}if(b.startsWith("cowsay")){c=` ┌────┐
 │ Moo! │
 └────┘
  \\   ^__^
   \\  (oo)\\_______
      (__)\\       )\\/\\
          ||----w |
          ||     ||`;break}c=`Comando n\xe3o encontrado: '${b}'
Digite 'ajuda' para ver os comandos dispon\xedveis.`}h(b=>[...b,{cmd:a,output:c}])})(a),f("");return}if("ArrowUp"===b.key){if(b.preventDefault(),0===k.current.length)return;let a=-1===p?k.current.length-1:Math.max(0,p-1);q(a),f(k.current[a]);return}if("ArrowDown"===b.key){if(b.preventDefault(),0===k.current.length||-1===p)return;let a=p+1;a>=k.current.length?(q(-1),f("")):(q(a),f(k.current[a]));return}if("Tab"===b.key){b.preventDefault();let c=a.trim().toLowerCase();if(!c)return;let d=o.filter(a=>a.startsWith(c));if(0===d.length)return;if(1===d.length)f(d[0]);else{let a=d.reduce((a,b)=>{let c=0;for(;c<a.length&&c<b.length&&a[c]===b[c];)c++;return a.slice(0,c)});a.length>c.length?f(a):h(a=>[...a,{cmd:`${c}	`,output:d.join("  ")}])}}},onFocus:()=>s(!0),onBlur:()=>s(!1),className:`flex-1 bg-transparent outline-none text-[var(--text-primary)] font-mono text-sm ${r?"caret-[var(--accent)]":""}`,placeholder:"digite um comando...","aria-label":"Digite um comando",role:"textbox",autoFocus:!0})]})]}),(0,b.jsx)("div",{className:"max-w-3xl mx-auto mt-8",children:(0,b.jsx)(l,{})})]})}],72282)}];

//# sourceMappingURL=src_components_Terminal_tsx_0utp2.a._.js.map