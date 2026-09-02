
const EXPERIMENTS = [
  {
    title:"Baseline",
    hypothesis:"Нічога не мяняем — толькі глядзім, што адбываецца.",
    rule:"3–5 дзён проста адзначай падзеі і энергію.",
    instruction:"Нічога спецыяльна не змяняй. Толькі адзначай падзеі і стан.",
    plan:["Хуткія падзеі на працягу дня","Энергія ў момант, калі хочацца адзначыць","Вячэрні check‑in","Сон раніцай"]
  },
  {
    title:"Сэнсарны бюджэт",
    hypothesis:"Шум і стымулы могуць забіраць значную частку рэсурсу.",
    rule:"Пасля другой значнай размовы — 15–20 хвілін мінімуму стымулаў.",
    instruction:"Пасля другой значнай размовы зрабі 15–20 хвілін цішыні/цемры без тэлефона.",
    plan:["Noise cancelling","Менш фонавага гуку","Кароткі recovery да crash","Адзначай Noise і Recovery"]
  },
  {
    title:"Менш пераключэнняў",
    hypothesis:"Кошт дня можа залежаць больш ад context switching, чым ад аб’ёму працы.",
    rule:"Групуй задачы і размовы. Не скачы паміж кантэкстамі без патрэбы.",
    instruction:"Сёння мінімізуй пераключэнні: адзін блок працы → calls → іншы блок.",
    plan:["Групаваць падобныя задачы","Паведамленні — блокамі","Адзначай Context switch","Не спрабаваць зрабіць менш працы"]
  },
  {
    title:"Recovery да crash",
    hypothesis:"Кароткі адпачынак пры 6–7/10 можа быць таннейшы за 2 гадзіны пры 1/10.",
    rule:"Не чакай, пакуль стане дрэнна. Recovery пры першых прыкметах перагрузкі.",
    instruction:"Зрабі 15–20 хвілін recovery яшчэ да таго, як энергія ўпадзе ніжэй за 5/10.",
    plan:["Адзначай энергію перад recovery","Без input: цішыня/цемра","Адзначай Recovery","Параўноўвай час аднаўлення ўвечары"]
  },
  {
    title:"Executive support",
    hypothesis:"Менш рашэнняў і меншыя крокі могуць эканоміць рэсурс.",
    rule:"Адна бачная задача і загадзя вядомы наступны маленькі крок.",
    instruction:"Трымай перад сабой толькі адну задачу і наступны маленькі крок.",
    plan:["Адна актыўная задача","Вялікае → маленькія крокі","Не трымаць план у галаве","Адзначай Hard task толькі калі яна сапраўды давіць"]
  },
  {
    title:"Танная камунікацыя",
    hypothesis:"Кошт можа быць у самім уваходзе ў сацыяльны рэжым, а не ў хвілінах.",
    rule:"Дзе можна — async, agenda, нататкі і мінімум неабавязковага input.",
    instruction:"Рабі камунікацыю таннейшай: async дзе можна, agenda перад call, некалькі хвілін цішыні пасля.",
    plan:["Адзначай кожны Call асобна","Параўноўвай колькасць, не працягласць","Async замест call дзе магчыма","Кароткі recovery пасля размоў"]
  }
];

const EVENTS = [
  ["call","☎️","Call"],
  ["context","↔️","Context"],
  ["noise","🔊","Noise"],
  ["people","👥","People"],
  ["hard","🧠","Hard task"],
  ["walk","🚶","Walk"],
  ["recovery","🌑","Recovery"],
  ["flow","✨","Flow"]
];

const DB_KEY = "energyExperimentsDataV1";
const SETTINGS_KEY = "energyExperimentsSettingsV1";
const defaultData = {events:[], energy:[], evening:[], sleep:[]};
const load = (k, fallback) => { try { return JSON.parse(localStorage.getItem(k)) ?? fallback } catch { return fallback } };
let data = load(DB_KEY, structuredClone(defaultData));
let settings = load(SETTINGS_KEY, {startDate:new Date().toISOString().slice(0,10)});
let deferredPrompt = null;

function save(){ localStorage.setItem(DB_KEY, JSON.stringify(data)); localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); renderAll(); }
function today(){ return new Date().toISOString().slice(0,10); }
function isoNow(){ return new Date().toISOString(); }
function dayDiff(a,b){ return Math.floor((new Date(b+"T12:00:00")-new Date(a+"T12:00:00"))/86400000); }
function currentWeek(){ return Math.min(EXPERIMENTS.length-1, Math.max(0, Math.floor(dayDiff(settings.startDate,today())/7))); }
function toast(msg){ const t=document.getElementById("toast"); t.textContent=msg; t.classList.add("show"); setTimeout(()=>t.classList.remove("show"),1500); }

function renderEvents(){
  const wrap=document.getElementById("quickEvents"); wrap.innerHTML="";
  EVENTS.forEach(([type,emoji,label])=>{
    const count=data.events.filter(e=>e.date===today()&&e.type===type).length;
    const b=document.createElement("button"); b.className="event-btn";
    b.innerHTML=`<span>${emoji} ${label}</span><small>${count?count+" сёння":"націснуць"}</small>`;
    b.onclick=()=>{ data.events.push({type,date:today(),ts:isoNow()}); save(); toast(label+" ✓"); };
    wrap.appendChild(b);
  });
}

let selectedEnergy = null;
function renderEnergyScale(){
  const wrap=document.getElementById("energyScale"); wrap.innerHTML="";
  for(let i=0;i<=10;i++){
    const b=document.createElement("button"); b.className="scale-btn"+(selectedEnergy===i?" active":""); b.textContent=i;
    b.onclick=()=>{ selectedEnergy=i; document.getElementById("nowValueLabel").textContent=i+"/10"; renderEnergyScale(); };
    wrap.appendChild(b);
  }
}
document.getElementById("saveNowBtn").onclick=()=>{
  if(selectedEnergy===null){ toast("Абяры энергію"); return; }
  data.energy.push({value:selectedEnergy,date:today(),ts:isoNow()}); save(); toast("Энергія захавана");
};

function renderToday(){
  const w=currentWeek(), exp=EXPERIMENTS[w];
  document.getElementById("experimentName").textContent=exp.title;
  document.getElementById("experimentInstruction").textContent=exp.instruction;
  const d=Math.min(7, dayDiff(settings.startDate,today())%7+1);
  document.getElementById("experimentDay").textContent=`Дзень ${d}/7`;
  document.getElementById("experimentRange").textContent=`Тыдзень ${w+1}/${EXPERIMENTS.length}`;
  const counts = Object.fromEntries(EVENTS.map(([t])=>[t,data.events.filter(e=>e.date===today()&&e.type===t).length]));
  const lastEnergy=[...data.energy].reverse().find(e=>e.date===today());
  const stats=[
    ["Calls",counts.call],["Contexts",counts.context],["Recovery",counts.recovery],["Energy",lastEnergy?lastEnergy.value+"/10":"—"]
  ];
  document.getElementById("todayStats").innerHTML=stats.map(([k,v])=>`<div class="stat"><span class="muted">${k}</span><b>${v}</b></div>`).join("");
}

function selectIn(id,val){
  document.querySelectorAll(`#${id} button`).forEach(b=>b.classList.toggle("active",b.dataset.value==val));
}
let recoveryVal=null, lifeVal=null, sleepVal=null;
document.getElementById("recoveryOptions").onclick=e=>{ if(e.target.dataset.value){ recoveryVal=Number(e.target.dataset.value); selectIn("recoveryOptions",e.target.dataset.value); } };
document.getElementById("lifeOptions").onclick=e=>{ if(e.target.dataset.value){ lifeVal=e.target.dataset.value; selectIn("lifeOptions",e.target.dataset.value); } };
document.getElementById("sleepHours").onclick=e=>{ if(e.target.dataset.value){ sleepVal=Number(e.target.dataset.value); selectIn("sleepHours",e.target.dataset.value); } };
["eveningEnergy","overload"].forEach(id=>document.getElementById(id).oninput=e=>document.getElementById(id+"Val").textContent=e.target.value);

document.getElementById("saveEveningBtn").onclick=()=>{
  if(recoveryVal===null||lifeVal===null){ toast("Абяры recovery і сілы на жыццё"); return; }
  data.evening=data.evening.filter(x=>x.date!==today());
  data.evening.push({date:today(), energy:Number(document.getElementById("eveningEnergy").value), overload:Number(document.getElementById("overload").value), recovery:recoveryVal, life:lifeVal, ts:isoNow()});
  save(); toast("Вячэрні check‑in ✓");
};
document.getElementById("saveSleepBtn").onclick=()=>{
  if(sleepVal===null){ toast("Абяры гадзіны сну"); return; }
  data.sleep=data.sleep.filter(x=>x.date!==today());
  data.sleep.push({date:today(), hours:sleepVal, rested:document.getElementById("restedCheck").checked, ts:isoNow()});
  save(); toast("Сон захаваны ✓");
};

function renderExperiment(){
  const w=currentWeek(), exp=EXPERIMENTS[w];
  document.getElementById("weekNumber").textContent=w+1;
  document.getElementById("expTitle").textContent=exp.title;
  document.getElementById("expHypothesis").textContent=exp.hypothesis;
  document.getElementById("expRule").textContent=exp.rule;
  document.getElementById("expPlan").innerHTML="<ul>"+exp.plan.map(x=>`<li>${x}</li>`).join("")+"</ul>";
  document.getElementById("experimentList").innerHTML=EXPERIMENTS.map((x,i)=>`<div class="exp-item ${i===w?"current":""}"><b>${i+1}. ${x.title}</b><div class="muted">${x.hypothesis}</div></div>`).join("");
}

function avg(arr){ return arr.length? arr.reduce((a,b)=>a+b,0)/arr.length : null; }
function renderInsights(){
  const cutoff=new Date(); cutoff.setDate(cutoff.getDate()-6);
  const days7=new Set(Array.from({length:7},(_,i)=>{const d=new Date();d.setDate(d.getDate()-i);return d.toISOString().slice(0,10)}));
  const ev7=data.evening.filter(x=>days7.has(x.date));
  const sleep7=data.sleep.filter(x=>days7.has(x.date));
  const events7=data.events.filter(x=>days7.has(x.date));
  const byType=t=>events7.filter(e=>e.type===t).length;
  const eavg=avg(ev7.map(x=>x.energy)), oavg=avg(ev7.map(x=>x.overload)), ravg=avg(ev7.map(x=>x.recovery));
  const cards=[
    ["Энергія пасля працы",eavg===null?"Недастаткова даных":eavg.toFixed(1)+"/10"],
    ["Перагрузка",oavg===null?"Недастаткова даных":oavg.toFixed(1)+"/10"],
    ["Recovery",ravg===null?"Недастаткова даных":Math.round(ravg)+" хв сярэдняе"],
    ["Calls / Contexts",`${byType("call")} / ${byType("context")}`],
    ["Сон",sleep7.length?avg(sleep7.map(x=>x.hours)).toFixed(1)+" г сярэдняе":"Недастаткова даных"]
  ];
  document.getElementById("insightCards").innerHTML=cards.map(([k,v])=>`<div class="insight"><div class="muted">${k}</div><b>${v}</b></div>`).join("");
  const lifeCounts={yes:0,some:0,no:0}; ev7.forEach(x=>lifeCounts[x.life]++);
  document.getElementById("weeklySummary").innerHTML=`
    <p><b>${ev7.length}</b> вячэрніх check‑in за 7 дзён.</p>
    <p>Сілы на жыццё: <b>${lifeCounts.yes}</b> так · <b>${lifeCounts.some}</b> крыху · <b>${lifeCounts.no}</b> не.</p>
    <p class="muted">Пасля некалькіх тыдняў параўноўвай не “прадуктыўнасць”, а энергію, recovery і наяўнасць сіл на жыццё.</p>`;
}

function renderAll(){ renderEvents(); renderEnergyScale(); renderToday(); renderExperiment(); renderInsights(); }

document.querySelectorAll(".bottom-nav button").forEach(btn=>btn.onclick=()=>{
  document.querySelectorAll(".bottom-nav button").forEach(b=>b.classList.toggle("active",b===btn));
  document.querySelectorAll(".screen").forEach(s=>s.classList.toggle("active",s.id===btn.dataset.screen));
  const titles={todayScreen:"Сёння",checkinScreen:"Check‑in",experimentScreen:"Эксперымент",insightsScreen:"Insights",settingsScreen:"Даныя"};
  document.getElementById("screenTitle").textContent=titles[btn.dataset.screen];
});
document.getElementById("openEveningBtn").onclick=()=>document.querySelector('[data-screen="checkinScreen"]').click();

document.getElementById("exportBtn").onclick=()=>{
  const blob=new Blob([JSON.stringify({version:1,exportedAt:isoNow(),settings,data},null,2)],{type:"application/json"});
  const a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download=`energy-experiments-${today()}.json`; a.click(); URL.revokeObjectURL(a.href);
};
document.getElementById("importInput").onchange=async e=>{
  const f=e.target.files?.[0]; if(!f)return;
  try{
    const parsed=JSON.parse(await f.text());
    if(!parsed.data||!parsed.settings) throw new Error("Bad file");
    data=parsed.data; settings=parsed.settings; save(); toast("Імпарт завершаны");
  }catch{ toast("Не атрымалася імпартаваць"); }
};
document.getElementById("resetBtn").onclick=()=>{
  if(confirm("Сапраўды выдаліць усе лакальныя даныя?")){
    data=structuredClone(defaultData); settings={startDate:today()}; save(); toast("Даныя выдалены");
  }
};

window.addEventListener("beforeinstallprompt",e=>{
  e.preventDefault(); deferredPrompt=e; document.getElementById("installBtn").classList.remove("hidden");
});
document.getElementById("installBtn").onclick=async()=>{
  if(!deferredPrompt)return; deferredPrompt.prompt(); await deferredPrompt.userChoice; deferredPrompt=null; document.getElementById("installBtn").classList.add("hidden");
};

if("serviceWorker" in navigator) window.addEventListener("load",()=>navigator.serviceWorker.register("sw.js"));
renderAll();
