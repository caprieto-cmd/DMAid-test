/* DMAid 1.19.22 · Circle of Dreams (Xanathar, 2014).
   Solo registra recursos, decisiones y estados del DM: nunca tira dados, decide efectos ni gasta conjuros.
   Los estados se guardan en la hoja individual, no en contadores de campaña. */
(function(){'use strict';
const VERSION='1.19.22';
const escHTML=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
function getCircle(i){
 const p=state.players?.[i]; if(!p)return null;
 const cls=(profile(i).classes||[]).find(c=>c.name==='Druida'&&/dream|sueno/i.test(norm(c.sub)));
 return cls&&Number(cls.level)>=2?cls:null;
}
function level(i){return Number(getCircle(i)?.level)||0}
function wisdomMod(i){return Math.floor(((Number(profile(i).abilities?.SAB)||10)-10)/2)}
function pool(i){return level(i)}
function perUse(i){return Math.floor(level(i)/2)}
function pathsMax(i){return Math.max(1,wisdomMod(i))}
function stateFor(i){
 if(!getCircle(i))return null;
 const sh=profile(i);
 if(!sh.dmaDreams11922||typeof sh.dmaDreams11922!=='object'){
  sh.dmaDreams11922={balmSpent:0,pathsSpent:0,walkerSpent:false,hearthActive:false,hearthRest:'',lastLongRestSeen:sh.dmaLongRestAt1185||null};
 }
 const data=sh.dmaDreams11922;
 // Sólo un descanso largo CONFIRMADO en DMAid restablece los recursos.
 const token=sh.dmaLongRestAt1185||null;
 if(data.lastLongRestSeen!==token){
  data.balmSpent=0;data.pathsSpent=0;data.walkerSpent=false;data.hearthActive=false;data.hearthRest='';data.lastLongRestSeen=token;
 }
 data.balmSpent=Math.min(pool(i),Math.max(0,Math.floor(Number(data.balmSpent)||0)));
 data.pathsSpent=Math.min(pathsMax(i),Math.max(0,Math.floor(Number(data.pathsSpent)||0)));
 data.walkerSpent=!!data.walkerSpent;data.hearthActive=!!data.hearthActive;
 return data;
}
function refresh(i){
 for(const host of document.querySelectorAll(`[data-dreams-feature][data-dreams-player="${i}"]`)){
  const feature=host.dataset.dreamsFeature;
  host.innerHTML=controls(i,feature);
 }
}
function update(i,mutate){const data=stateFor(i);if(!data)return;mutate(data);save();refresh(i)}
function balmSpend(i,count){
 const max=pool(i),data=stateFor(i),n=Number(count);
 if(!data||!Number.isInteger(n)||n<1||n>perUse(i)||data.balmSpent+n>max)return;
 update(i,s=>{s.balmSpent+=n;s.lastBalmDice=n});
}
function balmRefund(i){const d=stateFor(i);if(d&&d.balmSpent>0)update(i,s=>{s.balmSpent-=1;s.lastBalmDice=0})}
function pathsSpend(i,kind){
 const d=stateFor(i);if(!d||level(i)<10||d.pathsSpent>=pathsMax(i)||!['self','ally'].includes(kind))return;
 update(i,s=>{s.pathsSpent+=1;s.lastPath=kind});
}
function pathsRefund(i){const d=stateFor(i);if(d&&d.pathsSpent>0)update(i,s=>{s.pathsSpent-=1;s.lastPath=''})}
function hearthToggle(i,type){
 if(level(i)<6||!['short','long','end'].includes(type))return;
 update(i,s=>{s.hearthActive=type!=='end';s.hearthRest=type==='end'?'':type});
}
function walkerUse(i,choice){
 const d=stateFor(i);if(!d||level(i)<14||d.walkerSpent||!['Dream','Scrying','Teleportation Circle'].includes(choice))return;
 // Teleportation Circle can fail without a prior long rest on this plane, and the use is not wasted.
 // We don't adjudicate travel here. Explicit confirmation prevents a false "successful cast".
 if(choice==='Teleportation Circle'&&!confirm('¿Confirma el DM que existe un último lugar de descanso largo en el plano actual? Si no existe, este conjuro falla y el uso de Walker in Dreams NO se gasta. Pulsa Cancelar para conservar el recurso.'))return;
 if(!confirm(`¿Registrar ${choice} mediante Walker in Dreams DESPUÉS de completar un descanso corto, sin gastar espacio ni componentes materiales?`))return;
 update(i,s=>{s.walkerSpent=true;s.lastWalkerSpell=choice});
}
function walkerRefund(i){const d=stateFor(i);if(d&&d.walkerSpent&&confirm('¿Anular el registro del uso de Walker in Dreams?'))update(i,s=>{s.walkerSpent=false;s.lastWalkerSpell=''})}
const btn=(action,label,disabled=false,title='')=>`<button type="button" data-dreams-action="${action}" ${disabled?'disabled':''}${title?` title="${escHTML(title)}"`:''}>${label}</button>`;
function controls(i,feature){const d=stateFor(i),lv=level(i);if(!d)return '';
 if(feature==='balm'){
  const remaining=pool(i)-d.balmSpent,max=Math.min(perUse(i),remaining);
  return `<div class="dma-dreams-title11922"><strong>${remaining}/${pool(i)} d6</strong><span>Bonus Action · 120 pies · descanso largo</span></div>
   <div class="dma-dreams-actions11922"><label>Dados para este uso<select data-dreams-balm-count="${i}" ${max===0?'disabled':''}>${Array.from({length:max},(_,n)=>`<option value="${n+1}">${n+1}d6</option>`).join('')||'<option value="0">Sin dados</option>'}</select></label>
   ${btn('balm-spend','Registrar dados gastados',max===0)}${btn('balm-refund','Devolver 1',d.balmSpent===0)}</div>
   <small>El jugador tira los dados y el DM aplica la curación al objetivo. Además, el objetivo recibe 1 HP temporal por cada dado gastado. Máximo ${perUse(i)}d6 por activación; los HP temporales no se acumulan.</small>`;
 }
 if(feature==='hearth')return `<div class="dma-dreams-title11922"><strong>${d.hearthActive?'Refugio activo':'Refugio inactivo'}</strong><span>Al inicio de un descanso · 30 pies de radio</span></div>
 <div class="dma-dreams-actions11922">${d.hearthActive?btn('hearth-end','Finalizar refugio'):btn('hearth-short','Iniciar descanso corto')+btn('hearth-long','Iniciar descanso largo')}</div>
 <small>Solo durante el descanso; termina al acabar este o si el druida abandona la esfera. Cobertura total bloquea la esfera. Dentro: +5 a Sigilo y Percepción para el druida y sus aliados; la luz de llamas abiertas no es visible desde fuera.</small>`;
 if(feature==='paths'){
  const remaining=pathsMax(i)-d.pathsSpent;
  return `<div class="dma-dreams-title11922"><strong>${remaining}/${pathsMax(i)} usos</strong><span>Recupera en descanso largo</span></div>
  <div class="dma-dreams-actions11922">${btn('paths-self','Bonus Action · 60 pies',remaining===0,'Teletransportarte a espacio desocupado visible')}${btn('paths-ally','Acción · aliado 30 pies',remaining===0,'Teletransportar criatura voluntaria tocada a espacio desocupado visible')}${btn('paths-refund','Devolver 1',d.pathsSpent===0)}</div>
  <small>Ambas opciones consumen un uso de la MISMA reserva. El DM verifica el destino y el alcance; no se realizan tiradas.</small>`;
 }
 if(feature==='walker')return `<div class="dma-dreams-title11922"><strong>${d.walkerSpent?'Utilizado':'Disponible'}</strong><span>Al terminar un descanso corto · 1/descanso largo</span></div>
 <div class="dma-dreams-actions11922"><label>Conjuro gratuito<select data-dreams-walker-spell="${i}" ${d.walkerSpent?'disabled':''}><option>Dream</option><option>Scrying</option><option>Teleportation Circle</option></select></label>${btn('walker-use','Registrar lanzamiento',d.walkerSpent)}${btn('walker-refund','Anular uso',!d.walkerSpent)}</div>
 <small>Sin espacio de conjuro ni componentes materiales. Dream: eres el mensajero. Teleportation Circle: lleva al último lugar donde completaste un descanso largo en el plano actual. Si no existe, el conjuro falla y el uso no se gasta. ${d.lastWalkerSpell?`Último registrado: ${escHTML(d.lastWalkerSpell)}.`:''}</small>`;
 return '';
}
const featureNames={balm:'Balm of the Summer Court',hearth:'Hearth of Moonlight and Shadow',paths:'Hidden Paths',walker:'Walker in Dreams'};
function inject(panel,key){
 if(!/^p\d+$/.test(String(key)))return;
 const i=Number(key.slice(1)),lv=level(i);if(lv<2)return;
 const root=panel.querySelector('.dma-four-class-11615')||panel.querySelector('.eld-player-statblock')||panel;
 const candidates=[...root.querySelectorAll('.dma-combat-feature-1121,.dma-unified-feature-1177,.dma-feature-row-11615,.dma-feature')];
 for(const [feature,name] of Object.entries(featureNames)){
  const min={balm:2,hearth:6,paths:10,walker:14}[feature];if(lv<min)continue;
  let card=candidates.find(el=>el.querySelector('b,strong')?.textContent?.trim()===name);
  if(!card){const node=[...root.querySelectorAll('b,strong')].find(el=>el.textContent?.trim()===name);card=node?.closest('.dma-combat-feature-1121,.dma-unified-feature-1177,.dma-feature-row-11615,.dma-feature')||node?.parentElement;}
  if(!card)continue;
  const existing=card.querySelector('[data-dreams-feature]');if(existing)continue;
  const wrapper=document.createElement('div');wrapper.className='dma-dreams-control11922';wrapper.dataset.dreamsFeature=feature;wrapper.dataset.dreamsPlayer=i;wrapper.innerHTML=controls(i,feature);card.append(wrapper);
 }
}
const priorCombat=renderActivePlayerBlock;
renderActivePlayerBlock=function(panel,key){const result=priorCombat.apply(this,arguments);try{inject(panel,key)}catch(err){console.error('[DMAid Sueños]',err)}return result;};
function delegated(e){const button=e.target.closest('[data-dreams-action]');if(!button)return;
 const owner=button.closest('[data-dreams-feature]');if(!owner)return;
 const i=Number(owner.dataset.dreamsPlayer),key=button.dataset.dreamsAction;
 if(!state.players[i]||!getCircle(i))return;
 e.preventDefault();e.stopPropagation();
 switch(key){
 case 'balm-spend':balmSpend(i,owner.querySelector('[data-dreams-balm-count]')?.value);break;
 case 'balm-refund':balmRefund(i);break;
 case 'paths-self':pathsSpend(i,'self');break;
 case 'paths-ally':pathsSpend(i,'ally');break;
 case 'paths-refund':pathsRefund(i);break;
 case 'hearth-short':hearthToggle(i,'short');break;
 case 'hearth-long':hearthToggle(i,'long');break;
 case 'hearth-end':hearthToggle(i,'end');break;
 case 'walker-use':walkerUse(i,owner.querySelector('[data-dreams-walker-spell]')?.value);break;
 case 'walker-refund':walkerRefund(i);break;
 }
}
document.addEventListener('click',delegated);
window.DMADreams11922={getCircle,level,pool,perUse,pathsMax,stateFor,balmSpend,balmRefund,pathsSpend,pathsRefund,hearthToggle,walkerUse,walkerRefund,controls,inject,refresh,version:VERSION};
})();
