/* DMAid 1.18.7: editable spell preparation + 2014 long rest. No dice are rolled. */
(function(){'use strict';
const clsName={'cleric':'Clérigo','druid':'Druida'};
const specs={Clérigo:{can:[3,3,3,4,4,4,4,4,4,5],prepared:true},Druida:{can:[2,2,2,3,3,3,3,3,3,4],prepared:true},Mago:{can:[3,3,3,4,4,4,4,4,4,5],prepared:true},Bardo:{can:[2,2,2,3,3,3,3,3,3,4]},Hechicero:{can:[4,4,4,5,5,5,5,5,5,6]},Brujo:{can:[2,2,2,2,3,3,3,3,3,4]},Artífice:{can:[2,2,2,2,2,2,2,2,2,3],prepared:true}};
const knownByLevel={Bardo:[4,5,6,7,8,9,10,11,12,14],Hechicero:[2,3,4,5,6,7,8,9,10,11],Brujo:[2,3,4,5,6,7,8,9,10,10]};
const domain={Knowledge:[[1,'Command'],[1,'Identify'],[3,'Augury'],[3,'Suggestion'],[5,'Nondetection'],[5,'Speak with Dead'],[7,'Arcane Eye'],[7,'Confusion'],[9,'Legend Lore'],[9,'Scrying']]};
function rows(i){return (profile(i).classes||[]).filter(c=>Number(c.level)>0)}
const TEST_SPELLS_1185=[['Thorn Whip',0,'Druida','PHB'],['Spike Growth',2,'Druida','PHB'],['Pass without Trace',2,'Druida','PHB'],['Augury',2,'Clérigo','PHB'],['Suggestion',2,'Bardo,Hechicero,Brujo,Mago','PHB'],['Toll the Dead',0,'Clérigo,Brujo,Mago','XGE'],['Light',0,'Clérigo,Mago,Bardo,Hechicero','PHB'],['Spiritual Weapon',2,'Clérigo','PHB'],['Sanctuary',1,'Clérigo','PHB'],['Goodberry',1,'Druida,Explorador','PHB']].map(([n,l,classes,source])=>({n,l,classes:classes.split(','),source,summary:'Consulta la descripción indexada en el compendio para detalles de reglas.',concentration:false}));
// D&D 5e 2014 rules / Tasha's: Circle of Spores granted spells. Supplemental
// metadata is only used when the loaded catalog has no indexed record.
const BONUS_SPORES_1194=[
 ['Chill Touch',0,'120 pies','1 acción','1d8 necrótico; impide recuperar PG hasta el comienzo de tu siguiente turno.','TCE'],
 ['Blindness/Deafness',2,'30 pies','1 acción','Salvación de CON; ceguera o sordera hasta 1 minuto (nueva salvación al final de cada turno).','PHB'],
 ['Gentle Repose',2,'Toque','1 acción','Protege un cadáver durante 10 días de la descomposición y de convertirse en no muerto; ritual.','PHB'],
 ['Animate Dead',3,'10 pies','1 minuto','Crea o recupera el control de un no muerto a partir de restos apropiados.','PHB'],
 ['Gaseous Form',3,'Toque','1 acción','Concentración hasta 1 hora; el objetivo voluntario adopta forma de nube gaseosa.','PHB'],
 ['Blight',4,'30 pies','1 acción','Salvación de CON; 8d8 necrótico en fallo, mitad en éxito; efectos especiales con plantas.','PHB'],
 ['Confusion',4,'90 pies','1 acción','Concentración hasta 1 minuto; salvación de SAB, conducta impredecible en un área.','PHB'],
 ['Cloudkill',5,'120 pies','1 acción','Concentración hasta 10 minutos; nube tóxica de radio 20 pies, salvación de CON.','PHB'],
 ['Contagion',5,'Toque','1 acción','Ataque de conjuro cuerpo a cuerpo que inflige envenenamiento; salvaciones posteriores determinan la enfermedad.','PHB']
].map(([n,l,range,time,summary,source])=>({n,l,classes:['Druida'],source,range,time,summary,concentration:/Gaseous Form|Confusion|Cloudkill/.test(n),supplement1194:true}));
window.DMA_SUBCLASS_SPELLS_1194=BONUS_SPORES_1194;
const spellKey1189=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');
function names(){try{
 const imported=window.DMA_SPELL_CATALOG_BRIDGE?.()||[];
 const trusted=window.DMA_DRUID_SPELLS_1189||[];
 const records=[...trusted,...(typeof SPELL_LIBRARY!=='undefined'?SPELL_LIBRARY:[]),...imported,...BONUS_SPORES_1194,...TEST_SPELLS_1185];
 const found=new Map();
 for(const x of records){if(!x||!x.n||!Number.isInteger(Number(x.l)))continue;
 if(/2024|XPHB|PHB24/i.test(String(x.source||'')))continue;
 const k=spellKey1189(x.n);if(!found.has(k))found.set(k,x);
 }return [...found.values()].sort((a,b)=>a.l-b.l||a.n.localeCompare(b.n));
 }catch(e){console.warn('[DMAid] Error cargando catálogo mágico',e);return window.DMA_DRUID_SPELLS_1189||[]}}
function label(x){return String(x.n||'')}
// Attribute-safe JS string literal: JSON uses double quotes which must be HTML-escaped inside onclick="...".
function safeArg(value){return JSON.stringify(String(value)).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
function sourceOK(x,c){return (x.classes||[]).some(y=>String(y).toLowerCase()===String(c).toLowerCase())}
function allowed(i,x){const cs=rows(i);return cs.some(c=>{if(!sourceOK(x,c.name))return false;let l=Number(c.level);if(x.l===0)return !!specs[c.name];const progression={Clérigo:l,Druida:l,Mago:l,Bardo:l,Hechicero:l,Brujo:l,Artífice:Math.ceil(l/2),Paladín:Math.ceil(l/2),Explorador:Math.ceil(l/2)}[c.name]||0;let max=[0,2,3,4,5,6,7,8,9,9][Math.min(9,Math.max(0,Math.floor((progression+1)/2)))];if(['Clérigo','Druida','Mago','Bardo','Hechicero'].includes(c.name))max=Math.ceil(l/2);if(c.name==='Brujo')max=Math.min(5,Math.ceil(l/2));if(c.name==='Paladín'||c.name==='Explorador')max=Math.ceil(l/4);if(c.name==='Artífice')max=Math.ceil(l/4);return Number(x.l)<=max})}
function limits(i){const cs=rows(i),maxCan=cs.reduce((n,c)=>{const x=specs[c.name];return n+(x?x.can[Math.min(9,Number(c.level)-1)]||x.can[9]:0)},0);
const maxPrepared=cs.reduce((n,c)=>{const l=Number(c.level),s=specs[c.name];if(!s?.prepared)return n;const a=profile(i).abilities||{};const ab=c.name==='Artífice'?'INT':c.name==='Mago'?'INT':'SAB';return n+Math.max(1,l+(Math.floor((Number(a[ab]||10)-10)/2)))},0);
return {maxCan,maxPrepared}}
function druidCircle(i){return rows(i).find(c=>c.name==='Druida')||null}
function spores(i){const d=druidCircle(i);return d&&/spore|espora/i.test(d.sub||'')?Number(d.level)||0:0}
function bonusCantrips(i){return spores(i)>=2?['Chill Touch']:[]}
function domains(i){const result=[];rows(i).forEach(c=>{if(c.name==='Clérigo'&&/knowledge|conocimiento/i.test(c.sub||''))for(const [lvl,name] of domain.Knowledge)if(Number(c.level)>=lvl)result.push(name)});
 const lv=spores(i);
 for(const [need,ns] of [[3,['Blindness/Deafness','Gentle Repose']],[5,['Animate Dead','Gaseous Form']],[7,['Blight','Confusion']],[9,['Cloudkill','Contagion']]])if(lv>=need)result.push(...ns);
 return [...new Set(result)]}
function syncGranted(i){const sh=profile(i),d=data(i),auto=[...bonusCantrips(i),...domains(i)];
 const old=Array.isArray(sh.dmaGranted1194)?sh.dmaGranted1194:[];
 const manual=[...d.cantrips,...d.prepared,...d.known];
 const present=Array.isArray(sh.spells)?sh.spells:[];
 sh.spells=[...new Set([...present.filter(n=>!old.some(x=>spellKey1189(x)===spellKey1189(n))),...manual,...auto])];
 sh.dmaGranted1194=auto;
 return auto}

function data(i){const sh=profile(i);if(!sh.dmaMagic1185)sh.dmaMagic1185={cantrips:[],prepared:[],known:[],concentrating:null};return sh.dmaMagic1185}
function findSpell(n){return names().find(x=>spellKey1189(x.n)===spellKey1189(n))}
function sortList(a){return a.slice().sort((x,y)=>(findSpell(x)?.l??99)-(findSpell(y)?.l??99)||x.localeCompare(y))}
function toggle(i,kind,n){
  try {
    if(!state.players[i])throw Error('Personaje no encontrado.');
    const x=findSpell(n);
    if(!x)throw Error('El conjuro no está indexado: '+n);
    if(!allowed(i,x))throw Error('El conjuro no está permitido para la clase y nivel actuales: '+n);
    const d=data(i),a=d[kind],limit=limits(i);
    if([...bonusCantrips(i),...domains(i)].some(z=>spellKey1189(z)===spellKey1189(n)))return alert('Este conjuro ya está concedido automáticamente por la subclase.');
    if(!Array.isArray(a))throw Error('Tipo de selección desconocido: '+kind);
    const exists=a.includes(n);
    if(!exists&&kind==='cantrips'&&a.length>=limit.maxCan)return alert('Máximo de trucos alcanzado.');
    if(!exists&&kind==='prepared'&&a.length>=limit.maxPrepared)return alert('Máximo de conjuros preparados alcanzado.');
    d[kind]=exists?a.filter(z=>z!==n):[...a,n];
    syncGranted(i);
    save();
    // Actualizar la ficha sin reconstruir todas las pantallas de combate.
    // La reconstrucción global anterior podía interrumpir esta acción.
    renderSheets();
    const editor=document.getElementById('dma-magic-'+i);
    if(editor){editor.open=true;editor.dataset.lastChange='ok';}
  }catch(error){
    console.error('[DMAid 1.18.7] No se pudo modificar el conjuro',error);
    alert('No se pudo guardar el conjuro: '+(error?.message||String(error)));
  }
}
function spend(i,level,undo){const sh=profile(i),calc=slotCalc(i),total=(sh.slots||calc.slots)[level-1]||0;sh.used=Array.isArray(sh.used)?sh.used:Array(9).fill(0);const current=Number(sh.used[level-1])||0;sh.used[level-1]=Math.max(0,Math.min(total,current+(undo?-1:1)));save();renderSheets();}
function startConcentration(i,n){const d=data(i);d.concentrating=d.concentrating===n?null:n;save();renderSheets();}
function spellRow(i,n,k){const s=findSpell(n);if(!s)return `<div>${esc(n)} <small>(No indexado todavía)</small></div>`;return `<div class="dma-magic-choice"><span><b>${esc(n)}</b> <small>· ${s.l===0?'Truco':'Nivel '+s.l} · ${esc(s.source||'')} ${s.concentration?'· Concentración':''}</small></span>${k==='domain'?'<small>Siempre preparado</small>':`<button class="small" onclick="DMAmagic1185.toggle(${i},'${k}',${safeArg(n)})">Quitar</button>`}${s.concentration?`<button class="small" onclick="DMAmagic1185.concentrate(${i},${safeArg(n)})">${data(i).concentrating===n?'Detener concentración':'Concentrar'}</button>`:''}</div>`}
function batchState(i){return window.dmaBatch1195||(window.dmaBatch1195={});}
function batchChosen(i){const all=batchState(i);return all[i]||(all[i]=[])}
function batchMark(i,n,yes){const arr=batchChosen(i);const key=spellKey1189(n);const old=arr.findIndex(x=>spellKey1189(x)===key);if(yes&&old<0)arr.push(n);if(!yes&&old>=0)arr.splice(old,1);}
function batchApply(i){
 try{
  if(!state.players[i])throw Error('Personaje no encontrado');
  const chosen=batchChosen(i),d=data(i),li=limits(i),auto=[...bonusCantrips(i),...domains(i)];
  const can=new Set(d.cantrips),prep=new Set(d.prepared),known=new Set(d.known);
  let added=0;
  for(const n of chosen){const x=findSpell(n);if(!x||!allowed(i,x))throw Error('No permitido por nivel o clase: '+n);
   if(auto.some(z=>spellKey1189(z)===spellKey1189(n)))continue;
   const kind=x.l===0?'cantrips':li.maxPrepared>0?'prepared':'known';
   const set=kind==='cantrips'?can:kind==='prepared'?prep:known;
   if(!set.has(x.n)){set.add(x.n);added++;}
  }
  if(can.size>li.maxCan)throw Error('Trucos: '+can.size+' seleccionados, máximo '+li.maxCan);
  if(prep.size>li.maxPrepared)throw Error('Conjuros preparados: '+prep.size+' seleccionados, máximo '+li.maxPrepared);
  d.cantrips=[...can];d.prepared=[...prep];d.known=[...known];batchState(i)[i]=[];
  syncGranted(i);save();
  renderSheets();
  const editor=document.getElementById('dma-magic-'+i);if(editor)editor.open=true;
  alert(added+' conjuros/trucos añadidos a '+state.players[i].name+'.');
 }catch(e){alert('No se aplicó la selección: '+e.message);console.error('[DMAid 1.19.5] Preparación múltiple',e)}
}
function batchSelectVisible(i){const editor=document.getElementById('dma-magic-'+i);if(!editor)return;
 editor.querySelectorAll('input.dma-batch-check1195:not(:disabled)').forEach(c=>{c.checked=true;batchMark(i,c.value,true)});
}
function batchClear(i){batchState(i)[i]=[];const editor=document.getElementById('dma-magic-'+i);editor?.querySelectorAll('input.dma-batch-check1195').forEach(c=>c.checked=false)}
function setLevel(i,v){window.dmaMagicLevel1195=window.dmaMagicLevel1195||{};window.dmaMagicLevel1195[i]=v;const el=document.getElementById('dma-magic-'+i);if(!el)return;el.outerHTML=panel(i);document.getElementById('dma-magic-'+i).open=true}
function panel(i){syncGranted(i);const sh=profile(i),d=data(i),li=limits(i),ds=domains(i),bonus=bonusCantrips(i),current=window.dmaMagicSearch1185?.[i]||'',level=window.dmaMagicLevel1195?.[i]??'',available=names().filter(x=>allowed(i,x)&&(level===''||Number(x.l)===Number(level))&&(!current||x.n.toLowerCase().includes(current.toLowerCase()))).slice(0,200);const spellSlots=slotCalc(i).slots,slots=sh.slots||spellSlots;return `<details class="dma-magic-editor" id="dma-magic-${i}"><summary>✨ Conjuros y trucos · editar personaje</summary><div class="dma-magic-inside"><p class="muted">Se guardan con la ficha y se pueden modificar después de crearla. En clérigos y druidas, prepara conjuros tras un descanso largo según PHB 2014. Los conjuros de dominio no consumen cupo.</p><div class="dma-magic-metrics"><span>Trucos elegidos <b>${d.cantrips.length}/${li.maxCan}</b></span><span>Trucos extra <b>${bonus.length}</b></span><span>Preparados <b>${d.prepared.length}/${li.maxPrepared||'—'}</b></span><span>Siempre preparados <b>${ds.length}</b></span></div><div><b>Trucos conocidos</b>${sortList(d.cantrips).map(n=>spellRow(i,n,'cantrips')).join('')||'<p class="muted">Sin seleccionar</p>'}</div>${bonus.length?`<div><b>Trucos extra de subclase (no ocupan cupo)</b>${bonus.map(n=>spellRow(i,n,'domain')).join('')}</div>`:''}<div><b>Conjuros preparados</b>${sortList(d.prepared).map(n=>spellRow(i,n,'prepared')).join('')||'<p class="muted">Sin seleccionar</p>'}</div>${ds.length?`<div><b>Dominio / subclase</b>${ds.map(n=>spellRow(i,n,'domain')).join('')}</div>`:''}<div><label>Buscar en el catálogo indexado <input type="search" placeholder="Nombre del conjuro" value="${esc(current)}" oninput="DMAmagic1185.search(${i},this.value)"></label><label>Filtrar por nivel <select onchange="DMAmagic1185.setLevel(${i},this.value)"><option value="">Todos los niveles</option>${Array.from({length:10},(_,lv)=>`<option value="${lv}" ${String(level)===String(lv)?'selected':''}>${lv===0?'Trucos':'Nivel '+lv}</option>`).join('')}</select></label><div class="dma-batch-bar1195"><button type="button" class="small" onclick="DMAmagic1185.selectVisible(${i})">Seleccionar visibles</button><button type="button" class="small" onclick="DMAmagic1185.clearBatch(${i})">Limpiar selección</button><button type="button" class="small gold" onclick="DMAmagic1185.applyBatch(${i})">Preparar selección completa</button><small>Se añaden a los existentes. Se valida el límite antes de guardar.</small></div><div class="dma-magic-options">${available.map(x=>{const has=d.cantrips.includes(x.n)||d.prepared.includes(x.n)||d.known.includes(x.n)||ds.includes(x.n)||bonus.includes(x.n);const kind=x.l===0?'cantrips':li.maxPrepared>0?'prepared':'known';return `<div class="dma-magic-choice"><label class="dma-batch-label1195"><input class="dma-batch-check1195" type="checkbox" value="${esc(x.n)}" ${has?'disabled':''} ${batchChosen(i).some(n=>spellKey1189(n)===spellKey1189(x.n))?'checked':''} onchange="DMAmagic1185.batchMark(${i},this.value,this.checked)"><span>${esc(x.n)} <small>· ${x.l===0?'Truco':'Nivel '+x.l} · ${esc(x.source||'')}</small></span></label><button class="small" ${has?'disabled':''} onclick="DMAmagic1185.toggle(${i},'${kind}',${safeArg(x.n)})">${has?'Asignado':'Añadir'}</button></div>`}).join('')||'<p>No hay resultados. Revisa si cargaste el libro correspondiente en el Compendio de conjuros.</p>'}</div></div><div><b>Espacios de conjuro</b><div class="dma-magic-metrics">${slots.map((total,j)=>total?`<span>Nivel ${j+1}: <b>${Math.max(0,total-(Number(sh.used?.[j])||0))}/${total}</b> <button class="small" onclick="DMAmagic1185.spend(${i},${j+1},false)">Usar</button> <button class="small" onclick="DMAmagic1185.spend(${i},${j+1},true)">Devolver</button></span>`:'').join('')}</div></div><p class="muted">Concentración activa: ${esc(d.concentrating||'Ninguna')}. El DM registra lanzamientos y efectos; DMAid no realiza tiradas.</p></div></details>`}
function rest(i){const p=state.players[i];if(!p)return;if(!confirm('¿Completar descanso largo de '+p.name+'? Recuperará PG, espacios y recursos de descanso largo. Requiere al menos 8 horas de descanso y solo puede beneficiarse una vez cada 24 horas (PHB 2014).'))return;const sh=profile(i);p.hp=Math.max(1,Number(p.max)||1);p.temp=0;sh.used=Array(9).fill(0);sh.pactUsed=0;if(sh.dmaMagic1185)sh.dmaMagic1185.concentrating=null;
// PHB 2014: regain spent Hit Dice up to half total (minimum one).
const level=rows(i).reduce((n,c)=>n+Number(c.level),0);const recover=Math.max(1,Math.floor(level/2));if(Number.isFinite(Number(sh.hitDiceSpent1185)))sh.hitDiceSpent1185=Math.max(0,Number(sh.hitDiceSpent1185)-recover);
sh.dmaRacialUsed1171={};sh.dmaResourceSpent1172={};sh.dmaReactionUsed1178=false;sh.dmaReactionSpent1178={};sh.dmaStoneSpent11617=0;
if(sh.dmaFighterResources1185)sh.dmaFighterResources1185={};if(sh.dmaClassResources1185)sh.dmaClassResources1185={};
// Class-specific counters present in this build may be separate; do not overwrite unknown tracking structures.
sh.dmaLongRestAt1185=Date.now();save();renderSheets();}
function decorate(){const target=document.getElementById('sheetsplayers');if(!target)return;target.querySelectorAll('article.sheet').forEach((card,i)=>{if(!state.players[i]||card.querySelector('.dma-magic-editor'))return;const area=card.querySelector('.dma-sheet-full')||card;const wrap=document.createElement('div');wrap.className='dma-magic-rest-container';wrap.innerHTML=panel(i)+`<div class="dma-long-rest"><button type="button" class="gold" onclick="DMAmagic1185.rest(${i})">🌙 Descanso largo · ${esc(state.players[i].name)}</button><small>Restaura PG máximos, espacios normales y de pacto, recursos raciales y reacción. Recupera hasta la mitad de dados de golpe gastados (mínimo 1). No modifica conjuros preparados.</small></div>`;area.appendChild(wrap)})}
const prior=renderSheets;renderSheets=function(){prior();decorate()};
window.dmaMagicSearch1185={};
function search(i,v){window.dmaMagicSearch1185[i]=v;const old=document.getElementById('dma-magic-'+i);if(!old)return;const focused=document.activeElement===old.querySelector('input[type=search]');const position=old.querySelector('input[type=search]')?.selectionStart;old.outerHTML=panel(i);if(focused){const box=document.getElementById('dma-magic-'+i)?.querySelector('input[type=search]');box?.focus();try{box?.setSelectionRange(position,position)}catch(e){}}}
window.DMAmagic1185={syncGranted,domains,bonusCantrips,toggle,spend,concentrate:startConcentration,rest,search,batchMark,batchApply,selectVisible:batchSelectVisible,clearBatch:batchClear,setLevel,open(i){switchTab('sheets');renderSheets();const el=document.getElementById('dma-magic-'+i);el?.scrollIntoView({block:'start'});}};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{try{renderSheets()}catch(e){console.warn('Magic editor',e)}});else try{renderSheets()}catch(e){}
})();
