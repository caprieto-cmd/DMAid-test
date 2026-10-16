/* DM.AID · New creation pipeline. Independent of the legacy wizard. */
(function(){
'use strict';
const A=['FUE','DES','CON','INT','SAB','CAR'];
let racialLibrary=null;
let racialLoading=null;
function loadRacialLibrary(){
 if(racialLibrary)return Promise.resolve(racialLibrary);
 if(!racialLoading)racialLoading=fetch('./races.pre2024.normalized.v7.json?v=1.18.3',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('No se pudo cargar la biblioteca racial: HTTP '+r.status);return r.json()}).then(db=>{DMAidRacialEngine.indexLibrary(db);racialLibrary=db;return db}).catch(e=>{racialLoading=null;throw e});
 return racialLoading;
}
const racialEntries=()=>racialLibrary?.entries||[];
function racialEntry(){return racialEntries().find(x=>x.id===model?.race?.id)||null;}
function racialResolve(){if(!model||!racialLibrary||!racialEntry())return null;
 const picks=Object.fromEntries(A.map(a=>[a,0]));
 const e=racialEntry();const rule=e.ability_increases||{};
 const choices=model.race.engineChoices||{};
 if(rule.mode==='choice'&&rule.count===2){model.race.asiChoices.forEach(a=>{if(A.includes(a))picks[a]++;});}
 if(rule.mode==='flexible'){let scheme=model.race.flexScheme||'2+1';const targets=model.race.flexTargets||['FUE','DES','CON'];const vals=scheme==='1+1+1'?[1,1,1]:[2,1];vals.forEach((n,i)=>{if(A.includes(targets[i]))picks[targets[i]]+=n;});}
 const chosen={...choices};
 if(['choice','flexible'].includes(rule.mode))chosen.abilityIncreases=picks;
 const variant=model.race.id==='race.phb2014.human.variant';
 if(variant){
  chosen['race.phb2014.human.variant/ability-score-increase-(two-distinct-+1)']=[...model.race.asiChoices];
  chosen['race.phb2014.human.variant/skill-proficiency-(choice)']=model.race.skill?[model.race.skill]:[];
  chosen['race.phb2014.human.variant/feat-(choice)']=model.race.feat?[model.race.feat]:[];
 }
 return DMAidRacialEngine.resolve(racialLibrary,{raceId:e.id,level:total(),choices:chosen});
}
function pickRaceId(id){const e=racialEntries().find(x=>x.id===id);if(!e)return;
 model.languages={selected:[]};model.race.id=id;model.race.name=e.parent_id?(racialEntries().find(x=>x.id===e.parent_id)?.name||e.name):e.name;
 model.race.variant=e.parent_id?e.name:'Sin subraza';
 model.race.skill='';model.race.feat='';model.race.featAbility='';model.race.asiChoices=['FUE','DES'];model.race.engineChoices={};model.race.flexScheme='2+1';model.race.flexTargets=['FUE','DES','CON'];
 render();
}
function racePicker(){const entries=racialEntries(),roots=entries.filter(x=>!x.parent_id),chosen=racialEntry();if(!chosen)return '<p class="cb2-note">Biblioteca racial no disponible.</p>';
 const lineage=chosen.parent_id||chosen.id;
 const children=entries.filter(x=>x.parent_id===lineage);
 return `<label>Raza / especie y fuente<select data-race-root="1">${roots.map(e=>`<option value="${escapeText(e.id)}" ${lineage===e.id?'selected':''}>${escapeText(e.name)} · ${escapeText(e.source?.book_id||'')}</option>`).join('')}</select></label>${children.length?`<label>Subraza / variante<select data-race-id="1">${children.map(e=>`<option value="${escapeText(e.id)}" ${chosen.id===e.id?'selected':''}>${escapeText(e.name)}</option>`).join('')}</select></label>`:''}`;
}
function detailedRacialSummary(){const e=racialEntry(),r=racialResolve();if(!r||!e)return '<p>Elige una raza para ver sus rasgos.</p>';
 const rule=e.ability_increases||{};
 const asi=rule.mode==='flexible'?`<div class="cb2-wide"><b>Bonificaciones flexibles · MMotM 2022</b>${picker('Distribución','race.flexScheme',['2+1','1+1+1'],model.race.flexScheme||'2+1')}<div class="cb2-grid">${(model.race.flexScheme==='1+1+1'?[0,1,2]:[0,1]).map((i)=>abilitySelect((model.race.flexScheme==='1+1+1'?'+1':i?'+1':'+2')+' en','race.flexTargets.'+i,(model.race.flexTargets||[])[i]||A[i])).join('')}</div></div>`:'';
 const pending=r.pendingChoices.filter(c=>!((model.race.id==='race.phb2014.human.variant')&&['feat','skill_proficiency','ability_increase'].includes(c.kind)));
 return `${asi}<div class="cb2-wide cb2-note"><b>Rasgos de ${escapeText(e.name)} · ${escapeText(e.source.book_id)}</b><p>${r.traits.map(t=>escapeText(t.name)).join(' · ')||'Sin rasgos especiales catalogados'}</p><p>Competencias raciales: ${escapeText(r.proficiencies.skill.join(', ')||'Sin competencias fijas')} · Resistencias: ${escapeText(r.resistances.join(', ')||'Ninguna')}</p>${pending.length?`<p class="cb2-warning">${pending.length} decisiones raciales especiales pendientes de configurar en una etapa futura. Quedarán registradas como pendientes y no se aplicarán silenciosamente.</p>`:''}${r.errors.length?`<p class="cb2-warning">${escapeText(r.errors.map(x=>x.message).join('; '))}</p>`:''}</div>`;
}
const classSkills={Guerrero:['Acrobacias','Trato con animales','Atletismo','Historia','Perspicacia','Intimidación','Percepción','Supervivencia'],Pícaro:['Acrobacias','Atletismo','Engaño','Perspicacia','Intimidación','Investigación','Percepción','Interpretación','Persuasión','Juego de manos','Sigilo'],Clérigo:['Historia','Perspicacia','Medicina','Persuasión','Religión'],Artífice:['Arcanos','Historia','Investigación','Medicina','Naturaleza','Percepción','Juego de manos'],Mago:['Arcanos','Historia','Perspicacia','Investigación','Medicina','Religión'],Bárbaro:['Trato con animales','Atletismo','Intimidación','Naturaleza','Percepción','Supervivencia'],Bardo:SKILLS_V110.map(x=>x[0])};
const skillCount={Pícaro:4,Bardo:3,Explorador:3};

// Una sola contabilidad de competencias, con su procedencia y grado de dominio.
const KNOWLEDGE_SKILLS=['Arcanos','Historia','Naturaleza','Religión'];
const ALL_SKILLS=()=>SKILLS_V110.map(x=>x[0]);
const normalizeSkill=(skill)=>({'Arcana':'Arcanos','History':'Historia','Nature':'Naturaleza','Religion':'Religión','Insight':'Perspicacia','Medicine':'Medicina','Investigation':'Investigación','Perception':'Percepción','Survival':'Supervivencia'}[skill]||skill);
function hasKnowledgeDomain(){return model.classes.some(c=>c.name==='Clérigo' && /knowledge|conocimiento/i.test(c.sub||'') && Number(c.level)>=1);}
function resolveCompetencyLedger(racial){
 const ledger={};const events=[];
 function award(kind,name,source,rank='proficient'){
  const key=kind+':'+normalizeSkill(name); if(!name)return;
  const current=ledger[key]||{kind,name:normalizeSkill(name),rank:'none',sources:[]};
  current.sources.push({source,rank});if(rank==='expertise'||(rank==='proficient'&&current.rank==='none'))current.rank=rank;
  ledger[key]=current;events.push({kind,name:current.name,source,rank});
 }
 (racial?.proficiencies?.skill||[]).forEach(x=>award('skill',x,'Raza: '+(racial?.raceName||'')));
 if(variantHuman() && model.race.skill)award('skill',model.race.skill,'Raza: humano variante');
 model.proficiencies.classSkills.forEach(x=>award('skill',x,'Clase inicial: '+model.classes[0].name));
  model.classes.slice(1).forEach(c=>{if(c.name==='Bardo') (c.multiclassSkills||[]).forEach(x=>award('skill',x,'Multiclase: Bardo')); if(c.name==='Pícaro')(c.multiclassSkills||[]).forEach(x=>award('skill',x,'Multiclase: Pícaro'));});
 const bg=BG_V120[model.background.name];
 if(bg){let skills=[...bg.skills];if(/Cloistered|Erudito del claustro/i.test(model.background.name)&&model.background.extraSkill)skills.push(model.background.extraSkill);skills.forEach(x=>award('skill',model.background.replacement[x]||x,'Trasfondo: '+model.background.name));}
 if(hasKnowledgeDomain())(model.proficiencies.knowledgeSkills||[]).forEach(x=>award('skill',x,'Dominio del Conocimiento: Blessings of Knowledge','expertise'));
 return {ledger,events};
}
// Idiomas: concesiones fijas y cupos de elección, conservando fuentes separadas.
const LANGUAGE_COMMON_2014=['Común','Enano','Élfico','Gigante','Gnómico','Goblin','Mediano','Orco'];
const LANGUAGE_EXOTIC_2014=['Abisal','Celestial','Dracónico','Habla profunda','Infernal','Primordial','Silvano','Infracomún'];
const LANGUAGE_EXTRA=['Auran','Acuano','Ígneo','Terrano','Gith','Quori','Riedrano','Druídico','Jerga de ladrones'];
const LANGUAGE_ALL=[...LANGUAGE_COMMON_2014,...LANGUAGE_EXOTIC_2014,...LANGUAGE_EXTRA];
const RACE_LANGUAGES_2014={human:[],elf:['Élfico'],dwarf:['Enano'],halfling:['Mediano'],dragonborn:['Dracónico'],gnome:['Gnómico'],'half-elf':['Élfico'],'half-orc':['Orco'],tiefling:['Infernal']};
function languageEntitlements(){
 const fixed=[{name:'Común',source:'Raza: idioma común'}], grants=[];
 const entry=racialEntry(),id=entry?.id||'',root=(entry?.parent_id||id).split('.').pop();
 if(id.startsWith('race.phb2014.')){
  for(const name of RACE_LANGUAGES_2014[root]||[])fixed.push({name,source:'Raza: '+root});
  if(root==='human'||root==='half-elf')grants.push({source:'Raza: idioma adicional',count:1});
  if(id==='race.phb2014.elf.high')grants.push({source:'Subraza: alto elfo',count:1});
 }else if(id.startsWith('race.mpmm2022.'))grants.push({source:'Raza: MMotM 2022',count:1});
 // La raza de MMotM concede Común y otra lengua autorizada por el DM.
 const bg=BG_V120[model.background.name];if(bg?.languages)grants.push({source:'Trasfondo: '+model.background.name,count:Number(bg.languages)});
 if(hasKnowledgeDomain())grants.push({source:'Blessings of Knowledge (Clérigo del Conocimiento)',count:2});
 if(model.race.feat==='Linguist')grants.push({source:'Dote: Linguist',count:3});
 if(model.classes.some(c=>c.name==='Druida'))fixed.push({name:'Druídico',source:'Clase: Druida'});
 if(model.classes.some(c=>c.name==='Pícaro'))fixed.push({name:'Jerga de ladrones',source:'Clase: Pícaro'});
 return {fixed:[...new Map(fixed.map(x=>[x.name,x])).values()],grants,total:grants.reduce((s,g)=>s+g.count,0)};
}
function languageLedger(){
 const ent=languageEntitlements(),fixed=new Set(ent.fixed.map(x=>x.name));
 const choices=(model.languages?.selected||[]).filter(x=>LANGUAGE_ALL.includes(x)&&!fixed.has(x));
 const selected=[...new Set(choices)].slice(0,ent.total);
 // Cupos consumidos en orden de concesión; fuentes precisas recuperables.
 const allocations=[];let index=0;
 for(const grant of ent.grants){allocations.push({...grant,selected:selected.slice(index,index+grant.count)});index+=grant.count;}
 return {...ent,selected,allocations,remaining:ent.total-selected.length,all:[...ent.fixed.map(x=>x.name),...selected]};
}
function chooseLanguage(name,checked){const ent=languageEntitlements(),fixed=new Set(ent.fixed.map(x=>x.name));if(fixed.has(name))return;
 const previous=model.languages?.selected||[];let next=checked?[...new Set([...previous,name])]:previous.filter(x=>x!==name);
 next=next.filter(x=>LANGUAGE_ALL.includes(x)&&!fixed.has(x));if(next.length>ent.total){return;}model.languages={selected:next};render();}
function languagesPanel(){const l=languageLedger(),selected=new Set(l.selected),fixed=new Set(l.fixed.map(x=>x.name));
 const group=(title,items)=>`<div class="cb2-language-group"><b>${title}</b><div class="cb2-checks">${items.map(name=>`<label><input type="checkbox" data-language="${escapeText(name)}" ${selected.has(name)||fixed.has(name)?'checked':''} ${fixed.has(name)||(!selected.has(name)&&l.remaining===0)?'disabled':''}> ${escapeText(name)}${fixed.has(name)?' · fijo':''}</label>`).join('')}</div></div>`;
 return `<section class="cb2-language-panel cb2-wide"><h3>Idiomas del personaje</h3><p><b>${l.selected.length} de ${l.total}</b> idiomas adicionales elegidos · <b>${l.remaining}</b> por elegir. Los fijos no gastan cupos.</p><p class="cb2-note">Concedidos automáticamente: ${escapeText(l.fixed.map(x=>x.name+' ('+x.source+')').join(' · '))}.</p><p>${l.grants.map(x=>`${escapeText(x.source)}: <b>${x.count}</b>`).join(' · ')||'Sin idiomas adicionales para escoger.'}</p>${group('Idiomas estándar · PHB 2014',LANGUAGE_COMMON_2014)}${group('Idiomas exóticos · PHB 2014',LANGUAGE_EXOTIC_2014)}<details><summary>Idiomas adicionales y especiales (requieren aprobación del DM)</summary>${group('Ambientaciones, dialectos y lenguas de clase',LANGUAGE_EXTRA)}<p class="cb2-note">Druídico y jerga de ladrones se conceden por características de clase, no como idiomas comunes de libre elección. Otros idiomas de ambientación requieren autorización del DM.</p></details></section>`;
}
const classSaves={Bárbaro:['FUE','CON'],Bardo:['DES','CAR'],Clérigo:['SAB','CAR'],Druida:['INT','SAB'],Guerrero:['FUE','CON'],Monje:['FUE','DES'],Paladín:['SAB','CAR'],Explorador:['FUE','DES'],Pícaro:['DES','INT'],Hechicero:['CON','CAR'],Brujo:['SAB','CAR'],Mago:['INT','SAB'],Artífice:['CON','INT']};
const escapeText=v=>esc(String(v??''));
const make=()=>({schema:2,name:'',race:{id:'race.phb2014.human.standard',name:'Humano',variant:'Humano estándar',feat:'',featAbility:'',skill:'',asiChoices:['FUE','DES']},classes:[{name:'Guerrero',level:1,sub:'',multiclassSkills:[]}] ,abilities:{method:'array',base:[15,14,13,12,10,8],origin:'phb',bonusChoice:['FUE','DES'],rolls:[]},background:{name:'Acolito',extraSkill:'',replacement:{}},proficiencies:{classSkills:[],knowledgeSkills:[],dmSaves:[]},equipment:{method:'pack',picks:{}},languages:{selected:[]},stage:0});
let model=null;
const total=()=>model.classes.reduce((n,c)=>n+Number(c.level||0),0);
const variantHuman=()=>model.race.id==='race.phb2014.human.variant';
const selectedFeat=()=>DMA_FEATS_190.find(x=>x.name===model.race.feat);
function racialBonuses(){const resolved=racialResolve();let v=resolved?A.map(a=>resolved.abilityIncreases[a]||0):[0,0,0,0,0,0];
 if(model.abilities.origin==='tce'&&racialEntry()?.ability_increases?.mode!=='flexible'){
  const old=v.filter(x=>x>0).sort((a,b)=>b-a),targets=model.abilities.bonusChoice;
  v=[0,0,0,0,0,0];old.forEach((n,i)=>{const a=targets[i];if(A.includes(a)&&!v[A.indexOf(a)])v[A.indexOf(a)]=n;});
 }
 return v;}
function derived(){const bonus=racialBonuses(),feat=selectedFeat(),b=[...model.abilities.base],chosen=model.race.featAbility;const valid=!!(feat&&A.includes(chosen)&&(feat.boost||[]).some(k=>k==='any'||k===({FUE:'str',DES:'dex',CON:'con',INT:'int',SAB:'wis',CAR:'cha'}[chosen])));if(variantHuman()&&valid&&A.includes(chosen))bonus[A.indexOf(chosen)]++;
const abilities=Object.fromEntries(A.map((a,i)=>[a,Math.min(20,b[i]+bonus[i])]));
const racial=racialResolve();const competence=resolveCompetencyLedger(racial);
const profs={};const grants=competence.events;
for(const item of Object.values(competence.ledger))if(item.kind==='skill')profs[item.name]=item.sources.map(x=>x.source);
const saves=new Set([...(classSaves[model.classes[0].name]||[]),...model.proficiencies.dmSaves]);if(model.race.feat==='Resilient'&&A.includes(chosen))saves.add(chosen);
return {abilities,bonus,profs,grants,competence:competence.ledger,saves:[...saves]};}
const opt=(values,selected)=>values.map(x=>`<option value="${escapeText(x)}" ${x===selected?'selected':''}>${escapeText(x)}</option>`).join('');
const picker=(label,key,values,selected)=>`<label>${label}<select data-key="${key}">${opt(values,selected)}</select></label>`;
const abilitySelect=(label,key,sel)=>picker(label,key,A,sel);
 const BACKGROUND_ALIAS={ 'Cloistered Scholar':'Erudito del claustro (SCAG)','Cloistered Scholar (SCAG)':'Erudito del claustro (SCAG)' };
 function backgroundsUnique(){const keys=Object.keys(BG_V120);const selected=[];const seen=new Set();for(const name of keys){const canonical=BACKGROUND_ALIAS[name]&&BG_V120[BACKGROUND_ALIAS[name]]?BACKGROUND_ALIAS[name]:name;if(!seen.has(canonical)){selected.push(canonical);seen.add(canonical);}}return selected;}
 function classChoice(c,i){const min=SUBCLASS_LEVEL_V110[c.name]||3;const subs=Object.values(SUBCLASS_LIBRARY[c.name]||{}).flat();return `<div class="cb2-wide cb2-note"><b>${i===0?'Clase inicial':'Multiclase '+i}</b> ${i?`<button type="button" data-remove-class="${i}">Quitar clase</button>`:''}<div class="cb2-grid">${picker('Clase','classes.'+i+'.name',CLASSES,c.name)}<label>Nivel de clase<input type="number" min="1" max="20" data-key="classes.${i}.level" value="${c.level}"></label>${Number(c.level)>=min?picker('Subclase','classes.'+i+'.sub',['',...subs],c.sub):`<p>Subclase disponible desde nivel ${min} de esta clase.</p>`}</div>${i&&(c.name==='Bardo'||c.name==='Pícaro')?`<p>Multiclase: elige ${c.name==='Bardo'?1:1} habilidad adicional de las opciones de ${c.name==='Bardo'?'cualquier habilidad':'Pícaro'}.</p><div class="cb2-checks">${(c.name==='Bardo'?ALL_SKILLS():(classSkills.Pícaro||[])).map(sk=>`<label><input type="checkbox" data-mc-skill="${i}" value="${escapeText(sk)}" ${(c.multiclassSkills||[]).includes(sk)?'checked':''}>${escapeText(sk)}</label>`).join('')}</div>`:''}</div>`;}
 function mcRequirements(){const a=derived().abilities;const checks={Bárbaro:[['FUE',13]],Bardo:[['CAR',13]],Clérigo:[['SAB',13]],Druida:[['SAB',13]],Guerrero:[['FUE|DES',13]],Monje:[['DES',13],['SAB',13]],Paladín:[['FUE',13],['CAR',13]],Explorador:[['DES',13],['SAB',13]],Pícaro:[['DES',13]],Hechicero:[['CAR',13]],Brujo:[['CAR',13]],Mago:[['INT',13]],Artífice:[['INT',13]]};const failures=[];for(const c of model.classes){for(const [stat,min] of (checks[c.name]||[])){let n=stat.includes('|')?Math.max(...stat.split('|').map(x=>a[x])):a[stat];if(n<min)failures.push(c.name+': requiere '+stat.replace('|',' o ')+' '+min);}}return failures;}


function featPicker(){
 const selected=selectedFeat();
 return `<div class="cb2-feat-picker cb2-wide"><label for="cb2-feat-search">Dote racial (PHB 2014)</label><input id="cb2-feat-search" type="search" placeholder="Buscar dote, por ejemplo Resilient o Alert..." autocomplete="off" aria-controls="cb2-feat-results" aria-label="Buscar dote">${selected?`<p class="cb2-feat-current">✓ Elegida: <strong>${escapeText(selected.name)}</strong> · ${escapeText(selected.summary||'')}</p>`:'<p class="cb2-feat-current">Selecciona una dote de la lista.</p>'}<div id="cb2-feat-results" class="cb2-feat-results" role="group" aria-label="Dotes disponibles">${featButtons('')}</div></div>`;
}
function featButtons(query){
 const q=String(query||'').toLocaleLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
 const feats=DMA_FEATS_190.filter(f=>[f.name,f.summary].join(' ').toLocaleLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').includes(q));
 return feats.length?feats.map(f=>`<button type="button" class="cb2-feat-choice ${model.race.feat===f.name?'chosen':''}" data-feat-choice="${escapeText(f.name)}" aria-pressed="${model.race.feat===f.name}"><b>${escapeText(f.name)}</b><small>${escapeText(f.summary||'Consulta la descripción del dote.')}</small></button>`).join(''):'<p class="cb2-no-feats">No se encontraron dotes.</p>';
}

// Equipo inicial oficial del Artífice (Tasha's Cauldron of Everything, p. 10).
// Fuente única de datos para el selector y para la creación del inventario.
// La elección de armas sencillas concretas queda registrada como pendiente,
// ya que el catálogo actual no ofrece un selector exhaustivo de armas.
// Equipo inicial PHB 2014 y Artífice de Tasha 2020.
// Solo la clase inicial aporta equipo; multiclase concede competencias y rasgos, no estos paquetes.
// Cada bloque de elección contiene alternativas, cada alternativa contiene artículos [nombre,cantidad].
const STARTING_GEAR_2014={
 'Artífice':{choices:[
  [[['Arma sencilla (primera; elegir arma concreta)',1]]],
  [[['Arma sencilla (segunda; elegir arma concreta)',1]]],
  [[['Armadura de cuero tachonado',1]],[['Cota de escamas',1]]]
 ],fixed:[['Ballesta ligera',1],['Virote',20],['Herramientas de ladrón',1],['Paquete de explorador de mazmorras',1]]},
 'Bárbaro':{choices:[[[['Hacha a dos manos',1]],[['Arma marcial cuerpo a cuerpo (elegir)',1]]],[[['Hacha de mano',2]],[['Arma sencilla (elegir)',1]]]],fixed:[['Jabalina',4],['Paquete de explorador',1]]},
 'Bardo':{choices:[[[['Estoque',1]],[['Espada larga',1]],[['Arma sencilla (elegir)',1]]],[[['Paquete de diplomático',1]],[['Paquete de artista',1]]],[[['Laúd',1]],[['Instrumento musical (elegir)',1]]]],fixed:[['Armadura de cuero',1],['Daga',1]]},
 'Clérigo':{choices:[[[['Maza',1]],[['Martillo de guerra (si competente)',1]]],[[['Cota de escamas',1]],[['Armadura de cuero',1]],[['Cota de malla (si competente)',1]]],[[['Ballesta ligera',1],['Virote',20]],[['Arma sencilla (elegir)',1]]],[[['Paquete de sacerdote',1]],[['Paquete de explorador',1]]]],fixed:[['Escudo',1],['Símbolo sagrado',1]]},
 'Druida':{choices:[[[['Escudo de madera',1]],[['Arma sencilla (elegir)',1]]],[[['Cimitarra',1]],[['Arma sencilla cuerpo a cuerpo (elegir)',1]]]],fixed:[['Armadura de cuero',1],['Paquete de explorador',1],['Foco druídico',1]]},
 'Guerrero':{choices:[[[['Cota de malla',1]],[['Armadura de cuero',1],['Arco largo',1],['Flecha',20]]],[[['Arma marcial (elegir)',1],['Escudo',1]],[['Arma marcial (elegir)',2]]],[[['Ballesta ligera',1],['Virote',20]],[['Hacha de mano',2]]],[[['Paquete de aventurero',1]],[['Paquete de explorador',1]]]],fixed:[]},
 'Monje':{choices:[[[['Espada corta',1]],[['Arma sencilla (elegir)',1]]],[[['Paquete de aventurero',1]],[['Paquete de explorador',1]]]],fixed:[['Dardo',10]]},
 'Paladín':{choices:[[[['Arma marcial (elegir)',1],['Escudo',1]],[['Arma marcial (elegir)',2]]],[[['Jabalina',5]],[['Arma sencilla cuerpo a cuerpo (elegir)',1]]],[[['Paquete de sacerdote',1]],[['Paquete de explorador',1]]]],fixed:[['Cota de malla',1],['Símbolo sagrado',1]]},
 'Explorador':{choices:[[[['Cota de escamas',1]],[['Armadura de cuero',1]]],[[['Espada corta',2]],[['Arma sencilla cuerpo a cuerpo (elegir)',2]]],[[['Paquete de aventurero',1]],[['Paquete de explorador',1]]]],fixed:[['Arco largo',1],['Flecha',20]]},
 'Pícaro':{choices:[[[['Estoque',1]],[['Espada corta',1]]],[[['Arco corto',1],['Flecha',20]],[['Espada corta',1]]],[[['Paquete de aventurero',1]],[['Paquete de explorador',1]],[['Paquete de ladrón',1]]]],fixed:[['Armadura de cuero',1],['Daga',2],['Herramientas de ladrón',1]]},
 'Hechicero':{choices:[[[['Ballesta ligera',1],['Virote',20]],[['Arma sencilla (elegir)',1]]],[[['Bolsa de componentes',1]],[['Foco arcano (elegir)',1]]],[[['Paquete de aventurero',1]],[['Paquete de explorador',1]]]],fixed:[['Daga',2]]},
 'Brujo':{choices:[[[['Ballesta ligera',1],['Virote',20]],[['Arma sencilla (elegir)',1]]],[[['Bolsa de componentes',1]],[['Foco arcano (elegir)',1]]],[[['Paquete de erudito',1]],[['Paquete de explorador',1]]]],fixed:[['Armadura de cuero',1],['Arma sencilla (elegir)',1],['Daga',2]]},
 'Mago':{choices:[[[['Bastón',1]],[['Daga',1]]],[[['Bolsa de componentes',1]],[['Foco arcano (elegir)',1]]],[[['Paquete de erudito',1]],[['Paquete de explorador',1]]]],fixed:[['Libro de conjuros',1]]}
};
function creatorStartingGear(className){return STARTING_GEAR_2014[className]||null;}
function gearChoiceLabelV2(choice){
 if(typeof choice==='string')return choice;
 if(!Array.isArray(choice))return String(choice??'Opción sin identificar');
 if(typeof wizGearLabelV130==='function')return wizGearLabelV130(choice);
 return choice.map(item=>Array.isArray(item)?`${item[1]||1} × ${item[0]}`:String(item)).join(' + ');
}
function gearChoicePickerV2(label,key,choices,index){
 return `<label>${label}<select data-key="${key}">${choices.map((choice,i)=>`<option value="${i}" ${i===Number(index||0)?'selected':''}>${escapeText(String.fromCharCode(65+i)+') '+gearChoiceLabelV2(choice))}</option>`).join('')}</select></label>`;
}
// Resolución de elecciones de objetos mediante el catálogo ya cargado en DM.AID.
const GEAR_NAMES_2014={
 'Club':['club','garrote'],'Dagger':['dagger','daga'],'Greatclub':['greatclub','gran garrote'],
 'Handaxe':['handaxe','hacha de mano'],'Javelin':['javelin','jabalina'],
 'Light Hammer':['light hammer','martillo ligero'],'Mace':['mace','maza'],
 'Quarterstaff':['quarterstaff','bastón'],'Sickle':['sickle','hoz'],
 'Spear':['spear','lanza'],'Crossbow, Light':['crossbow, light','ballesta ligera'],
 'Dart':['dart','dardo'],'Shortbow':['shortbow','arco corto'],'Sling':['sling','honda'],
 'Battleaxe':['battleaxe','hacha de batalla'],'Flail':['flail','mangual'],
 'Glaive':['glaive','guja'],'Greataxe':['greataxe','hacha a dos manos'],
 'Greatsword':['greatsword','mandoble'],'Halberd':['halberd','alabarda'],
 'Lance':['lance','lanza de caballería'],'Longsword':['longsword','espada larga'],
 'Maul':['maul','gran martillo'],'Morningstar':['morningstar','lucero del alba'],
 'Pike':['pike','pica'],'Rapier':['rapier','estoque'],'Scimitar':['scimitar','cimitarra'],
 'Shortsword':['shortsword','espada corta'],'Trident':['trident','tridente'],
 'War Pick':['war pick','pico de guerra'],'Warhammer':['warhammer','martillo de guerra'],
 'Whip':['whip','látigo'],'Blowgun':['blowgun','cerbatana'],
 'Crossbow, Hand':['crossbow, hand','ballesta de mano'],'Crossbow, Heavy':['crossbow, heavy','ballesta pesada'],
 'Longbow':['longbow','arco largo'],'Net':['net','red']};
const SIMPLE_MELEE_2014=['Club','Dagger','Greatclub','Handaxe','Javelin','Light Hammer','Mace','Quarterstaff','Sickle','Spear'];
const SIMPLE_RANGED_2014=['Crossbow, Light','Dart','Shortbow','Sling'];
const MARTIAL_MELEE_2014=['Battleaxe','Flail','Glaive','Greataxe','Greatsword','Halberd','Lance','Longsword','Maul','Morningstar','Pike','Rapier','Scimitar','Shortsword','Trident','War Pick','Warhammer','Whip'];
const MARTIAL_RANGED_2014=['Blowgun','Crossbow, Hand','Crossbow, Heavy','Longbow','Net'];
const canonGearName=name=>String(name||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
function creatorCatalogItems(){try{return typeof ITEMS_V18!=='undefined'&&Array.isArray(ITEMS_V18)?ITEMS_V18:[]}catch(e){return [];}}
function gearWeaponKind(text){const n=canonGearName(text);if(!n.includes('elegir')&&!n.includes('eleccion'))return null;
 if(n.includes('arma sencilla cuerpo a cuerpo'))return 'simple-melee';
 if(n.includes('arma sencilla'))return 'simple';
 if(n.includes('arma marcial cuerpo a cuerpo'))return 'martial-melee';
 if(n.includes('arma marcial'))return 'martial';
 return null;
}
function gearChoicesForKind(kind){
 // El índice de armas PHB 2014 forma parte de DM.AID incluso sin importar Objetos.
 // El compendio añade metadatos cuando está disponible; nunca restringe las opciones.
 const keys=kind==='simple-melee'?['simpleMelee']:kind==='simple'?['simpleMelee','simpleRanged']:kind==='martial-melee'?['martialMelee']:['martialMelee','martialRanged'];
 const indexed=(typeof WEAPONS_V153!=='undefined'&&WEAPONS_V153)?keys.flatMap(k=>WEAPONS_V153[k]||[]):[];
 const allowed=kind==='simple-melee'?SIMPLE_MELEE_2014:kind==='simple'?[...SIMPLE_MELEE_2014,...SIMPLE_RANGED_2014]:kind==='martial-melee'?MARTIAL_MELEE_2014:[...MARTIAL_MELEE_2014,...MARTIAL_RANGED_2014];
 const catalog=creatorCatalogItems();
 return allowed.map(canonical=>{
  const labels=GEAR_NAMES_2014[canonical]||[canonical];
  const fromIndex=indexed.find(w=>labels.some(a=>canonGearName(a)===canonGearName(w[0])||canonGearName(a)===canonGearName(w[1])));
  const imported=catalog.find(o=>o?.name&&labels.some(a=>canonGearName(a)===canonGearName(o.name))&& !/2024/.test(String(o.source||'')));
  const display=fromIndex?.[0]||imported?.name||labels.find(l=>l!==canonical)||canonical;
  return {canonical,display,source:imported?.source||'PHB 2014',catalogName:imported?.name||display,damage:fromIndex?.[2]||'',properties:fromIndex?.[3]||'',linked:!!imported};
 });
}
function gearItemSelectionRows(){const g=creatorStartingGear(model.classes[0].name);if(!g)return [];const picked=[];
 function collect(row,slot){if(!Array.isArray(row)||typeof row[0]!=='string')return;
  const [name,quantity=1]=row,kind=gearWeaponKind(name);if(!kind)return;
  for(let i=0;i<Number(quantity);i++)picked.push({slot:slot+':'+i,label:name,kind});
 }
 (g.choices||[]).forEach((choices,i)=>{const current=choices[Number(model.equipment.picks[i]||0)]||[];current.forEach((row,j)=>collect(row,'choice:'+i+':'+j));});
 (g.fixed||[]).forEach((row,j)=>collect(row,'fixed:'+j));
 return picked;
}
function gearCatalogPanel(){const rows=gearItemSelectionRows();if(!rows.length)return '';
 return '<div class="cb2-wide"><h3>Elegir objetos concretos del compendio</h3><p>Selecciona cada arma del índice PHB 2014. Si existe en Objetos, se enlaza automáticamente con su ficha.</p>'+rows.map(r=>{
  const options=gearChoicesForKind(r.kind),saved=model.equipment.itemPicks?.[r.slot]||'';
  return `<label>${escapeText(r.label)}<select data-gear-slot="${escapeText(r.slot)}"><option value="">Selecciona un arma…</option>${options.map(o=>`<option value="${escapeText(o.canonical)}" ${saved===o.canonical?'selected':''}>${escapeText(o.display)} · ${escapeText(o.damage||'')} ${o.linked?'· Compendio':'· PHB 2014'}</option>`).join('')}</select></label>${!options.length?'<p class="cb2-warning">No hay armas compatibles cargadas en el Compendio de objetos. Carga los objetos PHB 2014 antes de continuar.</p>':''}`;
 }).join('')+'</div>';
}
function resolveGearRow(row,slot,picks){if(!Array.isArray(row)||typeof row[0]!=='string')return [row];const [name,quantity=1]=row,kind=gearWeaponKind(name);if(!kind)return [row];
 const result=[];for(let i=0;i<Number(quantity);i++){const chosen=picks[slot+':'+i];const item=gearChoicesForKind(kind).find(x=>x.canonical===chosen);if(!item)throw Error('Arma del catálogo sin seleccionar: '+name);result.push([item.catalogName,1,item.source]);}return result;}
function resolveAllStartingGear(g){const picks=model.equipment.itemPicks||{},entries=[];
 (g?.fixed||[]).forEach((row,j)=>entries.push(...resolveGearRow(row,'fixed:'+j,picks)));
 (g?.choices||[]).forEach((choices,i)=>{const current=choices[Number(model.equipment.picks[i]||0)]||[];current.forEach((row,j)=>entries.push(...resolveGearRow(row,'choice:'+i+':'+j,picks)));});
 return entries;
}
function pendingRacialHTMLV2(){
 const pending=(racialResolve()?.pendingChoices||[]).filter(c=>!(/language|idioma/i.test([c.kind,c.id,c.name,c.label].join(' '))&&languageLedger().remaining===0));
 if(!pending.length)return '<p><b>Decisiones raciales pendientes:</b> ninguna.</p>';
 return `<div class="cb2-note"><b>Decisiones raciales aún sin resolver (${pending.length}):</b><ul>${pending.map(c=>`<li>${escapeText(c.label||c.name||c.kind||c.id||'Elección sin nombre')} <small>${escapeText(c.id||'')}</small></li>`).join('')}</ul><p>Estas decisiones no impiden crear la ficha, pero aún no se conceden automáticamente. Revisa el origen racial antes de confirmar.</p></div>`;
}
function view(){const d=derived(),m=model,cl=m.classes[0];switch(m.stage){
case 0: {let vars=Object.keys(RACE_VARIANTS_V130[m.race.name]||{});if(!vars.length)vars=['Sin subraza'];const feats=DMA_FEATS_190.map(f=>f.name);return `<div class="cb2-grid"><label>Nombre<input data-key="name" value="${escapeText(m.name)}" placeholder="Nombre del héroe"></label>${racePicker()}${variantHuman()?`<div class="cb2-wide"><b>Humano variante · PHB 2014</b><p>Escoge dos atributos distintos (+1 cada uno), una dote y una competencia en habilidad.</p><div class="cb2-grid">${abilitySelect('Primer +1','race.asiChoices.0',m.race.asiChoices[0])}${abilitySelect('Segundo +1','race.asiChoices.1',m.race.asiChoices[1])}${featPicker()}${picker('Competencia racial','race.skill',['',...SKILLS_V110.map(x=>x[0])],m.race.skill)}${(selectedFeat()?.boost?.length)?picker('Dote: atributo elegido','race.featAbility',A.filter(a=>(selectedFeat().boost||[]).some(k=>k==='any'||k===({FUE:'str',DES:'dex',CON:'con',INT:'int',SAB:'wis',CAR:'cha'}[a]))),m.race.featAbility):''}</div></div>`:''}<div class="cb2-wide cb2-note"><b>Registro racial</b><p>${escapeText(m.race.name)} · ${escapeText(m.race.variant)} · bonificaciones raciales: ${d.bonus.map((n,i)=>n?A[i]+' +'+n:'').filter(Boolean).join(', ')||'Aún sin asignar'}</p><p>Los efectos raciales provienen del motor único. Los efectos condicionales no se aplican permanentemente.</p></div>${detailedRacialSummary()}</div>`;}
 case 1:{return `<div class="cb2-grid">${m.classes.map((c,i)=>classChoice(c,i)).join('')}<div class="cb2-wide"><button type="button" data-add-class="1">+ Añadir clase</button><p><b>Nivel total: ${total()} / 20.</b> El bono de competencia depende del nivel total. Los rasgos dependen del nivel de cada clase.</p><p>Las competencias de salvación iniciales provienen solo de la primera clase: ${escapeText((classSaves[cl.name]||[]).join(' y '))}.</p></div><div class="cb2-wide"><b>Competencias de la clase inicial</b><p>Elige ${skillCount[cl.name]||2} habilidades.</p><div class="cb2-checks">${(classSkills[cl.name]||ALL_SKILLS()).map(sk=>`<label><input type="checkbox" data-skill="${escapeText(sk)}" ${m.proficiencies.classSkills.includes(sk)?'checked':''}>${escapeText(sk)}</label>`).join('')}</div></div>${hasKnowledgeDomain()?`<div class="cb2-wide cb2-note"><b>Blessings of Knowledge</b><p>Selecciona dos habilidades distintas; reciben pericia.</p><div class="cb2-checks">${KNOWLEDGE_SKILLS.map(sk=>`<label><input type="checkbox" data-knowledge-skill="${escapeText(sk)}" ${(m.proficiencies.knowledgeSkills||[]).includes(sk)?'checked':''}>${escapeText(sk)}</label>`).join('')}</div></div>`:''}<div class="cb2-wide"><b>Salvaciones adicionales autorizadas por el DM</b><div class="cb2-checks">${A.map(a=>`<label><input type="checkbox" data-save="${a}" ${m.proficiencies.dmSaves.includes(a)?'checked':''}>${a}</label>`).join('')}</div></div></div>`;}
case 2:return `<div>${picker('Método de puntajes','abilities.method',['array','point','manual'],m.abilities.method)}${picker('Origen de bonificaciones','abilities.origin',['phb','tce'],m.abilities.origin)}<div class="cb2-grid">${A.map((a,i)=>`<label>${a} · base<input type="number" min="3" max="20" data-key="abilities.base.${i}" value="${m.abilities.base[i]}"><small>Raza/dote: +${d.bonus[i]} · total: ${d.abilities[a]}</small></label>`).join('')}</div>${m.abilities.origin==='tce'?`<p>Redistribución opcional de Tasha: elige atributos diferentes para conservar la magnitud de los aumentos.</p><div class="cb2-grid">${racialBonusesOriginal().map((v,i)=>abilitySelect('Bono +'+v,'abilities.bonusChoice.'+i,m.abilities.bonusChoice[i]||A[i])).join('')}</div>`:''}</div>`;
case 3:{const bg=BG_V120[m.background.name];const duplicate=(bg?.skills||[]).filter(s=>d.profs[s]?.length>1);return `<div class="cb2-grid">${picker('Trasfondo','background.name',backgroundsUnique(),m.background.name)}<div class="cb2-wide"><b>Competencias de trasfondo</b><p>${escapeText((bg?.skills||[]).join(' · '))}</p><p>Rasgo: ${escapeText(bg?.feature||'Sin datos')}</p><p>Herramientas: ${escapeText(bg?.tools||'Consultar fuente')} · Idiomas adicionales: ${Number(bg?.languages)||0}</p></div>${/Cloistered|Erudito del claustro/i.test(m.background.name)?picker('Competencia adicional (SCAG)','background.extraSkill',['','Arcanos','Naturaleza','Religión'],m.background.extraSkill):''}${duplicate.map(s=>picker('Reemplazar competencia repetida '+s,'background.replacement.'+s,['',...SKILLS_V110.map(x=>x[0]).filter(x=>!d.profs[x])],m.background.replacement[s]||'' )).join('')}</div>`+languagesPanel();}
case 4: {const gear=creatorStartingGear(cl.name),bg=BG_V120[m.background.name];return `<div>${picker('Equipo inicial','equipment.method',['pack','gold'],m.equipment.method)}${m.equipment.method==='pack'?`<p><b>Equipo de la clase inicial:</b> ${escapeText(cl.name)} · <small>Catálogo integrado 13 clases</small></p><p class="cb2-note">Las clases adicionales no conceden su equipo inicial. Sus competencias y rasgos se calculan por separado.</p>${(gear?.choices||[]).map((choices,i)=>gearChoicePickerV2('Elección de equipo '+(i+1),'equipment.picks.'+i,choices,m.equipment.picks[i])).join('')}${gearCatalogPanel()}<p>Equipo fijo de clase: ${escapeText((gear?.fixed||[]).map(x=>Array.isArray(x)?x[0]:x).join(', ')||'Consultar libro')}</p><p><b>Trasfondo:</b> ${escapeText(bg?.gear||'No disponible')}</p>`:'<p>Comprar equipamiento con el oro inicial de la clase, de acuerdo con la campaña.</p>'}<div class="cb2-note">Las elecciones de equipo se conservan en el registro. Las piezas que no puedan identificarse con certeza quedan pendientes de elección antes de equiparse.</div></div>`;}
default:return `<div><h3>Revisión final</h3><p>${escapeText(m.name)} · ${escapeText(m.race.name)} ${escapeText(m.race.variant)}</p><p>${m.classes.map(c=>escapeText(c.name)+' '+c.level+(c.sub?' · '+escapeText(c.sub):'')).join(' / ')} · Nivel total ${total()} · ${escapeText(m.background.name)}</p><p>Salvaciones: ${d.saves.map(escapeText).join(', ')}</p><p>Competencias: ${Object.entries(d.profs).map(([k,v])=>escapeText(k)+' ['+(d.competence['skill:'+k]?.rank==='expertise'?'PERICIA':'Competencia')+'] ('+v.map(escapeText).join('; ')+')').join(', ')||'Ninguna asignada'}</p><p>Puntajes: ${A.map(a=>a+' '+d.abilities[a]).join(' · ')}</p><p><b>Idiomas (${languageLedger().all.length}):</b> ${languageLedger().all.map(escapeText).join(', ')}</p>${pendingRacialHTMLV2()}<p><b>Confirmación:</b> se creará una hoja compatible y se guardará el registro original en <code>sheet.creationV2</code>.</p></div>`;}}
function racialBonusesOriginal(){if(racialEntry()?.ability_increases?.mode==='flexible')return [2,1];const vals=RACE_VARIANTS_V130[model.race.name]?.[model.race.variant]||RACE_BONUSES_V130[model.race.name]?.bon||[0,0,0,0,0,0];return variantHuman()?[1,1]:vals.filter(x=>x>0);}
function assign(key,value){const parts=key.split('.');let obj=model;for(const p of parts.slice(0,-1))obj=obj[p];const last=parts.at(-1);obj[last]=['classes.0.level',...A.map((_,i)=>'abilities.base.'+i)].includes(key)?Number(value):value;if(key==='race.name'){model.race.variant=Object.keys(RACE_VARIANTS_V130[value]||{})[0]||'Sin subraza';model.race.skill='';model.race.feat='';}if(/^classes\.\d+\.level$/.test(key))obj[last]=Number(value);if(/^classes\.\d+\.name$/.test(key)){obj.sub='';obj.multiclassSkills=[];if(key==='classes.0.name')model.proficiencies.classSkills=[];model.proficiencies.knowledgeSkills=[];}if(/^classes\.\d+\.sub$/.test(key))model.proficiencies.knowledgeSkills=[];if(key==='race.feat')model.race.featAbility='';if(key==='equipment.method'||key.startsWith('equipment.picks.'))model.equipment.itemPicks={};if(key==='background.name'){model.background.replacement={};model.languages={selected:[]};}render();}
function onEvent(e){if(!model)return;const t=e.target;if(t.dataset.gearSlot){model.equipment.itemPicks=model.equipment.itemPicks||{};model.equipment.itemPicks[t.dataset.gearSlot]=t.value;return;}if(t.dataset.language){chooseLanguage(t.dataset.language,t.checked);return;}if(t.dataset.raceRoot){const children=racialEntries().filter(x=>x.parent_id===t.value);pickRaceId(children[0]?.id||t.value);return;}if(t.dataset.raceId){pickRaceId(t.value);return;}if(t.dataset.mcSkill){const i=Number(t.dataset.mcSkill),c=model.classes[i];if(!c)return;const old=c.multiclassSkills||[];c.multiclassSkills=t.checked?[...new Set([...old,t.value])]:old.filter(x=>x!==t.value);render();return;}if(t.dataset.knowledgeSkill){const arr=model.proficiencies.knowledgeSkills;model.proficiencies.knowledgeSkills=t.checked?[...new Set([...arr,t.dataset.knowledgeSkill])]:arr.filter(x=>x!==t.dataset.knowledgeSkill);render();return;}if(t.dataset.skill){const arr=model.proficiencies.classSkills;model.proficiencies.classSkills=t.checked?[...new Set([...arr,t.dataset.skill])]:arr.filter(x=>x!==t.dataset.skill);return;}if(t.dataset.save){const arr=model.proficiencies.dmSaves;model.proficiencies.dmSaves=t.checked?[...new Set([...arr,t.dataset.save])]:arr.filter(x=>x!==t.dataset.save);return;}if(t.dataset.key){assign(t.dataset.key,t.value);}}
function validate(){const m=model,cl=m.classes[0];if(m.stage===0){const racial=racialResolve();if(!racial)return 'No se ha podido cargar la biblioteca racial.';if(racial.errors.length)return racial.errors.map(e=>e.message).join('; ');if(!m.name.trim())return 'Escribe el nombre del personaje.';if(variantHuman()){if(new Set(m.race.asiChoices).size!==2)return 'El humano variante debe elegir dos atributos diferentes.';if(!m.race.feat||!m.race.skill)return 'Selecciona una dote y una competencia para el humano variante.';if(selectedFeat()?.boost?.length&&!A.includes(m.race.featAbility))return 'Esta dote requiere elegir un atributo.';}}if(m.stage===1){if(total()>20||total()<1)return 'El total de niveles debe estar entre 1 y 20.';if(new Set(m.classes.map(c=>c.name)).size!==m.classes.length)return 'No repitas una clase; aumenta sus niveles en una única fila.';for(const c of m.classes){if(c.level<1||c.level>20)return 'Cada clase debe tener entre 1 y 20 niveles.';if(c.level>=(SUBCLASS_LEVEL_V110[c.name]||3)&&!c.sub)return 'Selecciona la subclase de '+c.name+'.';if(c.name==='Bardo'&&c!==m.classes[0]&&(c.multiclassSkills||[]).length!==1)return 'Selecciona una habilidad adicional por multiclase de Bardo.';if(c.name==='Pícaro'&&c!==m.classes[0]&&(c.multiclassSkills||[]).length!==1)return 'Selecciona una habilidad adicional por multiclase de Pícaro.';}if(hasKnowledgeDomain()&&((m.proficiencies.knowledgeSkills||[]).length!==2))return 'Blessings of Knowledge requiere elegir exactamente dos habilidades.';if(cl.level<1||cl.level>20)return 'El nivel debe estar entre 1 y 20.';if(m.proficiencies.classSkills.length!==(skillCount[cl.name]||2))return 'Elige la cantidad correcta de competencias de clase.';}if(m.stage===2){if(m.classes.length>1&&mcRequirements().length)return mcRequirements().join('; ');const base=m.abilities.base;if(base.some(x=>!Number.isInteger(x)||x<3||x>20))return 'Los puntajes base deben estar entre 3 y 20.';if(m.abilities.method==='array'&&[...base].sort((a,b)=>a-b).join(',')!=='8,10,12,13,14,15')return 'La matriz estándar utiliza 15,14,13,12,10,8 una sola vez.';if(m.abilities.method==='point'&&(base.some(x=>x<8||x>15)||base.reduce((n,x)=>n+({8:0,9:1,10:2,11:3,12:4,13:5,14:7,15:9}[x]||0),0)>27))return 'La compra por puntos permite un máximo de 27.';if(m.abilities.origin==='tce'&&racialEntry()?.ability_increases?.mode!=='flexible'){const choices=m.abilities.bonusChoice.slice(0,racialBonusesOriginal().length);if(new Set(choices).size!==choices.length)return 'La redistribución de Tasha requiere atributos diferentes.';}}if(m.stage===4&&m.equipment.method==='pack'){for(const row of gearItemSelectionRows()){if(!gearChoicesForKind(row.kind).some(o=>o.canonical===(m.equipment.itemPicks||{})[row.slot]))return 'Selecciona '+row.label+' desde el compendio de objetos cargado.';}}if(m.stage===3){const lang=languageLedger();if(lang.remaining)return 'Debes seleccionar '+lang.remaining+' idioma(s) adicional(es) en el panel de idiomas del trasfondo.';const bg=BG_V120[m.background.name];if(/Cloistered|Erudito del claustro/i.test(m.background.name)&&!m.background.extraSkill)return 'Elige la habilidad adicional del erudito del claustro.';for(const s of bg?.skills||[]){if(derived().profs[s]?.length>1&&!m.background.replacement[s])return 'Reemplaza la competencia duplicada: '+s;}}return ''}
function showError(message){document.getElementById('cb2-error').textContent=message;}
function hp(){const con=Math.floor((derived().abilities.CON-10)/2);let sum=0;model.classes.forEach((cl,i)=>{const die=HIT_DICE_V120[cl.name]||8;const n=Number(cl.level);sum+=(i===0?die+con:Math.floor(die/2)+1+con)+(n-(i===0?1:1))*Math.max(1,Math.floor(die/2)+1+con);});return Math.max(1,sum);}
function finish(){const d=derived(),m=model,cl=m.classes[0],hpmax=hp(),skills={};for(const k of Object.keys(d.profs))skills[k]=d.competence['skill:'+k]?.rank==='expertise'?'expert':'prof';const feat=m.race.feat;const feats=variantHuman()&&feat?[{name:feat,source:'Humano variante · PHB 2014',chosenAbility:m.race.featAbility||null}]:[];const dex=Math.floor((d.abilities.DES-10)/2);let ac=10+dex;const racial=racialResolve();const sheet={race:m.race.name,raceVariantV130:m.race.variant,classes:structuredClone(m.classes),abilities:d.abilities,abilityBaseV110:[...m.abilities.base],racialBonusV110:[...d.bonus],skillProficienciesV110:skills,dmSaveProfs11716:[...m.proficiencies.dmSaves],featsV190:feats,languagesV2:languageLedger().all,languageGrantsV2:languageLedger().allocations,backgroundLanguagesV120:languageLedger().selected.join(', '),background:m.background.name,backgroundFeatureV120:BG_V120[m.background.name]?.feature||'',ac,initiativeMod:dex+(feat==='Alert'?5:0),slots:null,used:Array(9).fill(0),pactUsed:0,inventory:[],creationV2:{...structuredClone(m),racialSourceId:m.race.id,racialResult:structuredClone(racial),resolved:{abilityScores:d.abilities,savingThrows:d.saves,skillGrants:d.grants,competencyLedger:d.competence,languages:languageLedger(),appliedSources:[m.race.name,...m.classes.map(c=>c.name),m.background.name]}}};
 if(feat==='Resilient'&&m.race.featAbility)sheet.dmSaveProfs11716=[...new Set([...sheet.dmSaveProfs11716,m.race.featAbility])];
 if(feat==='Alert')sheet.featBonusesV190={initiative:5};
 // Persist equipment choices in canonical record. Resolve only concrete inventory rows.
 if(m.equipment.method==='pack'){const g=creatorStartingGear(cl.name),entries=resolveAllStartingGear(g);entries.push(...(BG_GEAR_V130[m.background.name]||[]));const items=[];for(const x of entries){if(typeof wizFlattenGearV130==='function')for(const row of wizFlattenGearV130(x))items.push({...row,equipped:false,source: (Array.isArray(x)&&x[2])||'Equipo inicial 2014'});}sheet.inventory=items;}
 const i=state.players.length;state.players.push({name:m.name.trim(),hp:hpmax,max:hpmax,temp:0,sheet});state.initiative['p'+i]={roll:null,included:true};save();close();render();renderSheets();}
function next(){const error=validate();if(error){showError(error);return;}if(model.stage===5){finish();return;}model.stage++;render();}
function back(){if(model.stage>0){model.stage--;render();}}
function close(){const dlg=document.getElementById('cb2-dialog');if(dlg?.open)dlg.close();model=null;}
function render(){const host=document.getElementById('cb2-body');if(!host||!model)return;document.getElementById('cb2-step').textContent=`Paso ${model.stage+1} de 6 · ${['Raza y subraza','Clase y nivel','Características','Trasfondo','Equipo','Revisión'][model.stage]}`;host.innerHTML=view();document.getElementById('cb2-error').textContent='';document.getElementById('cb2-back').disabled=model.stage===0;document.getElementById('cb2-next').textContent=model.stage===5?'Crear personaje':'Continuar →';}
function open(){const dlg=document.getElementById('cb2-dialog');loadRacialLibrary().then(()=>{model=make();dlg.showModal();render();}).catch(e=>{alert('No se pudo cargar la biblioteca racial V7. Comprueba que los archivos estén publicados juntos. Detalle: '+e.message);});}
const old=openCharacterWizardV110;
openCharacterWizardV110=function(){open()};
const node=document.createElement('dialog');node.id='cb2-dialog';node.className='cb2-dialog';node.innerHTML=`<div class="cb2-head"><h2>🛡️ Nuevo creador de personajes</h2><button id="cb2-close">✕ Cerrar</button></div><p class="cb2-progress" id="cb2-step"></p><div id="cb2-body"></div><p id="cb2-error" role="alert"></p><div class="cb2-actions"><button id="cb2-back">← Anterior</button><button class="gold" id="cb2-next">Continuar →</button></div>`;
document.body.append(node);node.addEventListener('click',e=>{if(e.target.closest('[data-add-class]')){if(total()>=20)return showError('El nivel total máximo es 20.');const next=CLASSES.find(name=>!model.classes.some(c=>c.name===name));if(next)model.classes.push({name:next,level:1,sub:'',multiclassSkills:[]});render();return;}const del=e.target.closest('[data-remove-class]');if(del){model.classes.splice(Number(del.dataset.removeClass),1);render();return;}const button=e.target.closest('[data-feat-choice]');if(!button||!model)return;assign('race.feat',button.dataset.featChoice);});node.addEventListener('input',e=>{if(e.target.id==='cb2-feat-search'){const results=document.getElementById('cb2-feat-results');if(results)results.innerHTML=featButtons(e.target.value);}});node.addEventListener('change',onEvent);node.addEventListener('input',e=>{if(e.target.dataset.key==='name')model.name=e.target.value});node.querySelector('#cb2-close').onclick=close;node.querySelector('#cb2-back').onclick=back;node.querySelector('#cb2-next').onclick=next;node.addEventListener('cancel',()=>{model=null});
window.DMACharacterBuilderV2={open,resolveLanguages:()=>model?languageLedger():null,getDraft:()=>model?structuredClone(model):null,resolveRace:()=>racialResolve(),loadRaces:loadRacialLibrary};
})();
