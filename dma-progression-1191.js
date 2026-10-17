/* DMAid 1.19.1 — Recursos de Forma Salvaje, descansos grupales y avance controlado. PHB 2014. */
(function(){'use strict';
const hit={Bárbaro:12,Guerrero:10,Paladín:10,Explorador:10,Bardo:8,Clérigo:8,Druida:8,Monje:8,Pícaro:8,Brujo:8,Artífice:8,Hechicero:6,Mago:6};
const prereq={Bárbaro:[['FUE']],Bardo:[['CAR']],Clérigo:[['SAB']],Druida:[['SAB']],Guerrero:[['FUE','DES']],Monje:[['DES'],['SAB']],Paladín:[['FUE'],['CAR']],Explorador:[['DES'],['SAB']],Pícaro:[['DES']],Hechicero:[['CAR']],Brujo:[['CAR']],Mago:[['INT']],Artífice:[['INT']]};
const asi={Bárbaro:[4,8,12,16,19],Bardo:[4,8,12,16,19],Clérigo:[4,8,12,16,19],Druida:[4,8,12,16,19],Guerrero:[4,6,8,12,14,16,19],Monje:[4,8,12,16,19],Paladín:[4,8,12,16,19],Explorador:[4,8,12,16,19],Pícaro:[4,8,10,12,16,19],Hechicero:[4,8,12,16,19],Brujo:[4,8,12,16,19],Mago:[4,8,12,16,19],Artífice:[4,8,12,16,19]};
const subclassLevel={Clérigo:1,Hechicero:1,Brujo:1,Druida:2,Mago:2,Guerrero:3,Bárbaro:3,Bardo:3,Monje:3,Paladín:3,Explorador:3,Pícaro:3,Artífice:3};
const A=['FUE','DES','CON','INT','SAB','CAR'];const s=v=>String(v??'');const escape=v=>s(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function classes(i){return profile(i).classes||[]}
function total(i){return classes(i).reduce((n,c)=>n+(Number(c.level)||0),0)}
function level(i,name){return classes(i).filter(c=>c.name===name).reduce((n,c)=>n+Number(c.level||0),0)}
function ws(i){const sh=profile(i);return sh.dmaWildShape1191||(sh.dmaWildShape1191={spent:0})}
function wsCount(i){return level(i,'Druida')>=2?(level(i,'Druida')>=20?Infinity:2):0}
function wild(i,delta){const max=wsCount(i);if(!max)return;const v=ws(i);v.spent=Math.max(0,Math.min(max===Infinity?9999:max,Number(v.spent||0)+delta));save();render();renderSheets()}
function restOne(i,quiet){if(!state.players[i])return false;const p=state.players[i];const sh=profile(i);if(!quiet&&!confirm('¿Descanso largo de '+p.name+'? Requiere 8 horas y no puede beneficiarse más de una vez cada 24 horas.'))return false;
// Run the existing rest recovery for the character, without calling its confirmation or rebuilding per character.
p.hp=Math.max(1,Number(p.max)||1);p.temp=0;sh.used=Array(9).fill(0);sh.pactUsed=0;
if(sh.dmaMagic1185)sh.dmaMagic1185.concentrating=null;
const lvl=total(i),rec=Math.max(1,Math.floor(lvl/2));if(Number.isFinite(Number(sh.hitDiceSpent1185)))sh.hitDiceSpent1185=Math.max(0,Number(sh.hitDiceSpent1185)-rec);
sh.dmaRacialUsed1171={};sh.dmaResourceSpent1172={};sh.dmaReactionUsed1178=false;sh.dmaReactionSpent1178={};sh.dmaStoneSpent11617=0;
if(sh.dmaFighterResources1185)sh.dmaFighterResources1185={};if(sh.dmaClassResources1185)sh.dmaClassResources1185={};
sh.dmaWildShape1191={spent:0};sh.dmaLongRestAt1185=Date.now();return true}
function restAll(){const n=state.players.length;if(!n)return alert('No hay personajes registrados.');if(!confirm(`¿Registrar descanso largo para los ${n} personajes? Restablece PG, espacios, Forma Salvaje y recursos compatibles. Los personajes deben haber completado el descanso de 8 horas y cumplir el límite de una vez cada 24 horas.`))return;
let affected=0;state.players.forEach((p,i)=>{if(restOne(i,true))affected++});save();render();renderSheets();alert('Descanso largo aplicado a '+affected+' personaje(s). Los contadores heredados no integrados deben comprobarse manualmente.')}
let wizard=null;
function qualified(abilities,name){const checks=prereq[name]||[];return checks.every(choices=>choices.some(a=>Number(abilities[a]||0)>=13))}
function choicesFor(i){const sh=profile(i),a=sh.abilities||{};const existing=classes(i).map(c=>c.name);
const home=existing.every(n=>qualified(a,n));return Object.keys(hit).filter(n=>existing.includes(n)||(home&&qualified(a,n)))}
function open(i){if(!state.players[i])return;const old=total(i);if(old>=20)return alert('El nivel máximo total es 20.');wizard={i,name:classes(i)[0]?.name||'Druida',hpMethod:'average',hpRoll:0,sub:'',asi:'none',a1:'FUE',a2:'DES',feat:'',old};draw()}
function options(values,selected){return values.map(v=>`<option value="${escape(v)}" ${v===selected?'selected':''}>${escape(v)}</option>`).join('')}
function subclassOptions(name){const lib=typeof SUBCLASS_LIBRARY!=='undefined'?SUBCLASS_LIBRARY[name]:null;const found=[];if(lib){for(const val of Object.values(lib)){if(Array.isArray(val))found.push(...val);else if(typeof val==='object')found.push(...Object.keys(val))}}
if(name==='Druida')found.push('Moon','Land','Dreams','Shepherd','Spores','Stars','Wildfire');return [...new Set(found.map(x=>s(x)).filter(Boolean))]}
function draw(){const w=wizard;if(!w)return;const i=w.i;let d=document.getElementById('dma-level-dialog-1191');if(!d){d=document.createElement('dialog');d.id='dma-level-dialog-1191';d.className='dma-level-dialog';document.body.append(d)}
const oldLevel=level(i,w.name),nextLevel=oldLevel+1,needSub=nextLevel===(subclassLevel[w.name]||3)&&!classes(i).find(c=>c.name===w.name)?.sub,needAsi=(asi[w.name]||[]).includes(nextLevel),con=(Number(profile(i).abilities?.CON)||10),mod=Math.floor((con-10)/2),maxdie=hit[w.name]||8,avg=Math.floor(maxdie/2)+1;
const names=choicesFor(i),isNew=!oldLevel;const extra=isNew?'<p class="dma-warning">Multiclase: solo obtienes las competencias y equipo específicos de incorporación a la clase (PHB 2014), no el equipo inicial ni sus salvaciones. Revisa las nuevas competencias después de subir de nivel.</p>':'';
d.innerHTML=`<h2>⬆ Subir nivel · ${escape(state.players[i].name)}</h2><p>Nivel total <b>${w.old} → ${w.old+1}</b>. Solo se aplicará cuando confirmes las elecciones.</p><label>Clase que sube de nivel<select id="dma-lvl-class">${options(names,w.name)}</select></label><p><b>${escape(w.name)} ${nextLevel}</b> ${isNew?'(nueva multiclase)':''}</p>${extra}
<label>PG por nuevo nivel <select id="dma-lvl-hpmethod"><option value="average" ${w.hpMethod==='average'?'selected':''}>Promedio fijo (${avg})</option><option value="roll" ${w.hpMethod==='roll'?'selected':''}>Resultado de dado tirado por el jugador</option></select></label>${w.hpMethod==='roll'?`<label>Resultado del d${maxdie} (sin CON)<input id="dma-lvl-roll" type="number" min="1" max="${maxdie}" value="${w.hpRoll||''}"></label>`:''}<p>Incremento de PG máximos: <b>${Math.max(1,(w.hpMethod==='average'?avg:Number(w.hpRoll||0))+mod)}</b> (${w.hpMethod==='average'?avg:'tirada'} + CON ${mod>=0?'+':''}${mod}; mínimo 1).</p>
${needSub?`<label>Subclase obligatoria <select id="dma-lvl-sub"><option value="">Elegir subclase</option>${options(subclassOptions(w.name),w.sub)}</select></label>`:''}
${needAsi?`<fieldset><legend>Mejora de características (ASI) o dote</legend><label><select id="dma-lvl-asi"><option value="none">Seleccionar…</option><option value="two" ${w.asi==='two'?'selected':''}>+1 a dos características diferentes</option><option value="one" ${w.asi==='one'?'selected':''}>+2 a una característica</option><option value="feat" ${w.asi==='feat'?'selected':''}>Dote (opcional autorizada por el DM)</option></select></label>${w.asi==='one'||w.asi==='two'?`<label>Primera característica<select id="dma-lvl-a1">${options(A,w.a1)}</select></label>${w.asi==='two'?`<label>Segunda característica<select id="dma-lvl-a2">${options(A,w.a2)}</select></label>`:''}`:w.asi==='feat'?`<label>Nombre de dote aprobada<input id="dma-lvl-feat" value="${escape(w.feat)}" placeholder="Dote elegida"></label><small>Los efectos adicionales de la dote deben revisarse en la ficha; no se aplican automáticamente.</small>`:''}</fieldset>`:''}
<p class="dma-warning">Revisa después los nuevos rasgos, trucos, conjuros, pericias, invocaciones o elecciones de clase. Este asistente no concede automáticamente opciones que todavía no están modeladas.</p>
<div class="dma-level-buttons"><button type="button" id="dma-lvl-cancel">Cancelar</button><button type="button" class="gold" id="dma-lvl-confirm">Confirmar nivel</button></div>`;
d.querySelector('#dma-lvl-class').onchange=e=>{w.name=e.target.value;w.sub='';w.asi='none';w.hpRoll=0;draw()};d.querySelector('#dma-lvl-hpmethod').onchange=e=>{w.hpMethod=e.target.value;draw()};
const track=(selector,key,redraw=false)=>{const el=d.querySelector(selector);if(el)el.onchange=e=>{w[key]=e.target.value;if(redraw)draw()}};
track('#dma-lvl-roll','hpRoll',true);track('#dma-lvl-sub','sub');track('#dma-lvl-asi','asi',true);track('#dma-lvl-a1','a1');track('#dma-lvl-a2','a2');track('#dma-lvl-feat','feat');
d.querySelector('#dma-lvl-cancel').onclick=()=>{d.close();wizard=null};d.querySelector('#dma-lvl-confirm').onclick=commit;if(!d.open)d.showModal?.()}
function commit(){const w=wizard;if(!w)return;const i=w.i,sh=profile(i),p=state.players[i],cs=classes(i),prev=level(i,w.name),nl=prev+1,subNeed=nl===(subclassLevel[w.name]||3)&&!cs.find(c=>c.name===w.name)?.sub,asiNeed=(asi[w.name]||[]).includes(nl);
if(!choicesFor(i).includes(w.name))return alert('No se cumplen los requisitos de multiclase (mínimo 13 en las características exigidas por ambas clases).');
if(w.hpMethod==='roll'&&(!Number.isInteger(+w.hpRoll)||+w.hpRoll<1||+w.hpRoll>(hit[w.name]||8)))return alert('Introduce una tirada válida.');
if(subNeed&&!w.sub)return alert('Selecciona la subclase antes de confirmar.');if(asiNeed&&w.asi==='none')return alert('Resuelve la mejora de características o dote.');
const a={...(sh.abilities||{})};if(asiNeed){if(w.asi==='one'&&a[w.a1]+2>20)return alert('La puntuación no puede superar 20.');if(w.asi==='two'&&(w.a1===w.a2||a[w.a1]+1>20||a[w.a2]+1>20))return alert('Elige dos puntuaciones diferentes sin superar 20.');if(w.asi==='feat'&&!w.feat.trim())return alert('Escribe la dote autorizada.');}
const conMod=Math.floor(((Number(a.CON)||10)-10)/2);const gain=Math.max(1,(w.hpMethod==='average'?Math.floor((hit[w.name]||8)/2)+1:Number(w.hpRoll))+conMod);
if(prev){const c=cs.find(c=>c.name===w.name);c.level=nl;if(subNeed)c.sub=w.sub}else cs.push({name:w.name,level:1,sub:subNeed?w.sub:'',multiclassSkills:[]});
if(asiNeed){if(w.asi==='one')a[w.a1]+=2;if(w.asi==='two'){a[w.a1]++;a[w.a2]++}if(w.asi==='feat'){sh.featsV190=sh.featsV190||[];sh.featsV190.push({name:w.feat.trim(),source:`ASI ${w.name} ${nl} · DM`,unresolvedMechanics:true})}}
const extraCon=Math.floor((Number(a.CON||10)-10)/2)-conMod;
sh.abilities=a;if(extraCon){const newTotal=w.old+1;p.max+=extraCon*newTotal;p.hp+=extraCon*newTotal}p.max=Math.max(1,Number(p.max||1)+gain);p.hp=Math.min(p.max,Math.max(0,Number(p.hp||0)+gain));sh.slots=null;sh.levelUpHistory1191=sh.levelUpHistory1191||[];sh.levelUpHistory1191.push({date:new Date().toISOString(),class:w.name,level:nl,HP:gain,choice:asiNeed?w.asi:null});
const d=document.getElementById('dma-level-dialog-1191');d?.close();wizard=null;save();render();renderSheets();alert('Nivel registrado. Verifica y completa las nuevas elecciones de clase, equipo y magia en la hoja.')}
function decorateSheets(){const root=document.getElementById('sheetsplayers');if(!root)return;root.querySelectorAll('article.sheet').forEach((card,i)=>{if(!state.players[i]||card.querySelector('.dma-1191-buttons'))return;const area=card.querySelector('.dma-sheet-full')||card;const bar=document.createElement('div');bar.className='dma-1191-buttons';bar.innerHTML=`<button type="button" class="gold" data-level="${i}">⬆ Subir de nivel</button>${level(i,'Druida')>=2?`<button type="button" data-wild="${i}" data-delta="1">🌿 Forma Salvaje: ${wsCount(i)===Infinity?'∞':Math.max(0,wsCount(i)-ws(i).spent)}/${wsCount(i)===Infinity?'∞':wsCount(i)} · Usar</button><button type="button" data-wild="${i}" data-delta="-1">↶ Devolver uso</button>`:''}`;area.appendChild(bar)});
root.querySelectorAll('.dma-long-rest').forEach(el=>el.remove());}
function decorateCombat(){
 const toolbar=document.querySelector('.eld-initiative-toolbar');
 if(toolbar&&!document.getElementById('dma-rest-all-1191')){
  const b=document.createElement('button');b.id='dma-rest-all-1191';b.type='button';
  b.textContent='🌙 Descanso largo · Todo el grupo';b.onclick=restAll;toolbar.append(b);
 }
 // The former campaign-wide Wild Shape roster is deliberately removed.
 // Each character now owns the control within their own class features.
 document.getElementById('dma-wild-combat-1191')?.remove();
}
function installWildShapeInClassPanel(){
 if(typeof dmaGroupCombatStat11615!=='function')return;
 const previous=dmaGroupCombatStat11615;
 dmaGroupCombatStat11615=function(panel,key){
  previous(panel,key);
  if(!String(key||'').startsWith('p'))return;
  const i=Number(key.slice(1));
  if(!Number.isInteger(i)||!state.players[i]||level(i,'Druida')<2)return;
  const root=panel?.querySelector('.eld-player-statblock');
  const classPanel=root?.querySelector('.dma-four-class-11615');
  if(!classPanel)return;
  const target=classPanel.querySelector('.dma-unified-body-1177')||classPanel;
  target.querySelector('.dma-wild-class-1192')?.remove();
  const uses=wsCount(i),spent=Number(ws(i).spent||0),available=uses===Infinity?'∞':Math.max(0,uses-spent);
  const maxLabel=uses===Infinity?'∞':String(uses);
  const section=document.createElement('section');section.className='dma-wild-class-1192';
  section.innerHTML=`<h4>🌿 Forma Salvaje · Usos</h4><p><b>${available} / ${maxLabel} disponibles</b> · ${escape(state.players[i].name)}</p><div class="dma-wild-class-controls-1192"><button type="button" data-wild="${i}" data-delta="1" ${uses!==Infinity&&spent>=uses?'disabled':''}>Usar 1</button><button type="button" data-wild="${i}" data-delta="-1" ${spent<=0?'disabled':''}>Devolver 1</button></div><small>Recurso individual. Se recupera con descanso corto o largo.</small>`;
  target.append(section);
 };
}

function refresh(){decorateSheets();decorateCombat()}
function install(){installWildShapeInClassPanel();const root=document.body;root.addEventListener('click',e=>{const b=e.target.closest('[data-wild]');if(b){wild(Number(b.dataset.wild),Number(b.dataset.delta));return}const l=e.target.closest('[data-level]');if(l)open(Number(l.dataset.level))});
const oldSheets=renderSheets;renderSheets=function(){oldSheets();refresh()};const oldRender=render;render=function(){oldRender();decorateCombat()};refresh();}
window.DMAprogression1191={wild,restAll,open,qualified};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);else install();
})();
