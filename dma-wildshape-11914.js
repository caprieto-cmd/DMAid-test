/* DMAid 1.19.14 - Visor persistente de Forma Salvaje en el statblock de combate.
 * No hay tiradas automaticas. Los HP del druida solo cambian si sobra daño tras caer la forma.
 * El DM verifica que el druida haya visto la criatura. Reglas PHB 2014.
 */
(function(){'use strict';
const VERSION='11914';
const $=(root,sel)=>root?.querySelector(sel);
const node=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!=null)e.textContent=String(text);return e};
const append=(parent,tag,cls,text)=>{const e=node(tag,cls,text);parent.append(e);return e};
const asString=v=>String(v??'');
const normalized=v=>asString(v).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
function levelOf(i){return (profile(i).classes||[]).filter(c=>c.name==='Druida').reduce((a,c)=>a+(Number(c.level)||0),0)}
function moon(i){return (profile(i).classes||[]).some(c=>c.name==='Druida'&&/moon|luna/i.test(c.sub||''))}
function limits(i){const n=levelOf(i);return window.DMADruidRules1199?.wildShapeLimits?.(n,moon(i)?'Moon':'Land') || {available:n>=2,crMax:moon(i)?(n<6?1:Math.floor(n/3)):(n>=8?1:n>=4?.5:.25),allowSwim:n>=4,allowFly:n>=8,durationHours:Math.floor(n/2),activation:moon(i)?'bonus_action':'action'}}
const crNumber=v=>{let t=(v&&typeof v==='object')?(v.cr??v.value??v.rating):v;let s=asString(t).trim().replace(/^CR\s*/i,'');if(/^\d+\s*\/\s*\d+$/.test(s)){const [a,b]=s.split('/').map(Number);return b?a/b:null}return s!==''&&Number.isFinite(+s)?+s:null};
const showCR=v=>({0.125:'1/8',0.25:'1/4',0.5:'1/2'}[String(v)]||String(v));
const kind=m=>normalized(m.kind||m.type||m.creatureType||m.stat?.type);
function moving(m,mode){const stat=m.stat||{};const s=stat.speed??m.speed;
 const raw=asString(typeof s==='string'?s:'');if(new RegExp(mode==='fly'?'(?:fly|vuelo|volar)':'(?:swim|nado|nadar)','i').test(raw))return true;
 const v=(typeof s==='object'&&s)?s[mode]:null;
 const n=typeof v==='object'?Number(v.number??v.value):Number(v);
 const direct=m[mode+'Speed']??m[mode+'_speed'];return (Number.isFinite(n)&&n>0)||(Number(direct)>0);
}
function candidates(i,category='beast'){
 const lim=limits(i);if(!lim.available)return [];
 const ext=category==='elemental';if(ext&&!(moon(i)&&levelOf(i)>=10))return [];
 const names=new Set(['airelemental','earthelemental','fireelemental','waterelemental']);
 const seen=new Map();
 const pool=typeof bestiaryV3Entries==='function'?bestiaryV3Entries():[];
 for(const m of pool){if(!m||!m.id)continue;const type=kind(m),cr=crNumber(m.cr);
  if(ext){if(!/elemental/.test(type)||!names.has(normalized(m.name).replace(/[^a-z]/g,'')))continue}
  else {if(!/beast|bestia/.test(type)||cr==null||cr>lim.crMax)continue;
   if((!lim.allowFly&&moving(m,'fly'))||(!lim.allowSwim&&moving(m,'swim')))continue;}
  if(cr==null)continue;
  const key=normalized(m.name)+'|'+cr;
  const old=seen.get(key);const isFull= x=>!!(x?.stat?.action?.length||x?.stat?.trait?.length||x?.actions||x?.traits);
  if(!old||isFull(m)&&!isFull(old))seen.set(key,m);
 }
 return [...seen.values()].sort((a,b)=>crNumber(a.cr)-crNumber(b.cr)||asString(a.name).localeCompare(asString(b.name),'es'));
}
function record(i){const sh=profile(i);return sh.dmaWildShapeForm11913||(sh.dmaWildShapeForm11913={active:false,chosenId:'',mode:'beast',hp:null,beast:null})}
function available(i){const n=levelOf(i),max=n>=20?Infinity:2,used=Number(profile(i).dmaWildShape1191?.spent||0);return max===Infinity?Infinity:Math.max(0,max-used)}
function lines(value){
 if(value==null)return '';
 if(Array.isArray(value))return value.map(lines).filter(Boolean).join(' · ');
 if(typeof value==='object'){
  if(value.entries||value.entry)return [value.name,lines(value.entries||value.entry)].filter(Boolean).join(': ');
  if(value.number!==undefined)return String(value.number)+(value.condition?' ('+lines(value.condition)+')':'');
  return Object.entries(value).map(([k,v])=>k+': '+lines(v)).join(' · ');
 }
 const raw=asString(value);
 // El bestiario usa etiquetas 5etools como {@atk mw}, {@hit 6}, {@damage 1d10 + 5}.
 // Usamos su formateador ya existente para no mostrar códigos internos al DM.
 if(typeof dmaMonsterText1131==='function')return dmaMonsterText1131(raw);
 return raw.replace(/\{@atk\s+mw\}/gi,'Ataque de arma cuerpo a cuerpo:').replace(/\{@hit\s+([+-]?\d+)\}/gi,(_,v)=>(Number(v)>=0?'+':'')+Number(v)+' al ataque').replace(/\{@(?:damage|dice)\s+([^}|]+)(?:\|[^}]*)?\}/gi,'$1').replace(/\{@h\}/gi,'Impacto:').replace(/\{@[^ ]+\s+([^}|]+)(?:\|[^}]*)?\}/g,'$1').replace(/<[^>]+>/g,'');
}
function printableSpeed(m){const s=m?.stat?.speed??m?.speed;if(s==null)return 'No registrada';if(typeof s!=='object'||Array.isArray(s))return lines(s);const names={walk:'Caminar',fly:'Volar',swim:'Nadar',climb:'Trepar',burrow:'Excavar'};return Object.entries(s).map(([k,v])=>(names[k]||k)+': '+(typeof v==='number'?v+' pies':typeof v==='object'&&v?.number!=null?v.number+' pies'+(v.condition?' ('+lines(v.condition)+')':''):lines(v))).join(' · ')}
function full(m){try{return typeof v10RichVersion==='function'?v10RichVersion(m):m}catch(e){return m}}
function formMax(m){const a=[m?.hp,m?.stat?.hp?.average,m?.stat?.hp];for(const v of a){const n=Number(v);if(Number.isFinite(n)&&n>0)return Math.floor(n)}return 0}
function formAC(m){const a=m?.ac??m?.stat?.ac;const val=Array.isArray(a)?a[0]:a;const n=Number(typeof val==='object'?val?.ac:val);return Number.isFinite(n)&&n>0?n:null}
function statblock(parent,original){const m=full(original),st=m.stat||{};
 const card=append(parent,'div','dma-ws-stat11913');
 append(card,'h5','',m.name||'Forma sin nombre');append(card,'div','dma-ws-meta11913',`${m.kind||'Bestia'} · CR ${showCR(crNumber(m.cr)??'?')} · ${m.source||'Fuente no indicada'}`);
 const grid=append(card,'div','dma-ws-facts11913');
 for(const [k,v] of [['CA',m.ac??st.ac??'—'],['HP máximos',formMax(m)||'—'],['Velocidad',printableSpeed(m)]]){const el=append(grid,'div');append(el,'small','',k);append(el,'strong','',lines(v))}
 if(['str','dex','con','int','wis','cha'].every(k=>Number.isFinite(Number(st[k])))){
  const abil=append(card,'div','dma-ws-abilities11913');for(const [label,key] of [['FUE','str'],['DES','dex'],['CON','con'],['INT','int'],['SAB','wis'],['CAR','cha']]){const score=Number(st[key]),mod=Math.floor((score-10)/2);const cell=append(abil,'div');append(cell,'b','',label);append(cell,'span','',`${score} (${mod>=0?'+':''}${mod})`)}}
 for(const [title,key] of [['Salvaciones','save'],['Habilidades','skill'],['Resistencias','resist'],['Inmunidades al daño','immune'],['Inmunidades a condiciones','conditionImmune'],['Sentidos','senses'],['Idiomas','languages']])if(st[key]!=null){const p=append(card,'p','dma-ws-attribute11913');append(p,'b','',title+': ');p.append(document.createTextNode(lines(st[key])))}
 let actions=0;for(const [title,key,fallback] of [['Rasgos','trait',m.traits],['Acciones','action',m.actions],['Bonus Actions','bonus',null],['Reacciones','reaction',null],['Acciones legendarias','legendary',null]]){
  const arr=Array.isArray(st[key])?st[key]:[];if(!arr.length&&!fallback)continue;
  append(card,'h6','',title);
  if(arr.length){for(const a of arr){const p=append(card,'p','dma-ws-action11913');append(p,'b','',a.name||title);p.append(document.createTextNode(' · '+lines(a.entries||a.entry||a)));actions++}}
  else {append(card,'p','dma-ws-action11913',lines(fallback));actions++}
 }
 if(!actions)append(card,'p','dma-ws-warning11913','Esta ficha del bestiario solo contiene datos resumidos. Importa el statblock completo antes de utilizar sus acciones.');
 const note=append(card,'p','dma-ws-hint11913','En Forma Salvaje (PHB 2014), se conservan INT, SAB y CAR del druida, junto con las competencias y rasgos permitidos. Los valores físicos y HP de la forma proceden de la bestia. El DM aplica las reglas de sustitución de características, competencia y salvaciones cuando correspondan.');
 return card;
}
function select(parent,label,options,initial){const wrap=append(parent,'label','dma-ws-field11913');append(wrap,'span','',label);const el=append(wrap,'select');for(const [value,text] of options){const o=append(el,'option','',text);o.value=String(value)}el.value=String(initial);return el}
function control(parent,text,fn,disabled=false){const b=append(parent,'button','',text);b.type='button';b.disabled=!!disabled;b.addEventListener('click',fn);return b}
function repaint(){if(typeof save==='function')save();if(typeof render==='function')render()}
function picker(section,i){const data=record(i),lim=limits(i),isActive=!!data.active;
 section.querySelector('.dma-ws-picker11913')?.remove();
 const root=append(section,'div','dma-ws-picker11913');
 const title=append(root,'div','dma-ws-heading11913');append(title,'b','',isActive?'✅ Forma Salvaje ACTIVA':'🐾 Elegir Forma Salvaje');append(title,'small','',`Druida ${levelOf(i)} · CR máx. ${showCR(lim.crMax)} · ${moon(i)?'Bonus Action':'Acción'} · ${lim.durationHours} h`);
 if(isActive&&data.beast){
  const m=data.beast;const active=append(root,'div','dma-ws-active11913');
  append(active,'p','',`Forma activa: ${m.name} · CR ${showCR(crNumber(m.cr))} · ronda de activación: ${data.activatedRound??'—'}`);
  const line=append(active,'div','dma-ws-track11913');const label=append(line,'label','',`HP de la forma (máx. ${Number(m.hp)||'—'})`);
  const hp=append(label,'input');hp.type='number';hp.min='0';hp.max=String(formMax(m)||99999);hp.value=String(data.hp??formMax(m));hp.setAttribute('aria-label','HP restantes de la Forma Salvaje');
  hp.addEventListener('change',()=>{data.hp=Math.max(0,Math.min(formMax(m)||99999,Math.floor(Number(hp.value)||0)));hp.value=String(data.hp);if(typeof save==='function')save();if(typeof renderQuickEnemies==='function')renderQuickEnemies();warning.textContent=Number(data.hp)===0?'La forma tiene 0 HP. Comprueba el daño sobrante que debe recibir el druida al revertir según el PHB 2014.':'';warning.style.display=Number(data.hp)===0?'block':'none';});
  control(line,'Terminar transformación',()=>{data.active=false;data.hp=null;repaint()});
  const warning=append(active,'p','dma-ws-warning11913',Number(data.hp)===0?'La forma tiene 0 HP. Comprueba el daño sobrante que debe recibir el druida al revertir según el PHB 2014.':'');if(Number(data.hp)!==0)warning.style.display='none';
  statblock(root,m);
  append(root,'p','dma-ws-hint11913','Terminar la transformación no devuelve usos de Forma Salvaje. Los HP de bestia se llevan por separado de los HP normales del druida.');
  return;
 }
 if(data.endedByDamage){append(root,'p','dma-ws-warning11913',`Última forma finalizada al llegar a 0 HP. Daño sobrante registrado sobre el druida: ${Math.max(0,Number(data.excessDamage)||0)} HP.`)}
 const costHint=append(root,'p','dma-ws-hint11913','Selecciona una criatura que el druida haya visto antes. Escoger y consultar una ficha no gasta usos; «Activar» registra la transformación y descuenta el coste.');
 const controls=append(root,'div','dma-ws-controls11913');
 const categories=[['beast','Bestias (1 uso)']];if(moon(i)&&levelOf(i)>=10)categories.push(['elemental','Elementales de la Luna (2 usos)']);
 const cat=categories.length>1?select(controls,'Tipo de transformación',categories,data.mode||'beast'):null;
 const crFilter=select(controls,'Filtrar por CR',[['all','Todos los CR permitidos']], 'all');
 const searchLabel=append(controls,'label','dma-ws-field11913');append(searchLabel,'span','', 'Buscar criatura');const query=append(searchLabel,'input');query.type='search';query.placeholder='Nombre de la bestia';
 const beastSelect=select(controls,'Criatura del bestiario',[['','Selecciona una criatura']],data.chosenId||'');
 const count=append(root,'p','dma-ws-hint11913');const preview=append(root,'div','dma-ws-preview11913');const actions=append(root,'div','dma-ws-actions11913');
 const activate=control(actions,'Activar Forma Salvaje',()=>{
  const id=beastSelect.value,m=candidates(i,cat?.value||'beast').find(x=>String(x.id)===id);
  const cost=(cat?.value||'beast')==='elemental'?2:1;
  if(!m)return alert('Selecciona una criatura permitida por el nivel y la subclase.');
  if(available(i)<cost)return alert('No quedan usos suficientes de Forma Salvaje.');
  if(!confirm(`¿Activar Forma Salvaje como ${m.name}? Coste: ${cost} uso(s). Comprueba que el personaje haya visto esta criatura.`))return;
  const fresh=record(i);fresh.active=true;fresh.mode=cat?.value||'beast';fresh.chosenId=id;fresh.beast=JSON.parse(JSON.stringify(m));fresh.hp=formMax(m);fresh.activatedRound=Number(state.round)||1;fresh.usedCost=cost;fresh.endedByDamage=false;fresh.excessDamage=0;
  const sh=profile(i);const ws=sh.dmaWildShape1191||(sh.dmaWildShape1191={spent:0});ws.spent=Math.max(0,Number(ws.spent||0)+cost);
  repaint();
 },true);
 function refresh(){const mode=cat?.value||'beast',list=candidates(i,mode);const allowed=[...new Set(list.map(m=>crNumber(m.cr)))].sort((a,b)=>a-b),priorCR=crFilter.value;
  crFilter.replaceChildren();for(const [v,t] of [['all','Todos los CR permitidos'],...allowed.map(x=>[String(x),'CR '+showCR(x)])]){const op=append(crFilter,'option','',t);op.value=v}crFilter.value=[...crFilter.options].some(o=>o.value===priorCR)?priorCR:'all';
  update();
 }
 function update(){const mode=cat?.value||'beast',list=candidates(i,mode),filter=crFilter.value,q=normalized(query.value);
  const filtered=list.filter(m=>(filter==='all'||String(crNumber(m.cr))===filter)&&(!q||normalized(m.name).includes(q)));
  const selected=beastSelect.value||((data.mode===mode)?data.chosenId:'');beastSelect.replaceChildren();const placeholder=append(beastSelect,'option','','Selecciona una criatura');placeholder.value='';
  for(const m of filtered){const o=append(beastSelect,'option','',`${m.name} · CR ${showCR(crNumber(m.cr))}`);o.value=String(m.id)}
  if(filtered.some(m=>String(m.id)===selected))beastSelect.value=String(selected);
  count.textContent=`${filtered.length} criatura(s) compatibles. ${mode==='beast'?(lim.allowFly?'Nado y vuelo permitidos.':lim.allowSwim?'Sin vuelo.':'Sin nado ni vuelo.'):'Elementales de Aire, Tierra, Fuego o Agua.'}`;
  renderPreview();
 }
 function renderPreview(){preview.replaceChildren();const mode=cat?.value||'beast',m=candidates(i,mode).find(x=>String(x.id)===beastSelect.value);
  activate.disabled=!m||available(i)<(mode==='elemental'?2:1);
  activate.textContent=mode==='elemental'?'Activar Elemental (2 usos)':'Activar Forma Salvaje (1 uso)';
  if(m){data.mode=mode;data.chosenId=String(m.id);if(typeof save==='function')save();statblock(preview,m)}
  else {append(preview,'p','dma-ws-warning11913',candidates(i,mode).length?'Selecciona una criatura para consultar su statblock.':'No hay criaturas compatibles cargadas en el bestiario. Importa el Monster Manual (2014) desde la pestaña Bestiario.');if(!candidates(i,mode).length)control(preview,'Abrir Bestiario',()=>{if(typeof switchTab==='function')switchTab('bestiary')})}
 }
 if(cat)cat.addEventListener('change',refresh);crFilter.addEventListener('change',update);query.addEventListener('input',update);beastSelect.addEventListener('change',renderPreview);refresh();
}
function decorate(panel,key){if(!/^p\d+$/.test(String(key)))return;const i=Number(key.slice(1));if(!state.players[i]||levelOf(i)<2)return;
 const classSection=panel?.querySelector('.eld-player-statblock .dma-four-class-11615 .dma-wild-class-1192');if(!classSection)return;
 const h=classSection.querySelector('h4');if(h)h.textContent='🌿 Forma Salvaje · Usos y transformación';
 picker(classSection,i);
}
function install(){if(typeof renderActivePlayerBlock!=='function')return;const prior=renderActivePlayerBlock;
 renderActivePlayerBlock=function(panel,key){prior(panel,key);try{decorate(panel,key)}catch(err){console.error('[DMAid Wild Shape 1.19.13]',err)}};
 // Desactivar la forma tras descanso largo, conservando la última selección.
 // No interfiere con la recuperación de HP, espacios ni demás recursos.
 if(window.DMAprogression1191?.restAll){const priorRest=window.DMAprogression1191.restAll;/* El botón instalado conserva su callback previo. */}
}

// 1.19.14: Los HP de Forma Salvaje y los del druida son recursos distintos.
// El DM declara los impactos y el daño, DMAid solo registra los resultados.
function activeForm(i){const d=profile(i)?.dmaWildShapeForm11913;return d?.active&&d.beast?d:null}
function quickAmount(i){const n=Number(document.getElementById('quick-val-p'+i)?.value);return Number.isFinite(n)?Math.max(1,Math.floor(n)):5}
function formBar(parent,current,max,label,isOriginal=false){
 const wrap=append(parent,'div','dma-ws-quick-bar11914'+(isOriginal?' is-original':''));
 const heading=append(wrap,'div','dma-ws-quick-bar-label11916');
 append(heading,'span','',label);
 append(heading,'strong','',`${current} / ${max||'—'}`);
 const rail=append(wrap,'div','dma-ws-quick-rail11914');
 rail.setAttribute('role','progressbar');rail.setAttribute('aria-label',label);
 rail.setAttribute('aria-valuemin','0');rail.setAttribute('aria-valuemax',String(max||0));rail.setAttribute('aria-valuenow',String(current));
 const v=append(rail,'span');v.style.width=`${Math.max(0,Math.min(100,max?current/max*100:0))}%`;
 return wrap;
}
function decorateQuick11914(){const group=document.querySelector('#quickenemygrid .quick-group');if(!group)return;
 const cards=group.querySelectorAll('.quick-enemy');
 state.players.forEach((p,i)=>{
  const data=activeForm(i),card=cards[i];if(!data||!card)return;
  const m=data.beast,ac=formAC(m),max=formMax(m),cur=Math.max(0,Number(data.hp)||0);
  const currentAC=card.querySelector('.qsub');
  if(currentAC){currentAC.textContent=`CA ${ac??'—'} · ${m.name}`;currentAC.classList.add('dma-ws-ac11914')}
  // Mientras esté transformado, sustituimos el HP estándar por solo dos barras.
  // Los botones −/+ continúan usando damageToForm11914 y no cambian su lógica.
  card.querySelector('.qhp')?.remove();
  const form=append(card,'div','dma-ws-quick11914');
  formBar(form,cur,max,'Forma Salvaje');
  formBar(form,p.hp,p.max,'Druida',true);
  const actions=card.querySelector('.hpbuttons');if(actions)actions.insertAdjacentElement('beforebegin',form);
 });
}
function damageToForm11914(i,dir,amount){const data=activeForm(i),p=state.players[i];if(!data||!p)return false;
 const max=formMax(data.beast),start=Math.max(0,Number(data.hp)||0),n=Math.max(1,Math.floor(Number(amount)||1));
 if(dir>0){data.hp=Math.min(max||start,start+n)}
 else {
   let remaining=n;
   if(p.temp>0){const absorbed=Math.min(p.temp,remaining);p.temp-=absorbed;remaining-=absorbed}
   const fromForm=Math.min(start,remaining);data.hp=Math.max(0,start-fromForm);remaining-=fromForm;
   if(Number(data.hp)===0&&start>0){
     data.active=false;data.endedByDamage=true;data.excessDamage=remaining;
     if(remaining>0){const previous=p.hp;p.hp=Math.max(0,Math.min(p.max,p.hp-remaining));if(typeof playerHPTransition==='function')playerHPTransition(i,previous,remaining)}
   }
 }
 if(typeof save==='function')save();
 if(typeof render==='function')render();
 if(typeof renderEldariaStatBlock==='function')renderEldariaStatBlock();
 return true;
}
function decorateActiveHeader11914(panel,key){if(!/^p\d+$/.test(String(key)))return;
 const i=Number(key.slice(1)),data=activeForm(i),p=state.players[i];if(!data||!p)return;
 const header=panel.querySelector('.eld-player-statblock .eld-player-stats');if(!header)return;
 const m=data.beast,ac=formAC(m),max=formMax(m),hp=Number(data.hp)||0;
 const acSpan=[...header.querySelectorAll('span')].find(x=>x.querySelector('b')?.textContent==='CA');
 const hpSpan=[...header.querySelectorAll('span')].find(x=>x.querySelector('b')?.textContent==='HP');
 if(acSpan){acSpan.replaceChildren();append(acSpan,'b','','CA forma');acSpan.append(document.createTextNode(' '+(ac??'—')))}
 if(hpSpan){hpSpan.replaceChildren();append(hpSpan,'b','','HP forma');hpSpan.append(document.createTextNode(' '+hp+'/'+(max||'—')))}
 const original=append(header,'span','dma-ws-original11914');append(original,'b','','HP druida');original.append(document.createTextNode(` ${p.hp}/${p.max}`));
}
function installDamage11914(){
 if(typeof renderQuickEnemies==='function'){
  const oldQuick=renderQuickEnemies;
  renderQuickEnemies=function(){const r=oldQuick.apply(this,arguments);try{decorateQuick11914()}catch(e){console.error('[DMAid Forma Salvaje rápido]',e)}return r};
 }
 if(typeof quickUniversalHP==='function'){
  const oldHP=quickUniversalHP;
  quickUniversalHP=function(key,dir){if(/^p\d+$/.test(String(key))){const i=Number(key.slice(1));if(activeForm(i))return damageToForm11914(i,dir,quickAmount(i))}return oldHP.apply(this,arguments)};
 }
 if(typeof renderActivePlayerBlock==='function'){
  const oldActive=renderActivePlayerBlock;
  renderActivePlayerBlock=function(panel,key){const result=oldActive.apply(this,arguments);try{decorateActiveHeader11914(panel,key)}catch(e){console.error('[DMAid Forma Salvaje CA/HP]',e)}return result};
 }
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{install();installDamage11914()});else {install();installDamage11914();}
window.DMAWildShape11913={limits,candidates,record,available,decorate};
})();
