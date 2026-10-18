/* DMAid 1.19.24 · Circle of the Shepherd · Xanathar 2017 (5e 2014)
   Registro por personaje y decisiones del DM: no tira dados ni decide resultados.
*/
(function(){'use strict';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const KINDS={bear:'Oso',hawk:'Halcón',unicorn:'Unicornio'};
function circle(i){const sh=state.players?.[i]&&profile(i);return sh?.classes?.find(c=>c.name==='Druida'&&Number(c.level)>=2&&/shepherd|pastor/i.test(norm(c.sub||'')))||null}
function level(i){return Math.max(0,Number(circle(i)?.level)||0)}
function stateFor(i){if(!circle(i))return null;const sh=profile(i);let d=sh.dmaShepherd11924;if(!d||typeof d!=='object'){d={used:false,active:false,kind:'',rounds:0,faithfulUsed:false,faithfulActive:false,faithfulBeasts:[],restToken:sh.dmaLongRestAt1185??null};sh.dmaShepherd11924=d}
 const token=sh.dmaLongRestAt1185??null;
 if(d.restToken!==token){Object.assign(d,{used:false,active:false,kind:'',rounds:0,faithfulUsed:false,faithfulActive:false,faithfulBeasts:[],restToken:token})}
 d.rounds=Math.min(10,Math.max(0,Math.floor(Number(d.rounds)||0)));d.used=!!d.used;d.active=!!d.active;d.faithfulUsed=!!d.faithfulUsed;d.faithfulActive=!!d.faithfulActive;if(!Array.isArray(d.faithfulBeasts))d.faithfulBeasts=[];
 if(!KINDS[d.kind]||!d.used)d.active=false;
 return d;
}
function persist(i,fn,repaint=true){const d=stateFor(i);if(!d)return;fn(d);save();if(repaint)refresh(i)}
function refresh(i){document.querySelectorAll(`[data-shepherd-player="${i}"]`).forEach(host=>{host.innerHTML=controls(i,host.dataset.shepherdFeature)});try{window.dmaReactPaint1178?.()}catch(e){}}
function summonTotem(i,kind){const d=stateFor(i);if(!d||d.used||!KINDS[kind])return false;
 if(!confirm('¿Registrar la invocación del espíritu '+KINDS[kind]+' mediante Bonus Action? Consume el único uso de Spirit Totem hasta completar un descanso corto o largo.'))return false;
 persist(i,s=>Object.assign(s,{used:true,active:true,kind,rounds:0}));return true}
function moveTotem(i){const d=stateFor(i);if(!d?.active)return false;alert('Puedes desplazar el tótem hasta 60 pies a un punto visible mediante Bonus Action. El DM controla su posición y alcance en el mapa.');return true}
function nextRound(i){if(!stateFor(i)?.active)return false;persist(i,s=>{s.rounds=Math.min(10,s.rounds+1);if(s.rounds>=10)s.active=false});return true}
function finishTotem(i){if(!stateFor(i)?.active)return false;persist(i,s=>{s.active=false});return true}
function shortRest(i){const d=stateFor(i);if(!d||!d.used)return false;if(!confirm('¿Se completó un descanso corto? Recuperarás únicamente Spirit Totem de este druida; otros recursos de descanso corto se gestionan por separado.'))return false;
 persist(i,s=>Object.assign(s,{used:false,active:false,kind:'',rounds:0}));return true}
function hawk(i){const d=stateFor(i);if(!d?.active||d.kind!=='hawk')return false;const sh=profile(i);if(sh.dmaReactionUsed1178){alert('La reacción de este personaje ya se utilizó.');return false}
 if(!confirm('¿Gastar la reacción para conceder ventaja a un ataque contra una criatura dentro del aura del Halcón? El jugador realiza su tirada.'))return false;
 sh.dmaReactionUsed1178=true;save();refresh(i);try{window.renderQuickEnemies?.()}catch(e){}return true}
function faithfulUse(i){const d=stateFor(i);if(!d||level(i)<14||d.faithfulUsed)return false;
 if(!confirm('¿Confirmas que este druida cayó a 0 HP o quedó incapacitado contra su voluntad? Faithful Summons invoca cuatro bestias CR 2 o inferior sin gastar espacio ni concentración.'))return false;
 persist(i,s=>Object.assign(s,{faithfulUsed:true,faithfulActive:true,faithfulBeasts:[]}));return true}
function faithfulEnd(i){if(!stateFor(i)?.faithfulActive)return false;persist(i,s=>{s.faithfulActive=false});return true}
function faithfulUndo(i){const d=stateFor(i);if(!d?.faithfulUsed||!confirm('¿Anular el uso de Faithful Summons? Esto solo debe hacerse para corregir un registro accidental.'))return false;
 persist(i,s=>Object.assign(s,{faithfulUsed:false,faithfulActive:false,faithfulBeasts:[]}));return true}
function beasts(){try{return window.DMASummonBrowser11910?.filterMonsters?.('Conjure Animals',2,'all','all')||[]}catch(e){return []}}
function baseHP(monster){const hp=monster?.hp??monster?.stat?.hp?.average;const n=Number.parseInt(String(hp),10);return Number.isFinite(n)?n:0}
function hitDice(monster){let x=monster?.stat?.hp?.formula||monster?.stat?.hp?.special||monster?.hpFormula||'';if(!x&&typeof monster?.hp==='string')x=monster.hp;const found=String(x).match(/\b(\d+)d(?:4|6|8|10|12|20)\b/i);return found?Number(found[1]):null}
function summonedHP(monster,lvl){const hp=baseHP(monster),dice=hitDice(monster);return {base:hp,hitDice:dice,extra:lvl>=6&&dice!=null?2*dice:null,total:hp&&lvl>=6&&dice!=null?hp+2*dice:hp||null}}
function faithfulAdd(i,id){const d=stateFor(i);if(!d?.faithfulActive||d.faithfulBeasts.length>=4)return false;const monster=beasts().find(b=>String(b.id)===String(id));if(!monster)return false;
 const summary=summonedHP(monster,level(i));persist(i,s=>s.faithfulBeasts.push({id:String(monster.id),name:String(monster.name),cr:monster.cr,hp:summary.total,max:summary.total,hitDice:summary.hitDice}));return true}
function faithfulRemove(i,index){const d=stateFor(i);if(!d?.faithfulActive||!Number.isInteger(index)||index<0||index>=d.faithfulBeasts.length)return false;
 persist(i,s=>s.faithfulBeasts.splice(index,1));return true}
function faithfulHP(i,index,value){const d=stateFor(i),b=d?.faithfulBeasts[index];if(!b||b.max==null)return false;const n=Number(value);if(!Number.isInteger(n)||n<0||n>Number(b.max))return false;persist(i,s=>{s.faithfulBeasts[index].hp=n});return true}
function preview(id){try{if(typeof openBestiaryPreview==='function')openBestiaryPreview(id);else alert('Abre el bestiario para consultar este statblock completo.')}catch(err){alert('La ficha no está disponible en el bestiario cargado.')}}
const button=(action,label,disabled=false,more='')=>`<button type="button" data-shepherd-action="${action}" ${disabled?'disabled':''} ${more}>${esc(label)}</button>`;
function controls(i,feature){const d=stateFor(i);if(!d)return '';const lv=level(i),long='Descanso largo',kind=KINDS[d.kind]||'—';
 if(feature==='totem'){
 const head=`<div class="dma-shep-head"><b>${d.active?'🌿 Tótem activo: '+kind:d.used?'Uso gastado':'Tótem disponible'}</b><small>${d.used?'0/1':'1/1'} usos · Descanso corto o largo</small></div>`;
 const options=`<label>Espíritu<select data-shepherd-choice="totem"><option value="bear">Oso</option><option value="hawk">Halcón</option><option value="unicorn">Unicornio</option></select></label>`;
 if(!d.active)return head+`<div class="dma-shep-actions">${d.used?button('shortrest','Recuperar después de descanso corto'):options+button('summon','Invocar · Bonus Action')}</div><small>Invocación a 60 pies a punto visible. Aura de 30 pies de radio, durante 1 minuto (10 rondas). El tótem no es criatura ni objeto; no requiere concentración.</small>`;
 let effects='';if(d.kind==='bear')effects=`<b>Oso:</b> al aparecer, criaturas elegidas dentro del aura reciben ${5+lv} HP temporales cada una (no se acumulan con otros HP temporales). Tú y tus aliados en el aura tenéis ventaja en pruebas y salvaciones de Fuerza.`;
 if(d.kind==='hawk')effects=`<b>Halcón:</b> tú y tus aliados en el aura tenéis ventaja en Percepción (SAB). Puedes gastar tu reacción para conceder ventaja a una tirada de ataque contra un objetivo situado dentro del aura.`;
 if(d.kind==='unicorn')effects=`<b>Unicornio:</b> tú y tus aliados tenéis ventaja en pruebas para detectar criaturas dentro del aura. Cuando lanzas un conjuro con espacio que restaura HP a cualquier criatura, cada criatura de tu elección en el aura recupera ${lv} HP adicionales (el DM aplica manualmente los HP).`;
 return head+`<p class="dma-shep-rule">${effects}</p><div class="dma-shep-actions"><span>Rondas: ${d.rounds}/10</span>${button('advance','+ 1 ronda')}${button('move','Mover tótem · Bonus Action')}${d.kind==='hawk'?button('hawk','Usar reacción del Halcón',!!profile(i).dmaReactionUsed1178):''}${button('end','Terminar')}</div><small>Los efectos se aplican a criaturas que cumplen sus condiciones; DMAid no decide objetivos ni realiza tiradas. El uso no se devuelve al terminar el efecto.</small>`;
 }
 if(feature==='summoner')return `<div class="dma-shep-head"><b>Mighty Summoner · Pasivo</b><small>Druida ${lv}</small></div><p class="dma-shep-rule">Las bestias y criaturas feéricas invocadas o creadas por tus conjuros aparecen con <b>+2 HP por cada dado de golpe</b>. El daño de sus armas naturales es mágico para superar resistencias e inmunidades a ataques no mágicos. El visor de criaturas refleja el HP adicional cuando el bestiario proporciona sus dados de golpe; de lo contrario advierte que falta ese dato.</p>`;
 if(feature==='guardian')return `<div class="dma-shep-head"><b>Guardian Spirit · Pasivo</b><small>Druida ${lv}</small></div><p class="dma-shep-rule">Cuando una bestia o criatura feérica creada o invocada por un conjuro tuyo <b>termina su turno</b> dentro del aura de tu Spirit Totem, recupera <b>${Math.floor(lv/2)} HP</b>. No ocurre al iniciar su turno ni cuando el tótem está inactivo. El DM registra manualmente la curación de cada criatura elegible.</p><small>Spirit Totem: ${d.active?'activo ('+kind+')':'inactivo'}.</small>`;
 if(feature==='faithful'){
 const list=beasts(),last=d.faithfulBeasts||[];
 let rows=last.map((b,j)=>`<div class="dma-shep-beast"><b>${j+1}. ${esc(b.name)} · CR ${esc(b.cr)}</b><span>${b.max!=null?'HP '+b.hp+'/'+b.max:'HP no verificables'}</span>${b.hitDice==null?'<small>No consta el número de dados de golpe: bonificación de Mighty Summoner pendiente.</small>':''}<div class="dma-shep-actions">${b.max!=null?`<label>HP actuales<input type="number" min="0" max="${b.max}" value="${b.hp}" data-shepherd-hp="${j}"/></label>`:''}${button('preview','Ver statblock',false,`data-shepherd-id="${esc(b.id)}"`)}${button('remove','Quitar',false,`data-shepherd-index="${j}"`)}</div></div>`).join('');
 let picker=last.length<4?`<div class="dma-shep-actions"><label>Bestia disponible en el bestiario<select data-shepherd-choice="beast"><option value="">Seleccionar bestia…</option>${list.map(b=>`<option value="${esc(b.id)}">${esc(b.name)} · CR ${esc(b.cr)}</option>`).join('')}</select></label>${button('add','Registrar bestia',!list.length)}</div>`:'';
 return `<div class="dma-shep-head"><b>${d.faithfulActive?'Invocación activa':d.faithfulUsed?'Uso gastado':'Faithful Summons disponible'}</b><small>${d.faithfulUsed?'0/1':'1/1'} · Descanso largo</small></div><p class="dma-shep-rule">Se activa inmediatamente si caes a 0 HP o quedas incapacitado contra tu voluntad. Aparecen <b>cuatro bestias CR 2 o inferior</b> a 20 pies de ti, como Conjure Animals de nivel 9, <b>sin gastar espacio ni concentración</b>. Duran 1 hora, hasta disiparlas sin acción o hasta que termine su efecto; defienden al druida si no reciben órdenes.</p>
 ${!d.faithfulUsed?button('faithful','Registrar activación'):d.faithfulActive?`<small>${last.length}/4 bestias registradas. ${list.length?'':'Carga el bestiario (MM 2014) para elegir criaturas.'}</small>${picker}${rows}${button('faithful-end','Finalizar invocación')}`:button('faithful-undo','Corregir uso accidental')}<small>No añade enemigos ni lanza dados. Si hay fichas incompletas, la información sin verificar no se inventa.</small>`;
 }
 return '';
}
const featureMap=[['totem','Spirit Totem',2],['summoner','Mighty Summoner',6],['guardian','Guardian Spirit',10],['faithful','Faithful Summons',14]];
function inject(panel,key){if(!/^p\d+$/.test(String(key)))return;const i=Number(key.slice(1)),lv=level(i);if(!lv)return;
 const root=panel.querySelector('.dma-four-class-11615')||panel.querySelector('.eld-player-statblock')||panel;
 for(const [feature,title,min] of featureMap){if(lv<min)continue;
 const label=[...root.querySelectorAll('b,strong')].find(e=>e.textContent?.trim()===title);let card=label?.closest('.dma-combat-feature-1121,.dma-unified-feature-1177,.dma-feature-row-11615,.dma-feature')||label?.parentElement;
 if(!card){ // The class-feature renderer can use other element types in some builds.
 const fallback=[...root.querySelectorAll('h4,h5')].find(e=>e.textContent?.includes(title));card=fallback?.parentElement;
 }
 if(!card||card.querySelector('[data-shepherd-feature]'))continue;
 const host=document.createElement('div');host.className='dma-shep-feature';host.dataset.shepherdPlayer=i;host.dataset.shepherdFeature=feature;host.innerHTML=controls(i,feature);card.append(host);
 }
}
const previous=renderActivePlayerBlock;renderActivePlayerBlock=function(panel,key){const result=previous.apply(this,arguments);try{inject(panel,key)}catch(e){console.error('[DMAid Pastor]',e)}return result};
document.addEventListener('click',e=>{const b=e.target.closest('[data-shepherd-action]');if(!b)return;const owner=b.closest('[data-shepherd-feature]');if(!owner)return;e.preventDefault();e.stopPropagation();const i=Number(owner.dataset.shepherdPlayer);if(!circle(i))return;
 switch(b.dataset.shepherdAction){
 case 'summon':summonTotem(i,owner.querySelector('[data-shepherd-choice="totem"]')?.value);break;
 case 'move':moveTotem(i);break;case 'advance':nextRound(i);break;case 'end':finishTotem(i);break;case 'shortrest':shortRest(i);break;case 'hawk':hawk(i);break;
 case 'faithful':faithfulUse(i);break;case 'faithful-end':faithfulEnd(i);break;case 'faithful-undo':faithfulUndo(i);break;
 case 'add':faithfulAdd(i,owner.querySelector('[data-shepherd-choice="beast"]')?.value);break;
 case 'remove':faithfulRemove(i,Number(b.dataset.shepherdIndex));break;
 case 'preview':preview(b.dataset.shepherdId);break;
 }
});
document.addEventListener('change',e=>{if(!e.target.matches('[data-shepherd-hp]'))return;const owner=e.target.closest('[data-shepherd-player]');if(!owner)return;faithfulHP(Number(owner.dataset.shepherdPlayer),Number(e.target.dataset.shepherdHp),e.target.value)});
window.DMAShepherd11924=Object.freeze({circle,level,stateFor,summonTotem,moveTotem,nextRound,finishTotem,shortRest,hawk,faithfulUse,faithfulEnd,faithfulUndo,faithfulAdd,faithfulRemove,faithfulHP,summonedHP,hitDice,beasts,controls,inject,refresh});
})();
