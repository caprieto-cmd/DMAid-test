/* DM.AID 1.19.25. Invocaciones como entidades persistentes de daño rápido.
   El DM elige criaturas y registra HP. No se lanzan dados ni se decide un impacto.
*/
(function(){'use strict';
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const key=x=>String(x||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');
const num=x=>Number.isFinite(Number(x))?Number(x):0;
const cr=x=>window.DMASummonBrowser11910?.asCR?.(x)??null;
let serial=0;
function owner(i){return state.players?.[i]?profile(i):null}
function data(i){const sh=owner(i);if(!sh)return null;if(!sh.dmaSummons11925||!Array.isArray(sh.dmaSummons11925.groups))sh.dmaSummons11925={groups:[]};return sh.dmaSummons11925}
function monsters(){return typeof bestiaryV3Entries==='function'?bestiaryV3Entries():[]}
function rich(m){return typeof v10RichVersion==='function'?v10RichVersion(m):m}
function hitDice(m){if(!m)return null;const f=m.stat?.hpFormula||m.stat?.hp?.formula||m.hp?.formula||m.hpFormula||'';const match=String(f).match(/\b(\d+)\s*d\s*(?:4|6|8|10|12|20)\b/i);return match?Number(match[1]):null}
function stats(m,applyMighty=false){const item=rich(m)||m,base=num(item?.hp?.average??item?.hp),hd=hitDice(item),extra=applyMighty&&hd!==null?2*hd:0;return {base:base>0?base:null,hitDice:hd,bonus:applyMighty?(hd===null?null:extra):0,max:base>0&&(!applyMighty||hd!==null)?base+extra:null}}
function beast(m){return /beast|bestia/i.test(String(m?.kind||m?.stat?.type||m?.type||''))}
function eligible(i,m){return window.DMAShepherd11924?.level?.(i)>=6&&/beast|bestia|fey|fe[eé]ric/i.test(String(m?.kind||m?.stat?.type||m?.type||''))}
function snapshot(m){const raw=rich(m)||m;return {id:String(raw.id||''),name:String(raw.name||'Criatura'),kind:raw.kind||'Criatura',cr:raw.cr,source:raw.source,ac:raw.ac,hp:raw.hp,stat:JSON.parse(JSON.stringify(raw.stat||{})),traits:raw.traits||'',actions:raw.actions||''}}
function makeUnit(m,applyMighty=false){const x=snapshot(m),s=stats(x,applyMighty);if(!Number.isFinite(s.max)||s.max<1)return null;return {id:'su'+Date.now().toString(36)+'-'+(++serial),name:x.name,creatureId:x.id,cr:x.cr,ac:Number(x.ac)||10,max:s.max,hp:s.max,temp:0,hd:s.hitDice,mighty:applyMighty,originalHP:s.base,snapshot:x}}
function createGroup(i,params,units){const d=data(i);if(!d||!units?.length)return false;d.groups.push({id:'sg'+Date.now().toString(36)+'-'+(++serial),source:params.source||'spell',spell:params.spell||'',slot:Number(params.slot)||0,concentration:!!params.concentration,active:true,units,limit:params.limit||units.length,createdAt:Date.now()});save();redraw();return true}
function redraw(){try{if(typeof renderQuickEnemies==='function')renderQuickEnemies();}catch(e){console.error('[DM.AID Invocaciones] Redibujo',e)}}
function onCast(i,name,slot){const spell=window.DMADruidRules1199?.getSpell?.(name);const meta=spell?.mechanics?.summon;const normalized=key(name);
 // Sólo se crean tarjetas para invocaciones que generan criaturas nuevas. Giant Insect transforma insectos existentes.
 const known=/^(conjureanimals|conjurewoodlandbeings|conjureminorelementals|conjureelemental|conjurefey|summonbeast|summonfey|summonelemental)$/.test(normalized);
 if(!known)return false;const sh=owner(i);if(!sh)return false;
 sh.dmaSummonPending11925={name,slot:Number(slot)||Number(spell?.l)||0,stamp:Date.now()};save();return true;
}
function pending(i,name){const sh=owner(i);const p=sh?.dmaSummonPending11925;return p&&key(p.name)===key(name)?p:null}
function registerSpell(i,params){const p=pending(i,params.name);if(!p){alert('Primero registra el lanzamiento desde el botón «Lanzar». Después selecciona las criaturas.');return false}
 if(p.closed){alert('Esta invocación ya terminó. Registra otro lanzamiento si quieres convocar nuevas criaturas.');return false}
 if(Number(params.slot)!==p.slot){alert('El nivel del espacio debe coincidir con el lanzamiento ya registrado (nivel '+p.slot+').');return false}
 const qty=Math.floor(Number(params.count)||0);if(qty<1||qty>32){alert('Cantidad de criaturas no permitida.');return false}
 let x;
 if(params.spirit){const stat=window.DMASummonBrowser11910?.spiritStats?.(params.name,params.form,params.slot,params.attackBonus,params.dc);if(!stat)return false;
 const a=Array.isArray(stat.abilities)?stat.abilities:[];
 x={id:'espiritu-'+key(params.name)+'-'+key(params.form),name:stat.name+' · '+(params.form||''),kind:stat.kind||'Espíritu',source:'TCE',cr:'—',ac:stat.ac,hp:stat.hp,
 stat:{hpFormula:null,str:a[0],dex:a[1],con:a[2],int:a[3],wis:a[4],cha:a[5],speed:stat.speed,senses:stat.senses,languages:stat.languages,resist:stat.resist,conditionImmune:stat.conditions,
 trait:(stat.traits||[]).map(t=>({name:'Rasgo',entries:[t]})),action:[{name:'Ataques',entries:['Realiza '+stat.attacks+' ataque(s) por acción. '+stat.attack]}],bonus:stat.bonusAction?[{name:'Acción adicional',entries:[stat.bonusAction]}]:[]},
 traits:(stat.traits||[]).join(' · '),actions:stat.attack};
 }else{x=monsters().find(m=>String(m.id)===String(params.monsterId));if(!x){alert('Criatura ausente del bestiario.');return false}
 if(cr(x)==null||cr(x)>Number(params.crMax)||!Number.isFinite(Number(params.crMax))){alert('Esta criatura supera el CR permitido.');return false}
 // Comprobar también tipo de criatura, no sólo CR. Esta capa protege el registro aunque el selector se manipule.
 const allowed=window.DMASummonBrowser11910?.filterMonsters?.(params.name,Number(params.crMax),params.form||'all',params.form||'all')||[];
 if(!allowed.some(m=>String(m.id)===String(x.id))){alert('Esta criatura no corresponde al tipo o forma permitidos por el conjuro.');return false}
 }
 const source='spell';const hasMighty=eligible(i,x)&&!params.spirit;
 const u=makeUnit(x,hasMighty);if(!u){alert('Faltan HP o dados de golpe verificables. No se registró la criatura: carga una ficha completa.');return false}
 const d=data(i);let group=d.groups.find(g=>g.active&&g.source==='spell'&&key(g.spell)===key(params.name)&&g.createdAt===p.groupStarted);
 if(group && (Number(group.crMax)!==Number(params.crMax) || String(group.form||'all')!==String(params.form||'all') || !!group.spirit!==!!params.spirit)){
   alert('La opción de cantidad, CR y forma pertenece a otro lanzamiento. Mantén la opción inicial para completar este grupo.');return false;
 }
 const remaining=group?group.limit-group.units.length:qty;
 if(qty>remaining){alert('Sólo quedan '+remaining+' criaturas por registrar de este lanzamiento.');return false}
 const n=qty;
 if(n<=0){alert('Ya registraste todas las criaturas correspondientes a este lanzamiento.');return false}
 const units=Array.from({length:n},()=>makeUnit(x,hasMighty));
 if(!group){const total=Math.floor(Number(params.total)||qty);if(total<qty||total>32)return false;
 const ok=createGroup(i,{source,spell:params.name,slot:p.slot,concentration:!!params.concentration,limit:total},units);if(!ok)return false;
 const added=d.groups[d.groups.length-1];added.crMax=Number(params.crMax);added.form=String(params.form||'all');added.spirit=!!params.spirit;
 p.groupStarted=d.groups[d.groups.length-1].createdAt;
 }else{group.units.push(...units);save();redraw()}
 // Invocar bestias no les concede HP temporales del tótem Oso de forma retroactiva.
 return true}
function registerFaithful(i,ids,mighty){const d=data(i);if(!d||!Array.isArray(ids)||ids.length!==4)return false;
 const old=d.groups.find(g=>g.source==='faithful'&&g.active);if(old)return false;
 const all=monsters();let units=[];
 for(const id of ids){const m=all.find(x=>String(x.id)===String(id));if(!m||!beast(m)||cr(m)==null||cr(m)>2)return false;const u=makeUnit(m,!!mighty);if(!u)return false;units.push(u)}
 return createGroup(i,{source:'faithful',spell:'Faithful Summons',slot:9,concentration:false,limit:4},units)}
function endFaithful(i){const d=data(i);if(!d)return;for(const g of d.groups)if(g.source==='faithful')g.active=false;save();redraw()}
function groupOf(i,id){return data(i)?.groups.find(g=>g.id===id)||null}
function unitOf(i,groupId,unitId){return groupOf(i,groupId)?.units.find(u=>u.id===unitId)||null}
function damage(i,gid,uid,delta){const u=unitOf(i,gid,uid);if(!u)return false;const amount=Math.min(100000,Math.max(1,Math.floor(num(delta))));let old=u.hp;
 if(delta<0){let remaining=amount;const absorbed=Math.min(u.temp||0,remaining);u.temp-=absorbed;remaining-=absorbed;u.hp=Math.max(0,u.hp-remaining)}else u.hp=Math.min(u.max,u.hp+amount);
 save();redraw();return {old,newHP:u.hp,temp:u.temp}}
function applyHP(i,gid,uid,amount,dir){const u=unitOf(i,gid,uid);if(!u)return false;
 if(u.hp===0&&dir>0){alert('La criatura invocada desapareció al llegar a 0 HP. No puede recuperarse mediante curación.');return false}const n=Math.max(1,Math.floor(num(amount)||5));let remaining=n;if(dir<0){const take=Math.min(u.temp||0,remaining);u.temp-=take;remaining-=take;u.hp=Math.max(0,u.hp-remaining)}else u.hp=Math.min(u.max,u.hp+n);save();redraw();return true}
function setTemp(i,gid,uid,newTemp){const u=unitOf(i,gid,uid);if(!u)return false;u.temp=Math.max(0,Math.floor(num(newTemp)));save();redraw();return true}
function applyBear(i,gid,uid){const u=unitOf(i,gid,uid),shep=window.DMAShepherd11924?.stateFor?.(i);if(!u||u.hp<=0||shep?.kind!=='bear'||!shep?.active){alert('Debes haber invocado el tótem Oso.');return false}
 if(!confirm('Confirma que esta criatura ya estaba invocada, fue elegida y estaba dentro del aura cuando apareció el tótem Oso. No basta con entrar después en el aura.'))return false;
 u.temp=Math.max(u.temp||0,5+window.DMAShepherd11924.level(i));save();redraw();return true}
function guardian(i,gid,uid){const u=unitOf(i,gid,uid),shep=window.DMAShepherd11924?.stateFor?.(i),lv=window.DMAShepherd11924?.level?.(i)||0;
 if(!u||u.hp<=0||lv<10||!shep?.active)return false;if(!confirm('¿Esta criatura elegible terminó su turno dentro del aura del tótem? Recuperará '+Math.floor(lv/2)+' HP.'))return false;
 u.hp=Math.min(u.max,u.hp+Math.floor(lv/2));save();redraw();return true}
function endGroup(i,id){const g=groupOf(i,id);if(!g||!confirm('¿Finalizar esta invocación y retirar sus tarjetas de daño?'))return false;g.active=false;
 if(g.source==='spell'){const p=pending(i,g.spell);if(p&&p.groupStarted===g.createdAt)p.closed=true;}if(g.source==='faithful') {const sh=window.DMAShepherd11924?.stateFor?.(i);if(sh)sh.faithfulActive=false}save();redraw();return true}
function liveGroups(){const rows=[];state.players?.forEach((p,i)=>{const d=data(i);if(!d)return;
 for(const g of d.groups){if(!g.active)continue;
 if(g.source==='faithful'&&!window.DMAShepherd11924?.stateFor?.(i)?.faithfulActive){g.active=false;continue}
 // Un conjuro de invocación que requiere concentración termina cuando esta se pierde.
 if(g.concentration&&key(owner(i)?.dmaMagic1185?.concentrating)!==key(g.spell)){g.active=false;const p=pending(i,g.spell);if(p&&p.groupStarted===g.createdAt)p.closed=true;continue}
 rows.push({i,owner:p,g})}
 });return rows}
function statHTML(u){
 const x=u.snapshot||{},stat=x.stat||{};
 const raw=v=>{if(v==null)return '';if(Array.isArray(v))return v.map(raw).filter(Boolean).join(' · ');if(typeof v==='object'){
   if(v.entries||v.entry)return [v.name,raw(v.entries||v.entry)].filter(Boolean).join(': ');
   if(v.items)return raw(v.items);
   if(v.amount!=null&&v.type)return String(v.amount)+' '+String(v.type);
   if(v.number!=null)return String(v.number)+(v.condition?' ('+raw(v.condition)+')':'');
   return Object.entries(v).map(([k,val])=>k+': '+raw(val)).join(' · ');
 }return String(v)};
 const text=v=>esc((typeof dmaMonsterText1131==='function'?dmaMonsterText1131(raw(v)):raw(v))||'');
 const group=(name,v)=>{const val=raw(v);return val?'<p><b>'+name+':</b> '+text(v)+'</p>':''};
 const rows=(name,title)=>{const vals=Array.isArray(stat[name])?stat[name]:[];return vals.length?'<h4>'+title+'</h4>'+vals.map(v=>{
  const loc=window.DMABestiaryES11918?.entry?.(x,name,v);
  return '<p><b>'+esc(loc?.name||v.name||title)+':</b> '+esc(loc?.body||raw(v.entry||v.entries||''))+(loc?.languagePending?'<small> · Texto original sin traducción verificada</small>':'')+'</p>';
 }).join(''):''};
 let out=`<h3>${esc(u.name)} · CR ${esc(u.cr)} · ${esc(x.source||'')}</h3><p><b>CA</b> ${u.ac} · <b>HP</b> ${u.hp}/${u.max}${u.temp?' · '+u.temp+' temporales':''}${u.mighty?' · Mighty Summoner aplicado':''}</p><p><b>Dados de golpe:</b> ${esc(stat.hpFormula||(u.hd?u.hd+' dados':'HP determinados por el conjuro'))} · <b>HP base:</b> ${u.originalHP??'Pendientes'}</p>`;
 if(stat.speed)out+=group('Velocidades',stat.speed);
 const names=['FUE','DES','CON','INT','SAB','CAR'];let scores=names.map((n,i)=>Number(stat[['str','dex','con','int','wis','cha'][i]]));
 if(scores.every(Number.isFinite))out+='<div class="dma-summon-abilities">'+scores.map((n,i)=>{const m=Math.floor((n-10)/2);return `<div><strong>${names[i]}</strong><span>${n} (${m>=0?'+':''}${m})</span></div>`}).join('')+'</div>';
 for(const [name,k] of [['Salvaciones','save'],['Habilidades','skill'],['Resistencias al daño','resist'],['Inmunidades al daño','immune'],['Vulnerabilidades','vulnerable'],['Inmunidades a condiciones','conditionImmune'],['Sentidos','senses'],['Idiomas','languages']])out+=group(name,stat[k]);
 out+=rows('trait','Rasgos')+rows('action','Acciones')+rows('bonus','Bonus Actions')+rows('reaction','Reacciones')+rows('legendary','Acciones legendarias');
 if(!stat.action?.length&&x.actions)out+=group('Acciones',x.actions);
 if(!stat.trait?.length&&x.traits)out+=group('Rasgos',x.traits);
 out+='<p class="dma-summon-small">Datos fijados al registrar la invocación. Las tiradas se resuelven por los jugadores y el DM.</p>';
 return out
}
function openStat(i,gid,uid){const u=unitOf(i,gid,uid);if(!u)return;
 let dialog=document.getElementById('dma-summon-stat11925');if(!dialog){dialog=document.createElement('dialog');dialog.id='dma-summon-stat11925';dialog.className='dma-summon-dialog11925';dialog.innerHTML='<div class="dma-summon-dialog-body11925"></div><button type="button" class="dma-summon-close11925">Cerrar</button>';dialog.querySelector('button').addEventListener('click',()=>dialog.close());document.body.append(dialog)}
 dialog.querySelector('div').innerHTML=statHTML(u);dialog.showModal()}
function quickUI(){const list=liveGroups();if(!list.length)return null;
 const group=document.createElement('details');group.className='quick-group dma-summon-quick11925';group.open=true;
 const summary=document.createElement('summary');summary.textContent='🐾 Invocaciones · '+list.reduce((n,o)=>n+o.g.units.length,0)+' criaturas';group.append(summary);
 const body=document.createElement('div');body.className='quick-enemy-grid';group.append(body);
 for(const {i,owner:p,g} of list){for(const u of g.units){const card=document.createElement('article');card.className='quick-enemy dma-summon-card11925';
 const id=`${i}|${g.id}|${u.id}`;card.dataset.summonRef=id;
 card.innerHTML=`<div class="qtitle">${esc(u.name)} <small>${esc(g.source==='faithful'?'Faithful Summons':g.spell)} · ${esc(p.name)}</small></div><div class="qsub">CA <b>${u.ac}</b> · CR ${esc(u.cr)} · ${u.mighty?'Mighty ✓':''}</div><div class="qhp"><strong>${u.hp}/${u.max}</strong> <span class="qsub">HP${u.hp===0?" · Desaparecida":""}</span>${u.temp?` <small>+${u.temp} temp.</small>`:''}</div><div class="qbar"><span style="width:${Math.max(0,100*u.hp/u.max)}%"></span></div><div class="hpbuttons dma-quick-actions11915"><input type="number" min="1" value="5" data-summon-amount aria-label="Cantidad de HP"><button type="button" class="red" data-summon-op="minus" title="Restar HP">−</button><button type="button" data-summon-op="plus" title="Sumar HP" ${u.hp===0?"disabled":""}>+</button></div><div class="dma-summon-actions11925"><button type="button" data-summon-op="stat">Statblock</button>${(u.hd==null&&u.mighty)?'<small>Dados de golpe pendientes de verificación</small>':''}${window.DMAShepherd11924?.stateFor?.(i)?.active&&window.DMAShepherd11924?.stateFor?.(i)?.kind==='bear'?'<button type="button" data-summon-op="bear" title="Solo si estaba en el aura cuando apareció el tótem">Oso: HP temp.</button>':''}${window.DMAShepherd11924?.level?.(i)>=10&&window.DMAShepherd11924?.stateFor?.(i)?.active?'<button type="button" data-summon-op="guardian">Guardian +'+Math.floor(window.DMAShepherd11924.level(i)/2)+'</button>':''}<label>HP temp. <input data-summon-temp type="number" min="0" value="${u.temp||0}"/></label></div>`;
 body.append(card)}
 const tail=document.createElement('div');tail.className='dma-summon-tail11925';tail.innerHTML=`<span>${esc(p.name)} · ${esc(g.spell)} · ${g.units.length}/${g.limit} registrados</span> <button type="button" data-summon-end="${esc(i+'|'+g.id)}">Finalizar grupo</button>`;body.append(tail)}return group}
const previousQuick=renderQuickEnemies;renderQuickEnemies=function(){const result=previousQuick.apply(this,arguments);const root=document.getElementById('quickenemygrid');if(!root)return result;root.querySelectorAll('.dma-summon-quick11925').forEach(n=>n.remove());const ui=quickUI();if(ui)root.append(ui);return result};
document.addEventListener('click',e=>{const b=e.target.closest('[data-summon-op],[data-summon-end]');if(!b)return;const r=b.closest('[data-summon-ref]');if(b.hasAttribute('data-summon-end')){const [i,gid]=b.dataset.summonEnd.split('|');endGroup(Number(i),gid);return}
 if(!r)return;const [i,gid,uid]=r.dataset.summonRef.split('|');const idx=Number(i),op=b.dataset.summonOp;
 if(op==='stat')openStat(idx,gid,uid);else if(op==='bear')applyBear(idx,gid,uid);else if(op==='guardian')guardian(idx,gid,uid);else if(op==='minus'||op==='plus')applyHP(idx,gid,uid,r.querySelector('[data-summon-amount]')?.value,op==='minus'?-1:1)
});
document.addEventListener('change',e=>{const input=e.target.closest('[data-summon-temp]');if(!input)return;const ref=input.closest('[data-summon-ref]')?.dataset.summonRef;if(!ref)return;const [i,gid,uid]=ref.split('|');setTemp(Number(i),gid,uid,input.value)});
window.DMASummonedCombat11925=Object.freeze({hitDice,stats,data,monsters,onCast,pending,registerSpell,registerFaithful,endFaithful,groupOf,unitOf,applyHP,applyBear,guardian,endGroup,quickUI,openStat});
})();
