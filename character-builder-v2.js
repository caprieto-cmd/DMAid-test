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
function hasKnowledgeDomain(){return model.classes[0]?.name==='Clérigo' && /knowledge|conocimiento/i.test(model.classes[0]?.sub||'') && Number(model.classes[0]?.level)>=1;}
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
 model.proficiencies.classSkills.forEach(x=>award('skill',x,'Clase: '+model.classes[0].name));
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
 if(model.classes[0]?.name==='Druida')fixed.push({name:'Druídico',source:'Clase: Druida'});
 if(model.classes[0]?.name==='Pícaro')fixed.push({name:'Jerga de ladrones',source:'Clase: Pícaro'});
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
const make=()=>({schema:2,name:'',race:{id:'race.phb2014.human.standard',name:'Humano',variant:'Humano estándar',feat:'',featAbility:'',skill:'',asiChoices:['FUE','DES']},classes:[{name:'Guerrero',level:1,sub:''}],abilities:{method:'array',base:[15,14,13,12,10,8],origin:'phb',bonusChoice:['FUE','DES'],rolls:[]},background:{name:'Acolito',extraSkill:'',replacement:{}},proficiencies:{classSkills:[],knowledgeSkills:[],dmSaves:[]},equipment:{method:'pack',picks:{}},languages:{selected:[]},stage:0});
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

function featPicker(){
 const selected=selectedFeat();
 return `<div class="cb2-feat-picker cb2-wide"><label for="cb2-feat-search">Dote racial (PHB 2014)</label><input id="cb2-feat-search" type="search" placeholder="Buscar dote, por ejemplo Resilient o Alert..." autocomplete="off" aria-controls="cb2-feat-results" aria-label="Buscar dote">${selected?`<p class="cb2-feat-current">✓ Elegida: <strong>${escapeText(selected.name)}</strong> · ${escapeText(selected.summary||'')}</p>`:'<p class="cb2-feat-current">Selecciona una dote de la lista.</p>'}<div id="cb2-feat-results" class="cb2-feat-results" role="group" aria-label="Dotes disponibles">${featButtons('')}</div></div>`;
}
function featButtons(query){
 const q=String(query||'').toLocaleLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
 const feats=DMA_FEATS_190.filter(f=>[f.name,f.summary].join(' ').toLocaleLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').includes(q));
 return feats.length?feats.map(f=>`<button type="button" class="cb2-feat-choice ${model.race.feat===f.name?'chosen':''}" data-feat-choice="${escapeText(f.name)}" aria-pressed="${model.race.feat===f.name}"><b>${escapeText(f.name)}</b><small>${escapeText(f.summary||'Consulta la descripción del dote.')}</small></button>`).join(''):'<p class="cb2-no-feats">No se encontraron dotes.</p>';
}

function gearChoiceLabelV2(choice){
 if(typeof choice==='string')return choice;
 if(!Array.isArray(choice))return String(choice??'Opción sin identificar');
 if(typeof wizGearLabelV130==='function')return wizGearLabelV130(choice);
 return choice.map(item=>Array.isArray(item)?`${item[1]||1} × ${item[0]}`:String(item)).join(' + ');
}
function gearChoicePickerV2(label,key,choices,index){
 return `<label>${label}<select data-key="${key}">${choices.map((choice,i)=>`<option value="${i}" ${i===Number(index||0)?'selected':''}>${escapeText(String.fromCharCode(65+i)+') '+gearChoiceLabelV2(choice))}</option>`).join('')}</select></label>`;
}
function pendingRacialHTMLV2(){
 const pending=(racialResolve()?.pendingChoices||[]).filter(c=>!(/language|idioma/i.test([c.kind,c.id,c.name,c.label].join(' '))&&languageLedger().remaining===0));
 if(!pending.length)return '<p><b>Decisiones raciales pendientes:</b> ninguna.</p>';
 return `<div class="cb2-note"><b>Decisiones raciales aún sin resolver (${pending.length}):</b><ul>${pending.map(c=>`<li>${escapeText(c.label||c.name||c.kind||c.id||'Elección sin nombre')} <small>${escapeText(c.id||'')}</small></li>`).join('')}</ul><p>Estas decisiones no impiden crear la ficha, pero aún no se conceden automáticamente. Revisa el origen racial antes de confirmar.</p></div>`;
}
function view(){const d=derived(),m=model,cl=m.classes[0];switch(m.stage){
case 0: {let vars=Object.keys(RACE_VARIANTS_V130[m.race.name]||{});if(!vars.length)vars=['Sin subraza'];const feats=DMA_FEATS_190.map(f=>f.name);return `<div class="cb2-grid"><label>Nombre<input data-key="name" value="${escapeText(m.name)}" placeholder="Nombre del héroe"></label>${racePicker()}${variantHuman()?`<div class="cb2-wide"><b>Humano variante · PHB 2014</b><p>Escoge dos atributos distintos (+1 cada uno), una dote y una competencia en habilidad.</p><div class="cb2-grid">${abilitySelect('Primer +1','race.asiChoices.0',m.race.asiChoices[0])}${abilitySelect('Segundo +1','race.asiChoices.1',m.race.asiChoices[1])}${featPicker()}${picker('Competencia racial','race.skill',['',...SKILLS_V110.map(x=>x[0])],m.race.skill)}${(selectedFeat()?.boost?.length)?picker('Dote: atributo elegido','race.featAbility',A.filter(a=>(selectedFeat().boost||[]).some(k=>k==='any'||k===({FUE:'str',DES:'dex',CON:'con',INT:'int',SAB:'wis',CAR:'cha'}[a]))),m.race.featAbility):''}</div></div>`:''}<div class="cb2-wide cb2-note"><b>Registro racial</b><p>${escapeText(m.race.name)} · ${escapeText(m.race.variant)} · bonificaciones raciales: ${d.bonus.map((n,i)=>n?A[i]+' +'+n:'').filter(Boolean).join(', ')||'Aún sin asignar'}</p><p>Los efectos raciales provienen del motor único. Los efectos condicionales no se aplican permanentemente.</p></div>${detailedRacialSummary()}</div>`;}
case 1:{const subOptions=Object.values(SUBCLASS_LIBRARY[cl.name]||{}).flat(),levelMin=SUBCLASS_LEVEL_V110[cl.name]||3;return `<div class="cb2-grid">${picker('Clase principal','classes.0.name',CLASSES,cl.name)}<label>Nivel de clase<input type="number" min="1" max="20" data-key="classes.0.level" value="${cl.level}"></label>${cl.level>=levelMin?picker('Subclase','classes.0.sub',['',...subOptions],cl.sub):`<p>Subclase disponible desde nivel ${levelMin}.</p>`}<div class="cb2-wide"><b>Competencias de clase</b><p>Salvaciones: ${escapeText((classSaves[cl.name]||[]).join(' y '))}</p><p>Selecciona ${skillCount[cl.name]||2} habilidades de clase. Se identifican por su origen y no consumen competencias raciales.</p><div class="cb2-checks">${(classSkills[cl.name]||SKILLS_V110.map(x=>x[0])).map(s=>`<label><input type="checkbox" data-skill="${escapeText(s)}" ${m.proficiencies.classSkills.includes(s)?'checked':''}> ${escapeText(s)}</label>`).join('')}</div></div>${hasKnowledgeDomain()?`<div class="cb2-wide cb2-note"><b>Blessings of Knowledge · Dominio del Conocimiento</b><p>Elige dos habilidades distintas: reciben competencia y pericia (doble bonificador).</p><div class="cb2-checks">${KNOWLEDGE_SKILLS.map(s=>`<label><input type="checkbox" data-knowledge-skill="${escapeText(s)}" ${(m.proficiencies.knowledgeSkills||[]).includes(s)?'checked':''}> ${escapeText(s)}</label>`).join('')}</div></div>`:''}<div class="cb2-wide"><b>Competencias adicionales concedidas por el DM</b><div class="cb2-checks">${A.map(a=>`<label><input type="checkbox" data-save="${a}" ${m.proficiencies.dmSaves.includes(a)?'checked':''}> ${a}</label>`).join('')}</div></div><p class="cb2-wide">Los rasgos se consultarán según el nivel elegido. Esta primera versión conserva la clase y subclase con sus identificadores oficiales del catálogo.</p></div>`;}
case 2:return `<div>${picker('Método de puntajes','abilities.method',['array','point','manual'],m.abilities.method)}${picker('Origen de bonificaciones','abilities.origin',['phb','tce'],m.abilities.origin)}<div class="cb2-grid">${A.map((a,i)=>`<label>${a} · base<input type="number" min="3" max="20" data-key="abilities.base.${i}" value="${m.abilities.base[i]}"><small>Raza/dote: +${d.bonus[i]} · total: ${d.abilities[a]}</small></label>`).join('')}</div>${m.abilities.origin==='tce'?`<p>Redistribución opcional de Tasha: elige atributos diferentes para conservar la magnitud de los aumentos.</p><div class="cb2-grid">${racialBonusesOriginal().map((v,i)=>abilitySelect('Bono +'+v,'abilities.bonusChoice.'+i,m.abilities.bonusChoice[i]||A[i])).join('')}</div>`:''}</div>`;
case 3:{const bg=BG_V120[m.background.name];const duplicate=(bg?.skills||[]).filter(s=>d.profs[s]?.length>1);return `<div class="cb2-grid">${picker('Trasfondo','background.name',Object.keys(BG_V120),m.background.name)}<div class="cb2-wide"><b>Competencias de trasfondo</b><p>${escapeText((bg?.skills||[]).join(' · '))}</p><p>Rasgo: ${escapeText(bg?.feature||'Sin datos')}</p><p>Herramientas: ${escapeText(bg?.tools||'Consultar fuente')} · Idiomas adicionales: ${Number(bg?.languages)||0}</p></div>${/Cloistered|Erudito del claustro/i.test(m.background.name)?picker('Competencia adicional (SCAG)','background.extraSkill',['','Arcanos','Naturaleza','Religión'],m.background.extraSkill):''}${duplicate.map(s=>picker('Reemplazar competencia repetida '+s,'background.replacement.'+s,['',...SKILLS_V110.map(x=>x[0]).filter(x=>!d.profs[x])],m.background.replacement[s]||'' )).join('')}</div>`+languagesPanel();}
case 4: {const gear=GEAR_V130[cl.name],bg=BG_V120[m.background.name];return `<div>${picker('Equipo inicial','equipment.method',['pack','gold'],m.equipment.method)}${m.equipment.method==='pack'?`<p><b>Clase:</b> ${escapeText(cl.name)}</p>${(gear?.choices||[]).map((choices,i)=>gearChoicePickerV2('Elección de equipo '+(i+1),'equipment.picks.'+i,choices,m.equipment.picks[i])).join('')}<p>Equipo fijo de clase: ${escapeText((gear?.fixed||[]).map(x=>Array.isArray(x)?x[0]:x).join(', ')||'Consultar libro')}</p><p><b>Trasfondo:</b> ${escapeText(bg?.gear||'No disponible')}</p>`:'<p>Comprar equipamiento con el oro inicial de la clase, de acuerdo con la campaña.</p>'}<div class="cb2-note">Las elecciones de equipo se conservan en el registro. Las piezas que no puedan identificarse con certeza quedan pendientes de elección antes de equiparse.</div></div>`;}
default:return `<div><h3>Revisión final</h3><p>${escapeText(m.name)} · ${escapeText(m.race.name)} ${escapeText(m.race.variant)}</p><p>${escapeText(cl.name)} ${cl.level}${cl.sub?' · '+escapeText(cl.sub):''} · ${escapeText(m.background.name)}</p><p>Salvaciones: ${d.saves.map(escapeText).join(', ')}</p><p>Competencias: ${Object.entries(d.profs).map(([k,v])=>escapeText(k)+' ['+(d.competence['skill:'+k]?.rank==='expertise'?'PERICIA':'Competencia')+'] ('+v.map(escapeText).join('; ')+')').join(', ')||'Ninguna asignada'}</p><p>Puntajes: ${A.map(a=>a+' '+d.abilities[a]).join(' · ')}</p><p><b>Idiomas (${languageLedger().all.length}):</b> ${languageLedger().all.map(escapeText).join(', ')}</p>${pendingRacialHTMLV2()}<p><b>Confirmación:</b> se creará una hoja compatible y se guardará el registro original en <code>sheet.creationV2</code>.</p></div>`;}}
function racialBonusesOriginal(){if(racialEntry()?.ability_increases?.mode==='flexible')return [2,1];const vals=RACE_VARIANTS_V130[model.race.name]?.[model.race.variant]||RACE_BONUSES_V130[model.race.name]?.bon||[0,0,0,0,0,0];return variantHuman()?[1,1]:vals.filter(x=>x>0);}
function assign(key,value){const parts=key.split('.');let obj=model;for(const p of parts.slice(0,-1))obj=obj[p];const last=parts.at(-1);obj[last]=['classes.0.level',...A.map((_,i)=>'abilities.base.'+i)].includes(key)?Number(value):value;if(key==='race.name'){model.race.variant=Object.keys(RACE_VARIANTS_V130[value]||{})[0]||'Sin subraza';model.race.skill='';model.race.feat='';}if(key==='classes.0.name'){model.classes[0].sub='';model.proficiencies.classSkills=[];model.proficiencies.knowledgeSkills=[];}if(key==='classes.0.sub')model.proficiencies.knowledgeSkills=[];if(key==='race.feat')model.race.featAbility='';if(key==='background.name'){model.background.replacement={};model.languages={selected:[]};}render();}
function onEvent(e){if(!model)return;const t=e.target;if(t.dataset.language){chooseLanguage(t.dataset.language,t.checked);return;}if(t.dataset.raceRoot){const children=racialEntries().filter(x=>x.parent_id===t.value);pickRaceId(children[0]?.id||t.value);return;}if(t.dataset.raceId){pickRaceId(t.value);return;}if(t.dataset.knowledgeSkill){const arr=model.proficiencies.knowledgeSkills;model.proficiencies.knowledgeSkills=t.checked?[...new Set([...arr,t.dataset.knowledgeSkill])]:arr.filter(x=>x!==t.dataset.knowledgeSkill);render();return;}if(t.dataset.skill){const arr=model.proficiencies.classSkills;model.proficiencies.classSkills=t.checked?[...new Set([...arr,t.dataset.skill])]:arr.filter(x=>x!==t.dataset.skill);return;}if(t.dataset.save){const arr=model.proficiencies.dmSaves;model.proficiencies.dmSaves=t.checked?[...new Set([...arr,t.dataset.save])]:arr.filter(x=>x!==t.dataset.save);return;}if(t.dataset.key){assign(t.dataset.key,t.value);}}
function validate(){const m=model,cl=m.classes[0];if(m.stage===0){const racial=racialResolve();if(!racial)return 'No se ha podido cargar la biblioteca racial.';if(racial.errors.length)return racial.errors.map(e=>e.message).join('; ');if(!m.name.trim())return 'Escribe el nombre del personaje.';if(variantHuman()){if(new Set(m.race.asiChoices).size!==2)return 'El humano variante debe elegir dos atributos diferentes.';if(!m.race.feat||!m.race.skill)return 'Selecciona una dote y una competencia para el humano variante.';if(selectedFeat()?.boost?.length&&!A.includes(m.race.featAbility))return 'Esta dote requiere elegir un atributo.';}}if(m.stage===1){if(hasKnowledgeDomain()&&((m.proficiencies.knowledgeSkills||[]).length!==2))return 'Blessings of Knowledge requiere elegir exactamente dos habilidades.';if(cl.level<1||cl.level>20)return 'El nivel debe estar entre 1 y 20.';if(m.proficiencies.classSkills.length!==(skillCount[cl.name]||2))return 'Elige la cantidad correcta de competencias de clase.';if(cl.level>=(SUBCLASS_LEVEL_V110[cl.name]||3)&&!cl.sub)return 'Selecciona la subclase correspondiente.';}if(m.stage===2){const base=m.abilities.base;if(base.some(x=>!Number.isInteger(x)||x<3||x>20))return 'Los puntajes base deben estar entre 3 y 20.';if(m.abilities.method==='array'&&[...base].sort((a,b)=>a-b).join(',')!=='8,10,12,13,14,15')return 'La matriz estándar utiliza 15,14,13,12,10,8 una sola vez.';if(m.abilities.method==='point'&&(base.some(x=>x<8||x>15)||base.reduce((n,x)=>n+({8:0,9:1,10:2,11:3,12:4,13:5,14:7,15:9}[x]||0),0)>27))return 'La compra por puntos permite un máximo de 27.';if(m.abilities.origin==='tce'&&racialEntry()?.ability_increases?.mode!=='flexible'){const choices=m.abilities.bonusChoice.slice(0,racialBonusesOriginal().length);if(new Set(choices).size!==choices.length)return 'La redistribución de Tasha requiere atributos diferentes.';}}if(m.stage===3){const lang=languageLedger();if(lang.remaining)return 'Debes seleccionar '+lang.remaining+' idioma(s) adicional(es) en el panel de idiomas del trasfondo.';const bg=BG_V120[m.background.name];if(/Cloistered|Erudito del claustro/i.test(m.background.name)&&!m.background.extraSkill)return 'Elige la habilidad adicional del erudito del claustro.';for(const s of bg?.skills||[]){if(derived().profs[s]?.length>1&&!m.background.replacement[s])return 'Reemplaza la competencia duplicada: '+s;}}return ''}
function showError(message){document.getElementById('cb2-error').textContent=message;}
function hp(){const cl=model.classes[0],die=HIT_DICE_V120[cl.name]||8,n=Number(cl.level),con=Math.floor((derived().abilities.CON-10)/2);return Math.max(1,die+con)+Math.max(0,n-1)*Math.max(1,Math.floor(die/2)+1+con);}
function finish(){const d=derived(),m=model,cl=m.classes[0],hpmax=hp(),skills={};for(const k of Object.keys(d.profs))skills[k]=d.competence['skill:'+k]?.rank==='expertise'?'expert':'prof';const feat=m.race.feat;const feats=variantHuman()&&feat?[{name:feat,source:'Humano variante · PHB 2014',chosenAbility:m.race.featAbility||null}]:[];const dex=Math.floor((d.abilities.DES-10)/2);let ac=10+dex;const racial=racialResolve();const sheet={race:m.race.name,raceVariantV130:m.race.variant,classes:structuredClone(m.classes),abilities:d.abilities,abilityBaseV110:[...m.abilities.base],racialBonusV110:[...d.bonus],skillProficienciesV110:skills,dmSaveProfs11716:[...m.proficiencies.dmSaves],featsV190:feats,languagesV2:languageLedger().all,languageGrantsV2:languageLedger().allocations,backgroundLanguagesV120:languageLedger().selected.join(', '),background:m.background.name,backgroundFeatureV120:BG_V120[m.background.name]?.feature||'',ac,initiativeMod:dex+(feat==='Alert'?5:0),slots:null,used:Array(9).fill(0),pactUsed:0,inventory:[],creationV2:{...structuredClone(m),racialSourceId:m.race.id,racialResult:structuredClone(racial),resolved:{abilityScores:d.abilities,savingThrows:d.saves,skillGrants:d.grants,competencyLedger:d.competence,languages:languageLedger(),appliedSources:[m.race.name,cl.name,m.background.name]}}};
 if(feat==='Resilient'&&m.race.featAbility)sheet.dmSaveProfs11716=[...new Set([...sheet.dmSaveProfs11716,m.race.featAbility])];
 if(feat==='Alert')sheet.featBonusesV190={initiative:5};
 // Persist equipment choices in canonical record. Resolve only concrete inventory rows.
 if(m.equipment.method==='pack'){const g=GEAR_V130[cl.name],entries=[...(g?.fixed||[])];(g?.choices||[]).forEach((choices,i)=>entries.push(...(choices[Number(m.equipment.picks[i]||0)]||[])));entries.push(...(BG_GEAR_V130[m.background.name]||[]));const items=[];for(const x of entries){if(typeof wizFlattenGearV130==='function')for(const row of wizFlattenGearV130(x))items.push({...row,equipped:false,source:'Equipo inicial 2014'});}sheet.inventory=items;}
 const i=state.players.length;state.players.push({name:m.name.trim(),hp:hpmax,max:hpmax,temp:0,sheet});state.initiative['p'+i]={roll:null,included:true};save();close();render();renderSheets();}
function next(){const error=validate();if(error){showError(error);return;}if(model.stage===5){finish();return;}model.stage++;render();}
function back(){if(model.stage>0){model.stage--;render();}}
function close(){const dlg=document.getElementById('cb2-dialog');if(dlg?.open)dlg.close();model=null;}
function render(){const host=document.getElementById('cb2-body');if(!host||!model)return;document.getElementById('cb2-step').textContent=`Paso ${model.stage+1} de 6 · ${['Raza y subraza','Clase y nivel','Características','Trasfondo','Equipo','Revisión'][model.stage]}`;host.innerHTML=view();document.getElementById('cb2-error').textContent='';document.getElementById('cb2-back').disabled=model.stage===0;document.getElementById('cb2-next').textContent=model.stage===5?'Crear personaje':'Continuar →';}
function open(){const dlg=document.getElementById('cb2-dialog');loadRacialLibrary().then(()=>{model=make();dlg.showModal();render();}).catch(e=>{alert('No se pudo cargar la biblioteca racial V7. Comprueba que los archivos estén publicados juntos. Detalle: '+e.message);});}
const old=openCharacterWizardV110;
openCharacterWizardV110=function(){open()};
const node=document.createElement('dialog');node.id='cb2-dialog';node.className='cb2-dialog';node.innerHTML=`<div class="cb2-head"><h2>🛡️ Nuevo creador de personajes</h2><button id="cb2-close">✕ Cerrar</button></div><p class="cb2-progress" id="cb2-step"></p><div id="cb2-body"></div><p id="cb2-error" role="alert"></p><div class="cb2-actions"><button id="cb2-back">← Anterior</button><button class="gold" id="cb2-next">Continuar →</button></div>`;
document.body.append(node);node.addEventListener('click',e=>{const button=e.target.closest('[data-feat-choice]');if(!button||!model)return;assign('race.feat',button.dataset.featChoice);});node.addEventListener('input',e=>{if(e.target.id==='cb2-feat-search'){const results=document.getElementById('cb2-feat-results');if(results)results.innerHTML=featButtons(e.target.value);}});node.addEventListener('change',onEvent);node.addEventListener('input',e=>{if(e.target.dataset.key==='name')model.name=e.target.value});node.querySelector('#cb2-close').onclick=close;node.querySelector('#cb2-back').onclick=back;node.querySelector('#cb2-next').onclick=next;node.addEventListener('cancel',()=>{model=null});
window.DMACharacterBuilderV2={open,resolveLanguages:()=>model?languageLedger():null,getDraft:()=>model?structuredClone(model):null,resolveRace:()=>racialResolve(),loadRaces:loadRacialLibrary};
})();
