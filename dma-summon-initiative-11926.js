/* DM.AID 1.19.26 · Invocaciones en el contador de iniciativa.
   D&D 5e (2014): las criaturas de Conjure Animals y Faithful Summons
   comparten una tirada de iniciativa como grupo y tienen turnos propios.
   El DM introduce la iniciativa y resuelve todas las tiradas.
*/
(function(){'use strict';
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const groupKey=g=>'s_'+g.id;
const short=(g,p)=>g.source==='faithful'?'Faithful Summons · '+p.name:g.spell+' · '+p.name;
function available(){
 const out=[];
 (state.players||[]).forEach((p,i)=>{
  const sh=profile(i),groups=sh?.dmaSummons11925?.groups||[];
  groups.forEach(g=>{
   if(!g.active||!Array.isArray(g.units)||!g.units.some(u=>u.hp>0))return;
   if(g.source==='faithful'&&!sh.dmaShepherd11924?.faithfulActive)return;
   if(g.concentration){
    const current=String(sh.dmaMagic1185?.concentrating||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');
    const spell=String(g.spell||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');
    if(current!==spell)return;
   }
   out.push({key:groupKey(g),i,p,g});
  });
 });
 return out;
}
function forKey(key){return available().find(x=>x.key===key)||null}
function cleanupCurrent(){
 if(String(state.turnKey||'').startsWith('s_')&&!forKey(state.turnKey)){
  // El grupo terminó; no cambiar ronda ni reiniciar el encuentro.
  const remaining=initiativeOrder();
  state.turnKey=remaining.find(x=>x.key!==state.turnKey)?.key||null;
 }
}
function onGroupEnded(id){
 const key='s_'+id;
 if(state.turnKey===key)state.turnKey=null;
 if(state.initiative)delete state.initiative[key];
 if(state.conditions)delete state.conditions[key];
}
const previousRoster=initiativeRoster;
initiativeRoster=function(){
 const roster=previousRoster.apply(this,arguments);
 for(const x of available()){
  state.initiative??={};
  if(!state.initiative[x.key])state.initiative[x.key]={roll:null,included:true};
  roster.push({key:x.key,name:short(x.g,x.p),hp:x.g.units.reduce((sum,u)=>sum+Math.max(0,Number(u.hp)||0),0),group:x.g.source==='faithful'?'Bestias protectoras':'Invocaciones'});
 }
 return roster;
};
function turnInfo(x){const it=state.initiative?.[x.key]||{};
 const units=x.g.units.map((u,j)=>{
  const gone=u.hp<=0;
  return `<div class="dma-init-creature11926 ${gone?'dma-gone11926':''}"><div><b>${esc(u.name)} ${x.g.units.filter(v=>v.name===u.name).length>1?'#'+(j+1):''}</b><small>CA ${Number(u.ac)||'—'} · ${Number(u.hp)||0}/${Number(u.max)||0} HP</small></div><button type="button" data-summon-ini-stat="${esc(x.i+'|'+x.g.id+'|'+u.id)}" aria-label="Abrir statblock de ${esc(u.name)}">Ficha</button></div>`;
 }).join('');
 return `<div class="initmarker" title="Iniciativa conjunta">${it.roll??'–'}</div>
 <div class="namerow"><strong>🐾 ${x.g.source==='faithful'?'Bestias protectoras':'Invocaciones'}</strong><div class="sm">${esc(x.p.name)} · ${esc(x.g.spell)} · iniciativa compartida</div></div>
 <div class="activehint">${state.turnKey===x.key?'▶ TURNO ACTUAL':it.included===false?'FUERA DEL ORDEN':' '}</div>
 <div class="dma-init-summons11926">${units}</div>
 <div class="initcontrols"><input aria-label="Iniciativa conjunta de ${esc(x.p.name)}" type="number" placeholder="Ini" value="${it.roll??''}" data-summon-ini-value="${esc(x.key)}"><button type="button" title="${it.included===false?'Incluir grupo':'Excluir grupo'}" data-summon-ini-toggle="${esc(x.key)}">${it.included===false?'+':'×'}</button></div>`;
}
function summonPanel(){
 const x=forKey(state.turnKey);if(!x)return false;
 const target=document.getElementById('eldaria-active-stat');if(!target)return true;
 target.innerHTML=`<article class="eld-stat dma-summon-turn11926"><h3>🐾 ${esc(x.g.source==='faithful'?'Bestias de Faithful Summons':x.g.spell)}</h3><div class="eld-type">${esc(x.p.name)} · ${x.g.units.length} criatura(s) · turno conjunto</div><p>El DM resuelve la iniciativa del grupo y las acciones de cada criatura. Consulta sus fichas y registra HP en Daño rápido.</p><div class="dma-turn-beasts11926">${x.g.units.map(u=>`<div><strong>${esc(u.name)}</strong><span>CA ${u.ac} · ${u.hp}/${u.max} HP</span><button type="button" data-summon-ini-stat="${esc(x.i+'|'+x.g.id+'|'+u.id)}">Statblock</button></div>`).join('')}</div>${x.g.source==='faithful'?'<small>Sin órdenes, estas criaturas defienden al druida y atacan a sus enemigos.</small>':''}</article>`;
 return true;
}
const previousStat=renderEldariaStatBlock;
renderEldariaStatBlock=function(){if(summonPanel())return;return previousStat.apply(this,arguments)};
const previousInitiative=renderInitiative;
renderInitiative=function(){
 cleanupCurrent();
 const res=previousInitiative.apply(this,arguments);
 const list=document.getElementById('initlist');if(!list)return res;
 const roster=initiativeRoster(),order=initiativeOrder();const idx=order.findIndex(x=>x.key===state.turnKey);
 const sequence=[...(idx>0?[...order.slice(idx),...order.slice(0,idx)]:order),...roster.filter(x=>state.initiative?.[x.key]?.included===false)];
 const cards=[...list.querySelectorAll('.initrow')];
 sequence.forEach((entry,j)=>{
  if(!String(entry.key).startsWith('s_'))return;
  const x=forKey(entry.key),card=cards[j];if(!x||!card)return;
  card.classList.remove('fallen');card.classList.add('dma-summon-initrow11926');
  card.innerHTML=turnInfo(x);
 });
 return res;
};
// The initiative strip shares the same model as Daño rápido. No duplicate HP storage.
document.addEventListener('click',e=>{
 const target=e.target.closest('[data-summon-ini-stat],[data-summon-ini-toggle]');if(!target)return;
 if(target.hasAttribute('data-summon-ini-toggle')){
  const key=target.dataset.summonIniToggle;if(!forKey(key))return;
  toggleInitiative(key);return;
 }
 const [i,gid,uid]=String(target.dataset.summonIniStat||'').split('|');
 window.DMASummonedCombat11925?.openStat?.(Number(i),gid,uid);
});
document.addEventListener('change',e=>{
 const target=e.target.closest('[data-summon-ini-value]');if(!target)return;
 const key=target.dataset.summonIniValue;
 if(forKey(key))setInitiative(key,target.value);
});
window.DMASummonInitiative11926=Object.freeze({available,forKey,onGroupEnded,cleanupCurrent});
})();
