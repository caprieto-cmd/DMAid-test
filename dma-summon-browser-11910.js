/* DMAid 1.19.10 · Consultor de invocaciones y transformaciones.
 * Vista informativa: NO lanza conjuros, NO crea combatientes, NO gasta espacios, NO tira dados.
 * Las criaturas ordinarias proceden exclusivamente del bestiario cargado en DMAid.
 */
(function(){'use strict';
const key=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');
const C={Air:'Aire',Land:'Tierra',Water:'Agua',Earth:'Tierra',Fire:'Fuego',Fuming:'Furioso',Mirthful:'Alegre',Tricksy:'Astuto'};
const nice=v=>C[v]||v;
function el(tag,cls,text){const e=document.createElement(tag);if(cls)e.className=cls;if(text!=null)e.textContent=String(text);return e;}
function part(parent,tag,cls,text){const node=el(tag,cls,text);parent.append(node);return node}
function field(parent,name,value){const p=part(parent,'p','dma-summon-field');const b=el('strong','',name+': ');p.append(b,document.createTextNode(String(value??'—')));return p;}
function addControl(parent,label,values){const wrap=part(parent,'label','dma-summon-control');part(wrap,'span','',label);const sel=part(wrap,'select');for(const v of values){const o=el('option','',v.label);o.value=String(v.value);sel.append(o)}return sel;}
function asCR(value){if(typeof value==='number')return Number.isFinite(value)?value:null;const v=typeof value==='object'?value?.cr:value;const s=String(v??'').trim().replace(/^CR\s*/i,'');if(/^\d+\s*\/\s*\d+$/.test(s)){const [a,b]=s.split('/').map(Number);return b?a/b:null}const n=Number(s.replace(',','.'));return Number.isFinite(n)&&s!==''?n:null}
function showCR(n){if(n===.125)return '1/8';if(n===.25)return '1/4';if(n===.5)return '1/2';return String(n)}
function kindOf(m){return String(m.kind||m.type||m.creatureType||m.stat?.type||'').toLowerCase()}
function fromBestiary(){try{if(typeof bestiaryV3Entries==='function')return bestiaryV3Entries();}catch(e){console.warn('[DMAid Invocaciones] Bestiario no disponible',e)}return []}
function hasFull(m){if(!m)return false;const st=m.stat||{};return !!(m.actions||m.traits||['trait','action','bonus','reaction','legendary'].some(k=>Array.isArray(st[k])&&st[k].length))}
function rich(m){try{return typeof v10RichVersion==='function'?v10RichVersion(m):m}catch(e){return m}}
function classify(m,types){const v=kindOf(m);return types.some(t=>t==='beast'?/beast|bestia/.test(v):t==='fey'?/\bfey\b|fe[eé]rico|hada/.test(v):t==='elemental'?/elemental/.test(v):false)}
function maxSlot(i,base){try{const sh=profile(i),auto=slotCalc(i).slots||[];const slots=Array.isArray(sh.slots)?sh.slots:auto;const found=slots.reduce((n,x,j)=>Number(x)>0?j+1:n,0);return Math.max(base,Math.min(9,found||base));}catch(e){return base}}
function caster(i){try{const v=window.DMAcombatSpells1188?.castingBonus?.(i);if(v)return v;const sh=profile(i),cs=sh.classes||[],lvl=cs.reduce((n,c)=>n+(Number(c.level)||0),0),pb=2+Math.floor((Math.max(lvl,1)-1)/4),stat=Number(sh.abilities?.SAB)||10;return {bonus:pb+Math.floor((stat-10)/2),dc:8+pb+Math.floor((stat-10)/2)}}catch(e){return {bonus:0,dc:8}}}
function formatList(parent,title,lines){if(!lines?.length)return;part(parent,'h5','',title);for(const line of lines)part(parent,'p','dma-summon-rule',line)}
function statItem(parent,label,value){const item=part(parent,'div','dma-summon-stat');part(item,'small','',label);part(item,'strong','',value)}
function statGrid(parent,stats){const g=part(parent,'div','dma-summon-stats');for(const [label,value] of stats)statItem(g,label,value);return g}
function abilityGrid(parent,abilities){if(!abilities)return;const g=part(parent,'div','dma-summon-abilities');const names=['FUE','DES','CON','INT','SAB','CAR'];abilities.forEach((v,i)=>{const n=Number(v);const x=Math.floor((n-10)/2);const cell=part(g,'div');part(cell,'strong','',names[i]);part(cell,'span','',n+(x>=0?' (+':' (')+x+')')})}
function summaryEntry(x){
 if(x==null)return '';
 if(typeof x==='string')return x.replace(/\{@[^ ]+\s+([^}|]+)(?:\|[^}]*)?\}/g,'$1').replace(/<[^>]+>/g,'');
 if(typeof x==='number')return String(x);
 if(Array.isArray(x))return x.map(summaryEntry).filter(Boolean).join(' · ');
 if(typeof x==='object'){
  if(x.entries||x.entry)return [x.name,summaryEntry(x.entries||x.entry)].filter(Boolean).join(': ');
  if(x.number!==undefined)return String(x.number)+(x.condition?' ('+summaryEntry(x.condition)+')':'');
  return Object.entries(x).map(([k,v])=>k+': '+summaryEntry(v)).filter(Boolean).join(' · ');
 }
 return String(x);
}
function speedEntry(speed){
 if(speed==null)return '';
 if(typeof speed!=='object'||Array.isArray(speed))return summaryEntry(speed);
 const labels={walk:'Caminar',fly:'Volar',swim:'Nadar',climb:'Trepar',burrow:'Excavar'};
 return Object.entries(speed).filter(([k,v])=>v!=null).map(([k,v])=>{
  const text=typeof v==='number'?v+' pies':(v?.number!=null?v.number+' pies'+(v.condition?' ('+summaryEntry(v.condition)+')':''):summaryEntry(v));
  return (labels[k]||k)+': '+text;
 }).join(' · ');
}
function bestiarySheet(target,m,casterIndex,spellName){target.replaceChildren();if(!m)return;const x=rich(m)||m,stat=x.stat||{};const cr=asCR(x.cr);
 part(target,'h5','dma-summon-name',x.name||'Criatura');part(target,'div','dma-summon-sub',(x.kind||'Criatura')+' · CR '+(cr==null?'sin verificar':showCR(cr))+' · '+(x.source||'Sin fuente'));
 const shepherd=typeof casterIndex==='number'&&window.DMAShepherd11924?.level?.(casterIndex)>=6;
 const qualifies=/^(conjureanimals|conjurewoodlandbeings|conjurefey)$/.test(key(spellName))&&(classify(x,['beast','fey'])||key(spellName)==='conjurefey');
 const boost=shepherd&&qualifies?window.DMAShepherd11924.summonedHP(x,window.DMAShepherd11924.level(casterIndex)):null;
 const hpLabel=boost?.total!=null?boost.total+' (base '+boost.base+' + '+boost.extra+' de Mighty Summoner)':x.hp??'—';
 statGrid(target,[['CA',x.ac??'—'],['HP',hpLabel],['Iniciativa DES',Number(x.dex)>=0?'+'+(Number(x.dex)||0):x.dex],['Velocidad',speedEntry(stat.speed)||'Consultar ficha']]);
 if(boost){part(target,'p','dma-summon-rule',boost.extra!=null?'Mighty Summoner: +2 HP por dado de golpe ('+boost.hitDice+' dados); las armas naturales infligen daño mágico a efectos de resistencias e inmunidades.':'Mighty Summoner: armas naturales mágicas a efectos de resistencias e inmunidades. Este registro no contiene dados de golpe verificables; el aumento de HP debe revisarse, NO se ha inventado.')}
 if(['str','dex','con','int','wis','cha'].every(k=>Number.isFinite(Number(stat[k]))))abilityGrid(target,['str','dex','con','int','wis','cha'].map(k=>Number(stat[k])));
 for(const [label,k] of [['Salvaciones','save'],['Habilidades','skill'],['Resistencias','resist'],['Inmunidades al daño','immune'],['Inmunidades a estados','conditionImmune'],['Sentidos','senses'],['Idiomas','languages']])if(stat[k])field(target,label,summaryEntry(stat[k]));
 for(const [label,k,fallback] of [['Rasgos','trait',x.traits],['Acciones','action',x.actions],['Bonus Actions','bonus',null],['Reacciones','reaction',null]]){
  const vals=Array.isArray(stat[k])?stat[k]:[];
  if(vals.length||fallback){part(target,'h6','',label);if(vals.length)for(const a of vals)field(target,a.name||label,summaryEntry(a));else part(target,'p','dma-summon-rule',fallback)}
 }
 if(!hasFull(x))part(target,'p','dma-summon-warning','Esta entrada del bestiario es resumida. Carga una ficha completa del libro para consultar sus acciones exactas.');
 const open=part(target,'button','dma-summon-full','Abrir ficha completa del bestiario');open.type='button';open.addEventListener('click',()=>{try{if(typeof openBestiaryPreview==='function')openBestiaryPreview(x.id);else alert('El visor del bestiario no está disponible.')}catch(e){console.warn(e);alert('No se pudo abrir la ficha.')}});
 part(target,'p','dma-summon-small','Vista informativa: no añade automáticamente combatientes ni gasta recursos.');
}
function spiritStats(name,form,slot,bonus,dc){const attacks=Math.floor(slot/2);const common={slot,attacks,bonus,dc};
 if(key(name)==='summonbeast')return {...common,name:'Bestial Spirit',kind:'Bestia (espíritu)',size:'Pequeño',ac:11+slot,hp:(form==='Air'?20:30)+5*(slot-2),speed:'30 pies'+(form==='Air'?'; vuelo 60 pies':form==='Land'?'; trepar 30 pies':'; nado 30 pies'),abilities:[18,11,16,4,14,5],senses:'Visión oscura 60 pies, Percepción pasiva 12',languages:'Entiende los idiomas del lanzador',traits:[form==='Air'?'Flyby: al volar fuera del alcance enemigo no provoca ataques de oportunidad.': 'Pack Tactics: ventaja en el ataque si un aliado no incapacitado está junto al objetivo.',...(form==='Water'?['Water Breathing: solo respira bajo el agua.']:[])],attack:'Maul · ataque cuerpo a cuerpo +'+bonus+' · alcance 5 pies · 1d8 + '+(4+slot)+' perforante',resist:null};
 if(key(name)==='summonfey')return {...common,name:'Fey Spirit',kind:'Feérico (espíritu)',size:'Pequeño',ac:12+slot,hp:30+10*(slot-3),speed:'40 pies',abilities:[13,16,14,14,11,16],senses:'Visión oscura 60 pies, Percepción pasiva 10',languages:'Silvano; entiende los idiomas del lanzador',traits:['Inmunidad a la condición hechizado (charmed).'],attack:'Shortsword · ataque cuerpo a cuerpo +'+bonus+' · alcance 5 pies · 1d6 + '+(3+slot)+' perforante + 1d6 fuerza',bonusAction:form==='Fuming'?'Fey Step: teletransporte 30 pies; ventaja en el siguiente ataque antes de terminar el turno.':form==='Mirthful'?'Fey Step: teletransporte 30 pies; una criatura a 10 pies debe superar SAB CD '+dc+' o queda hechizada 1 minuto, hasta que reciba daño.':'Fey Step: teletransporte 30 pies; crea oscuridad mágica en un cubo de 5 pies hasta el final de su próximo turno.'};
 if(key(name)==='summonelemental'){
  const types={Air:'Rayo y trueno',Earth:'Perforante y cortante',Fire:'Ninguna adicional',Water:'Ácido'};
  return {...common,name:'Elemental Spirit',kind:'Elemental (espíritu)',size:'Mediano',ac:11+slot,hp:50+10*(slot-4),speed:'40 pies'+(form==='Earth'?'; excavar 40 pies':form==='Air'?'; vuelo 40 pies (flotar)':form==='Water'?'; nado 40 pies':''),abilities:[18,15,17,4,10,16],senses:'Visión oscura 60 pies, Percepción pasiva 10',languages:'Primordial; entiende los idiomas del lanzador',traits:[...(form==='Earth'?[]:['Amorphous Form: atraviesa aberturas de 1 pulgada sin apretarse.'])],resist:'Resistencia: '+types[form]+' · Inmunidad al daño: veneno'+(form==='Fire'?', fuego':''),conditions:'Inmune a agotamiento, asustado, paralizado, petrificado, envenenado e inconsciente',attack:'Slam · ataque cuerpo a cuerpo +'+bonus+' · alcance 5 pies · 1d10 + '+(4+slot)+' '+(form==='Fire'?'fuego':'contundente')};
 }
 return null;
}
function spiritSheet(target,spell,form,slot,casting){const s=spiritStats(spell,form,slot,casting.bonus,casting.dc);target.replaceChildren();if(!s){part(target,'p','dma-summon-warning','Bloque del espíritu no disponible en el catálogo.');return}
 part(target,'h5','dma-summon-name',s.name+' · '+nice(form));part(target,'div','dma-summon-sub',s.size+' · '+s.kind+' · Conjuro nivel '+slot+' · TCE 2020 · Sin CR');
 statGrid(target,[['CA',s.ac],['HP',s.hp],['Ataque','+'+s.bonus],['Ataques/acción',s.attacks]]);field(target,'Movimiento',s.speed);abilityGrid(target,s.abilities);field(target,'Sentidos',s.senses);field(target,'Idiomas',s.languages);if(s.resist)field(target,'Defensas',s.resist);if(s.conditions)field(target,'Inmunidades a condiciones',s.conditions);
 formatList(target,'Rasgos',s.traits);formatList(target,'Acciones',['Multiattack: '+s.attacks+' ataque(s) con la acción Atacar.',s.attack]);if(s.bonusAction)formatList(target,'Bonus Actions',[s.bonusAction]);
 part(target,'p','dma-summon-small','Usa el modificador de ataque mágico y la CD del lanzador. El jugador realiza las tiradas y el DM registra los usos. Bloque derivado de las fórmulas de Tasha (2020), no de una bestia ordinaria.');
}
function typeList(spell){const name=key(spell);if(name==='conjureanimals'||name==='polymorph'||name==='animalshapes'||name==='giantinsect')return ['beast'];if(name==='conjurewoodlandbeings')return ['fey'];if(name==='conjureminorelementals'||name==='conjureelemental')return ['elemental'];if(name==='conjurefey')return ['fey','beast'];if(name==='shapechange')return ['beast','fey','elemental','other'];return []}
function filterMonsters(spell,cap,element,mode){const name=key(spell);const types=typeList(spell);const raw=fromBestiary();let arr=raw.filter(m=>{
  const cr=asCR(m.cr);if(cr==null||cr>cap)return false;
  const typ=kindOf(m);if(name==='shapechange'){if(/construct|constructo|undead|muerto viviente|no muerto/.test(typ))return false;}
  else if(!classify(m,types))return false;
  if(name==='conjurefey'&&mode==='fey'&&!classify(m,['fey']))return false;if(name==='conjurefey'&&mode==='beast'&&!classify(m,['beast']))return false;
  if(name==='conjureelemental'&&element&&element!=='all'){
   const t=key(m.name);const aliases={Air:/air|aire/,Earth:/earth|tierra/,Fire:/fire|fuego/,Water:/water|agua/};if(!aliases[element]?.test(t))return false;
  }
  if(name==='animalshapes'){const size=String(m.stat?.size||m.size||'').toLowerCase();if(/huge|gargant|enorme|gigant/.test(size))return false;}
  if(name==='giantinsect'){const target={centipede:'giantcentipede',spider:'giantspider',wasp:'giantwasp',scorpion:'giantscorpion'}[mode];if(target&&key(m.name)!==target)return false;}
  return true;
 });
 const grouped=new Map();for(const m of arr){const id=key(m.name)+'|'+showCR(asCR(m.cr));const prev=grouped.get(id);if(!prev||(hasFull(m)&&!hasFull(prev)))grouped.set(id,m)}return [...grouped.values()].sort((a,b)=>asCR(a.cr)-asCR(b.cr)||String(a.name).localeCompare(String(b.name),'es'));
}
function attach(host,i,name){try{const s=window.DMADruidRules1199?.getSpell?.(name);const metadata=s?.mechanics||{};if(!metadata.summon&&!metadata.transformation)return;
 const root=part(host,'section','dma-summon-browser11910');const head=part(root,'h4','dma-summon-heading',metadata.summon?'🐉 Consultar criatura invocada':'🐾 Consultar forma de transformación');
 const note=part(root,'p','dma-summon-small','Elige las opciones del conjuro para consultar el bloque correspondiente. No se lanzan dados ni se gastan recursos.');
 const controls=part(root,'div','dma-summon-controls');const minLevel=Number(s.l)||0;const up=metadata.summon?.dependsOnSlotLevel||metadata.summon?.count_multiplier_by_slot||metadata.summon?.cr_max_by_slot;
 const slotSelect=(up||metadata.summon?.options||metadata.transformation)?addControl(controls,'Nivel de espacio (solo consulta)',Array.from({length:maxSlot(i,minLevel)-minLevel+1},(_,j)=>({value:minLevel+j,label:'Nivel '+(minLevel+j)}))):null;
 const summon=metadata.summon;
 const mode=key(name);
 let optionSelect=null,formSelect=null,targetSelect=null,query=null,crSelect=null,monsterSelect=null,refresh=null;
 if(summon?.forms?.length)formSelect=addControl(controls,'Forma del espíritu',summon.forms.map(v=>({value:v,label:nice(v)})));
 if(summon?.options?.length)optionSelect=addControl(controls,'Opción del conjuro: cantidad y CR máximo',summon.options.map((v,j)=>({value:j,label:v.count+' criatura(s), CR hasta '+showCR(v.cr_max)})));
 if(mode==='conjureelemental')formSelect=addControl(controls,'Elemento elegido',[{value:'all',label:'Todos los elementos'},...['Air','Earth','Fire','Water'].map(v=>({value:v,label:nice(v)}))]);
 if(mode==='conjurefey')formSelect=addControl(controls,'Tipo permitido',[{value:'fey',label:'Criatura feérica'},{value:'beast',label:'Espíritu feérico con forma de bestia'}]);
 if(mode==='giantinsect')formSelect=addControl(controls,'Insecto transformado',[{value:'centipede',label:'10 Giant Centipedes'},{value:'spider',label:'3 Giant Spiders'},{value:'wasp',label:'5 Giant Wasps'},{value:'scorpion',label:'1 Giant Scorpion'}]);
 if(mode==='polymorph'||mode==='shapechange')targetSelect=addControl(controls,mode==='polymorph'?'Nivel o CR del objetivo':'Nivel total del lanzador',Array.from({length:20},(_,j)=>({value:j+1,label:'Nivel '+(j+1)})));
 if(targetSelect){const c=caster(i);targetSelect.value=String(c.level||Math.max(1,minLevel))}
 const feedback=part(root,'p','dma-summon-hint');const listArea=part(root,'div','dma-summon-listarea');const sheet=part(root,'div','dma-summon-sheet');
 if(!summon?.forms?.length){
   const row=part(listArea,'div','dma-summon-pick');const qWrap=part(row,'label','dma-summon-control');part(qWrap,'span','', 'Buscar criatura');query=part(qWrap,'input');query.type='search';query.placeholder='Nombre de criatura…';
   crSelect=addControl(row,'Filtrar por CR',[{value:'all',label:'Todos los CR permitidos'}]);
   const cWrap=part(row,'label','dma-summon-control');part(cWrap,'span','','Criaturas compatibles (catálogo cargado)');monsterSelect=part(cWrap,'select');
   refresh=part(row,'button','dma-summon-refresh','Actualizar bestiario');refresh.type='button';
   const load=part(row,'button','dma-summon-refresh','Cargar Monster Manual (2014)');load.type='button';
   load.addEventListener('click',async()=>{
    if(typeof loadRemoteBestiary!=='function'){feedback.textContent='El cargador de libros no está disponible aquí. Abre Bestiario y carga Monster Manual (2014).';return}
    load.disabled=true;load.textContent='Cargando criaturas…';
    try{await loadRemoteBestiary('MM');calculate();if(!fromBestiary().length)feedback.textContent='La carga no agregó criaturas. Comprueba conexión o importa el JSON del bestiario en la pestaña Bestiario.'}
    catch(e){console.error('[DMAid] Carga de bestiario desde conjuro',e);feedback.textContent='No se pudo cargar Monster Manual: '+e.message}
    finally{load.disabled=false;load.textContent='Cargar Monster Manual (2014)'}
   });
 }
 const calculate=()=>{
   const level=Number(slotSelect?.value)||minLevel;const form=formSelect?.value||summon?.forms?.[0]||'all';const casting=caster(i);
   if(summon?.forms?.length){feedback.textContent='Espíritu único · '+nice(form)+' · espacio nivel '+level+' · ataque mágico +'+casting.bonus+' · CD '+casting.dc;spiritSheet(sheet,name,form,level,casting);
     if(window.DMAShepherd11924?.level?.(i)>=6&&['summonbeast','summonfey'].includes(key(name))){part(sheet,'p','dma-summon-warning','Mighty Summoner: esta ficha de espíritu no indica dados de golpe. No es posible calcular de forma verificable HP adicionales con la regla +2 por dado. Los ataques naturales de la criatura cuentan como mágicos cuando el rasgo es aplicable.');}
     return}
   let cap=0,count=1,noteText='';
   if(optionSelect){const opt=summon.options[Number(optionSelect.value)||0];cap=Number(opt.cr_max);count=Number(opt.count)||1;const extras=summon.count_multiplier_by_slot||{};const mult=Object.entries(extras).filter(([k])=>level>=Number(k)).sort((a,b)=>Number(b[0])-Number(a[0]))[0];if(mult)count*=Number(mult[1]);}
   else if(mode==='conjureelemental')cap=level;
   else if(mode==='conjurefey')cap=6+Math.max(0,level-6);
   else if(mode==='polymorph')cap=Number(targetSelect?.value)||1;
   else if(mode==='animalshapes')cap=4;
   else if(mode==='shapechange')cap=Number(targetSelect?.value)||1;
   else if(mode==='giantinsect')cap=3;
   if(mode==='giantinsect')count=({centipede:10,spider:3,wasp:5,scorpion:1})[form]||1;
   if(mode==='polymorph')noteText='En Polymorph, CR máximo = nivel o CR del objetivo, el menor de los dos. Ajusta la selección según el objetivo real. ';
   if(mode==='shapechange')noteText='Se requieren criaturas vistas previamente; otras restricciones de Shapechange deben comprobarse con el DM. ';
   if(mode==='conjurefey'&&form==='beast')noteText='La forma es un espíritu feérico con las estadísticas de la bestia seleccionada. ';
   const matching=filterMonsters(name,cap,form,form);
   if(crSelect){
     const previous=crSelect.value;
     const ratings=[...new Set(matching.map(m=>asCR(m.cr)))].sort((a,b)=>a-b);
     crSelect.replaceChildren();
     const all=el('option','', 'Todos los CR permitidos');all.value='all';crSelect.append(all);
     for(const v of ratings){const o=el('option','', 'CR '+showCR(v));o.value=String(v);crSelect.append(o)}
     crSelect.value=ratings.some(v=>String(v)===previous)?previous:'all';
   }
   const search=(query?.value||'').toLowerCase().trim();
   const filtered=matching.filter(m=>(!search||m.name.toLowerCase().includes(search))&&(!crSelect||crSelect.value==='all'||String(asCR(m.cr))===crSelect.value));
   const prev=monsterSelect?.value;monsterSelect?.replaceChildren();
   if(monsterSelect){for(const m of filtered.slice(0,400)){const o=el('option','',m.name+' · CR '+showCR(asCR(m.cr))+(hasFull(m)?'':' · ficha parcial'));o.value=String(m.id);monsterSelect.append(o)}if(prev&&filtered.some(m=>String(m.id)===prev))monsterSelect.value=prev;monsterSelect.disabled=!filtered.length;}
   feedback.textContent=noteText+(summon?'Opciones: '+count+' criatura(s), CR hasta '+showCR(cap):'CR hasta '+showCR(cap))+' · '+matching.length+' criaturas compatibles en bestiario · '+filtered.length+' visibles.';
   if(mode==='conjureanimals'||mode==='conjurewoodlandbeings'||mode==='conjureminorelementals')feedback.textContent+=' El DM determina qué criaturas concretas aparecen; la opción indica solo cantidad y CR.';
   if(mode==='giantinsect')feedback.textContent+=' Giant Insect transforma insectos existentes; no convoca criaturas nuevas.';
   if(!filtered.length){sheet.replaceChildren();part(sheet,'p','dma-summon-warning',matching.length?'No hay coincidencias con la búsqueda.':'No hay criaturas compatibles cargadas. Abre Bestiario, carga Monster Manual (2014) u otro libro permitido y vuelve aquí; después pulsa «Actualizar bestiario». No se fabricarán estadísticas.');return;}
   const selected=filtered.find(m=>String(m.id)===monsterSelect.value)||filtered[0];bestiarySheet(sheet,selected,i,name);
 };
 for(const control of [slotSelect,formSelect,optionSelect,targetSelect,crSelect,monsterSelect])if(control)control.addEventListener('change',calculate);
 query?.addEventListener('input',calculate);refresh?.addEventListener('click',calculate);
 calculate();
 }catch(e){console.error('[DMAid] Error creando el visor de invocaciones',e);const p=part(host,'p','dma-summon-warning','No se pudo cargar el visor de invocaciones: '+e.message)} }
window.DMASummonBrowser11910=Object.freeze({attach,spiritStats,filterMonsters,asCR});
})();
