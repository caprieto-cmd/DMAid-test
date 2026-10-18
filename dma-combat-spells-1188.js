/* DMAid 1.18.8 · Combat spell references; no automatic casts or dice. */
(function(){'use strict';
const escapeText=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const spellKey=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');
const REFERENCE_11911={
 chilltouch:{n:'Chill Touch',l:0,source:'PHB 2014',school:'Nigromancia',casting_time:'1 acción',range:'120 pies',components:'V, S',duration:'Instantánea',concentration:false,fromHandbook:true,referenceVerified:true,description:'Una mano espectral aparece junto a una criatura dentro del alcance. Realiza un ataque de conjuro a distancia. Con impacto inflige daño necrótico y la criatura no puede recuperar puntos de golpe hasta el comienzo de tu siguiente turno. Si el objetivo es un no muerto, también tiene desventaja en las tiradas de ataque contra ti hasta el final de tu siguiente turno. No requiere concentración. El daño aumenta con el nivel total del personaje.'},
 summonbeast:{n:'Summon Beast',l:2,source:'TCE 2020',school:'Conjuración',casting_time:'1 acción',range:'90 pies',components:'V, S, M (una pluma, un mechón de pelaje y una cola de pez en una bellota dorada de valor mínimo 200 po)',duration:'Concentración, hasta 1 hora',concentration:true,referenceVerified:true,description:'Convocas un único espíritu bestial en un espacio desocupado que puedas ver dentro del alcance. Eliges su forma aérea, terrestre o acuática. Usa el bloque Bestial Spirit de este mismo visor, no las estadísticas de un animal ordinario. El espíritu desaparece cuando llega a 0 HP o termina el conjuro. Es aliado de ti y tus compañeros, tiene turno inmediatamente después del tuyo, obedece órdenes verbales sin exigir una acción, y si no recibe órdenes ejecuta Esquivar. Sus CA, HP y ataques se calculan según el nivel del espacio. La forma acuática respira únicamente bajo el agua; comprueba el entorno antes de seleccionarla.'},
 conjureanimals:{n:'Conjure Animals',l:3,source:'PHB 2014',school:'Conjuración',casting_time:'1 acción',range:'60 pies',components:'V, S',duration:'Concentración, hasta 1 hora',concentration:true,fromHandbook:true,referenceVerified:true,description:'Invocas espíritus feéricos que toman la forma de bestias en espacios desocupados que puedas ver dentro del alcance. Elige una de cuatro opciones: 1 bestia de CR hasta 2; 2 bestias de CR hasta 1; 4 bestias de CR hasta 1/2; u 8 bestias de CR hasta 1/4. Las criaturas también son consideradas feéricas. El DM determina cuáles aparecen y utiliza sus bloques de estadísticas. Las criaturas son amistosas contigo y tus aliados, tiran iniciativa como grupo y actúan en sus propios turnos. Obedecen órdenes verbales, sin que gastes acción; sin órdenes se defienden de criaturas hostiles, pero no realizan otras acciones. Desaparecen al llegar a 0 HP o terminar el conjuro. Al usar espacios de nivel 5, 7 o 9 aparecen respectivamente el doble, triple o cuádruple de criaturas. Se mantiene el CR máximo por criatura de la opción elegida.'}
};
const entries=()=>{let a=[...(window.DMA_DRUID_SPELLS_1189||[]),...(window.DMA_SUBCLASS_SPELLS_1194||[])];try{a=a.concat(Array.isArray(SPELL_LIBRARY)?SPELL_LIBRARY:[])}catch(e){}try{const b=window.DMA_SPELL_CATALOG_BRIDGE?.();if(Array.isArray(b))a=a.concat(b)}catch(e){}return a.filter(s=>s&&typeof s.n==='string'&&!/2024|XPHB|PHB24/i.test(String(s.source||'')))};
function getSpell(name){const key=spellKey(name);if(REFERENCE_11911[key])return REFERENCE_11911[key];const matches=entries().filter(s=>spellKey(s.n)===key);const official=matches.find(s=>s.fromHandbook&&String(s.description||'').length>180);if(official)return official;return matches.sort((a,b)=>quality(b)-quality(a))[0]||null;}
function quality(s){return ['description','desc','text','summary','damage','range','duration','components'].reduce((n,k)=>n+Math.min(10,String(s[k]||'').length),0)}
const classify=n=>{const s=getSpell(n);return s&&Number(s.l)===0?'cantrip':s&&Number(s.l)>0?'spell':null};
function listFor(i){const sh=profile(i),book=sh.dmaMagic1185||{};const domain=[];for(const c of sh.classes||[])if(c.name==='Clérigo'&&/knowledge|conocimiento/i.test(String(c.sub||''))){for(const [lvl,n] of [[1,'Command'],[1,'Identify'],[3,'Augury'],[3,'Suggestion'],[5,'Nondetection'],[5,'Speak with Dead'],[7,'Arcane Eye'],[7,'Confusion'],[9,'Legend Lore'],[9,'Scrying']])if(Number(c.level)>=lvl)domain.push(n)}
const collected=[...(book.cantrips||[]),...(book.prepared||[]),...(book.known||[]),...domain,...(sh.spells||[])];const unique=new Map();for(const item of collected){const n=typeof item==='string'?item:item?.name;if(n&&!unique.has(spellKey(n)))unique.set(spellKey(n),n)}return [...unique.values()].map(n=>({name:n,spell:getSpell(n)})).sort((a,b)=>(Number(a.spell?.l)||0)-(Number(b.spell?.l)||0)||a.name.localeCompare(b.name));}
function castingBonus(i){const sh=profile(i),cs=sh.classes||[];let ability='SAB';const first=cs.find(c=>['Druida','Clérigo','Explorador','Paladín','Mago','Bardo','Hechicero','Brujo','Artífice'].includes(c.name));if(first){ability={Mago:'INT',Artífice:'INT',Bardo:'CAR',Hechicero:'CAR',Brujo:'CAR',Paladín:'CAR'}[first.name]||'SAB'}const level=cs.reduce((n,c)=>n+(Number(c.level)||0),0);const pb=2+Math.floor((Math.max(1,level)-1)/4);const mod=Math.floor(((Number(sh.abilities?.[ability])||10)-10)/2);return {bonus:pb+mod,level,ability,dc:8+pb+mod}}
function info(i,n){
 const s=getSpell(n);if(!s)return {title:n,details:['Sin registro de reglas comprobables en el catálogo. Esta entrada no es apta para decidir efectos durante la partida.'],source:'Sin fuente',unverified:true};
 const c=castingBonus(i),level=Number(s.l)||0,code=spellKey(n),details=[];
 const displayTime=s.casting_time||s.time||s.mechanics?.casting_time;
 const range=s.range||s.mechanics?.range;
 const comp=s.components||s.mechanics?.components;
 const dur=s.duration||s.mechanics?.duration;
 if(displayTime)details.push('LANZAMIENTO · '+displayTime+(s.mechanics?.reactionTrigger?' · Disparador: '+s.mechanics.reactionTrigger:''));
 if(range)details.push('ALCANCE · '+range);
 if(comp)details.push('COMPONENTES · '+comp);
 if(dur)details.push('DURACIÓN · '+dur);
 if(code==='chilltouch'){
   const dice=c.level>=17?4:c.level>=11?3:c.level>=5?2:1;
   details.push('ATAQUE · d20 '+(c.bonus<0?'− ':'+ ')+Math.abs(c.bonus)+' (ataque de conjuro a distancia)');
   details.push('DAÑO AL IMPACTAR · '+dice+'d8 necrótico; el dado cambia en niveles de personaje 5, 11 y 17.');
 }else if(code==='thornwhip'){
   const dice=c.level>=17?4:c.level>=11?3:c.level>=5?2:1;
   details.push('ATAQUE · d20 '+(c.bonus<0?'− ':'+ ')+Math.abs(c.bonus)+' (ataque de conjuro cuerpo a cuerpo, alcance 30 pies)');
   details.push('DAÑO AL IMPACTAR · '+dice+'d6 perforante; puede atraer hasta 10 pies a un objetivo Grande o menor.');
 }else if(s.attack||s.attack_type)details.push('ATAQUE · '+(s.attack||s.attack_type));
 if(code!=='chilltouch'&&code!=='thornwhip'&&s.damage&&!/depende del bloque/i.test(s.damage))details.push('DAÑO · '+s.damage);
 const m=s.mechanics||{};
 if(m.saveAbility)details.push('SALVACIÓN · '+m.saveAbility);
 if(m.upcastText)details.push('ESPACIOS SUPERIORES · '+m.upcastText);
 if(m.summon||s.summon)details.push('CRIATURAS INVOCADAS · Las opciones y el statblock están en el selector interactivo de abajo.');
 if(m.transformation||s.transformation)details.push('TRANSFORMACIÓN · Las formas elegibles y sus estadísticas están en el selector interactivo de abajo.');
 if(s.concentration||m.durationConcentration)details.push('CONCENTRACIÓN · Sí; termina si se rompe la concentración, sin tiradas automáticas.');
 const description=s.description||s.desc||s.text||s.summary;
 if(description)details.push(description);
 const excerpt=!s.referenceVerified&&!s.fromHandbook&&(!s.description||s.description.length<220);
 return {title:n,level,details,source:s.source||'Sin fuente',unverified:excerpt,needsStatBlock:!!(m.summon||m.transformation||s.summon||s.transformation)};
}
function createDetails(node,i,name){
 const x=info(i,name);node.replaceChildren();
 const h=document.createElement('h4');h.textContent=x.title+(x.level?' · Nivel '+x.level:' · Truco');node.append(h);
 for(const [idx,part] of x.details.entries()){
  const p=document.createElement('p');p.textContent=part;
  if(idx<x.details.length-1&&/^[A-ZÁÉÍÓÚÜÑ ]{4,}[ ·]/.test(part))p.className='dma-spell-fact11911';
  node.append(p);
 }
 if(x.unverified){const w=document.createElement('p');w.className='dma-spell-not-verified11911';w.textContent='⚠ Esta ficha del suplemento sigue incompleta. No debe usarse como referencia definitiva hasta verificar su descripción y excepciones.';node.append(w)}
 const foot=document.createElement('small');foot.textContent='Fuente: '+x.source+' · Solo consulta: no gasta espacios ni tira dados.';node.append(foot);
 // Critical: forward the selected spell NAME, not an undefined identifier.
 // Keep a visible error if the statblock component cannot be initialized.
 try{
  if(window.DMASummonBrowser11910?.attach)window.DMASummonBrowser11910.attach(node,i,name);
  else if(x.needsStatBlock){const p=document.createElement('p');p.className='dma-spell-not-verified11911';p.textContent='El visor de criaturas no se cargó. Comprueba que el módulo de invocaciones está publicado.';node.append(p)}
 }catch(err){console.error('[DMAid] Error en visor de criaturas:',err);const p=document.createElement('p');p.className='dma-spell-not-verified11911';p.textContent='Error al mostrar statblock: '+err.message;node.append(p)}
}
function buildDropdown(i){const list=listFor(i);const root=document.createElement('section');root.className='dma-spell-quick1188';const title=document.createElement('h4');title.textContent='📖 Conjuros registrados';root.append(title);if(!list.length){const p=document.createElement('p');p.textContent='Todavía no hay conjuros asignados a este personaje.';root.append(p);return root}const label=document.createElement('label');label.textContent='Seleccionar conjuro';const select=document.createElement('select');select.setAttribute('aria-label','Consultar conjuro registrado');const placeholder=document.createElement('option');placeholder.value='';placeholder.textContent='Elegir conjuro o truco…';select.appendChild(placeholder);for(const item of list){const option=document.createElement('option');option.value=item.name;option.textContent=(item.spell?(Number(item.spell.l)===0?'Truco':'Nivel '+item.spell.l):'No indexado')+' · '+item.name;select.appendChild(option)}label.appendChild(select);root.append(label);const content=document.createElement('div');content.className='dma-spell-info1188';content.textContent='Selecciona un conjuro para consultar su descripción, alcance y efectos.';root.append(content);select.addEventListener('change',()=>{if(select.value)createDetails(content,i,select.value);else content.textContent='Selecciona un conjuro para ver sus reglas.'});return root;}
function buildCantrips(i){const list=listFor(i).filter(x=>classify(x.name)==='cantrip');const relevant=list.filter(x=>/^(thornwhip|latigodeespinas|firebolt|rayoffrost|eldritchblast|sacredflame|chilltouch|poisonspray|shockinggrasp|produceflame)$/.test(spellKey(x.name)));if(!relevant.length)return null;const div=document.createElement('div');div.className='dma-cantrip-attacks1188';const h=document.createElement('b');h.textContent='✨ Trucos de combate conocidos';div.append(h);for(const entry of relevant){const d=document.createElement('details');const summary=document.createElement('summary');summary.textContent=entry.name+' · '+(entry.spell?.range||(/thornwhip/i.test(entry.name)?'30 pies':'Consultar alcance'));d.append(summary);if(/^(thornwhip|latigodeespinas)$/.test(spellKey(entry.name)))d.open=true;const body=document.createElement('div');body.className='dma-spell-info1188';createDetails(body,i,entry.name);d.append(body);div.append(d)}return div;}
const original=renderActivePlayerBlock;
renderActivePlayerBlock=function(panel,key){original(panel,key);const i=Number(key.slice(1));if(!state.players[i])return;const aside=panel.querySelector('.eld-player-slots');if(aside)aside.append(buildDropdown(i));const prior=panel.querySelector('.dma-active-spells-11615');const replacement=buildCantrips(i);if(prior){if(replacement)prior.replaceWith(replacement)}else if(replacement){const sec=panel.querySelector('.dma-four-actions-11615');if(sec)sec.append(replacement)}};
window.DMAcombatSpells1188={info,listFor,castingBonus,getSpell,createDetails};
})();
