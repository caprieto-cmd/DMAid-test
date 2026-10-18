/* DM.AID Racial Rules Engine · pre-2024 · CommonJS + browser global
   Pure derivation: never mutates source library or character choices. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.DMAidRacialEngine=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const ABILITIES=['FUE','DES','CON','INT','SAB','CAR'];
const clone=v=>JSON.parse(JSON.stringify(v));
const unique=a=>[...new Set(a)];
const fail=(code,message)=>({code,message});
function indexLibrary(db){if(!db||!Array.isArray(db.entries))throw Error('Biblioteca racial inválida');const map=new Map();for(const e of db.entries){if(map.has(e.id))throw Error('ID racial repetido: '+e.id);if(e.source?.year>=2024||e.source?.edition==='5e-2024')throw Error('Fuente fuera de alcance: '+e.id);map.set(e.id,e);}return map;}
function lineage(map,id){let e=map.get(id);if(!e)throw Error('Raza desconocida: '+id);const path=[],visited=new Set();while(e){if(visited.has(e.id))throw Error('Herencia circular: '+e.id);visited.add(e.id);path.unshift(e);e=e.parent_id?map.get(e.parent_id):null;if(path[0].parent_id&&!e)throw Error('Padre racial ausente: '+path[0].parent_id);}return path;}
function chooseAbility(rule,choice,errors){const out=Object.fromEntries(ABILITIES.map(k=>[k,0]));const mode=rule?.mode;if(!rule)return out;
if(['fixed','fixed_total'].includes(mode)){for(const k of ABILITIES)out[k]=Number(rule.values?.[k]||0);return out;}
const values=choice?.abilityIncreases;
if(!values||typeof values!=='object'){errors.push(fail('missing_ability_choice','Debes seleccionar aumentos de característica'));return out;}
for(const k of ABILITIES){let n=values[k]??0;if(!Number.isInteger(n)||n<0){errors.push(fail('invalid_ability','Aumento inválido: '+k));n=0;}out[k]=n;}
if(mode==='choice'){const count=rule.count||0,amt=rule.value||1;if(ABILITIES.filter(k=>out[k]!==0).length!==count||ABILITIES.some(k=>out[k]!==0&&out[k]!==amt))errors.push(fail('invalid_ability_choice','Debes elegir '+count+' características distintas con +'+amt));}
else if(mode==='flexible'){const distribution=ABILITIES.map(k=>out[k]).filter(Boolean).sort((a,b)=>b-a);const valid=(rule.options||[]).some(opt=>JSON.stringify([...opt].sort((a,b)=>b-a))===JSON.stringify(distribution));if(!valid)errors.push(fail('invalid_ability_choice','Distribución racial inválida. Usa +2/+1 o +1/+1/+1.'));}
else errors.push(fail('unsupported_ability_mode','Modo de puntuación no implementado: '+mode));
return out;}
function resolve(db,character){const map=indexLibrary(db);const path=lineage(map,character.raceId);const errors=[],warnings=[];const selected=path.at(-1);const choices=character.choices||{};const level=Math.max(1,Number(character.level)||1);
const out={raceId:selected.id,raceName:selected.name,source:clone(selected.source),lineage:path.map(x=>x.id),level,abilityIncreases:Object.fromEntries(ABILITIES.map(k=>[k,0])),proficiencies:{skill:[],weapon:[],tool:[],saving_throw:[]},senses:{},resistances:[],immunities:[],speeds:{},naturalWeapons:[],spells:[],resources:[],traits:[],conditionalEffects:[],otherEffects:[],pendingChoices:[],errors,warnings,provenance:[]};
// PHB subraces store fixed_total: replace parent ASI. Variant also replaces standard human ASI.
let scoreRule=null;for(const e of path){if(e.ability_increases){if(e.ability_increases.mode==='fixed_total'||e.ability_increases.mode==='choice'||e.ability_increases.mode==='flexible')scoreRule=clone(e.ability_increases);else if(!scoreRule)scoreRule=clone(e.ability_increases);else if(scoreRule.mode==='fixed'&&e.ability_increases.mode==='fixed'){for(const k of ABILITIES)scoreRule.values[k]=(scoreRule.values[k]||0)+(e.ability_increases.values?.[k]||0);}}}
out.abilityIncreases=chooseAbility(scoreRule,choices,errors);
const adding=(field,value,source)=>{if(!out[field].includes(value))out[field].push(value);out.provenance.push({field,value,source});};
const spellSeen=new Set(),resourceSeen=new Set();
function spell(sp,source){const lvl=Number(sp.min_character_level??sp.min_level??0);if(level<lvl)return;const name=sp.spell||sp.name||sp.id;if(!name)return;const key=source+':'+name;if(spellSeen.has(key))return;spellSeen.add(key);out.spells.push({...clone(sp),name,source});}
function resource(e,source){const key=source;if(resourceSeen.has(key))return;resourceSeen.add(key);out.resources.push({...clone(e),source,trackingKey:source});}
for(const e of path){if(e===selected)out.speeds=clone(e.speed||{});else if(!Object.keys(out.speeds).length)out.speeds=clone(e.speed||{});
for(const t of e.traits||[]){const source=e.id+'/'+t.id;const visible={id:t.id,name:t.name,source:e.id,status:t.status||null,description:t.description||"",supplementary_rules:t.supplementary_rules||"",description_status:t.description_status||""};out.traits.push(visible);
for(const fx of t.effects||[]){const f=clone(fx),type=f.type;
if(type==='sense'){const name=f.name||f.sense;if(name)out.senses[name]=Math.max(out.senses[name]||0,Number(f.range_ft||0));}
else if(type==='resistance'){for(const v of f.damage_types||[f.damage_type].filter(Boolean)){if(v==='chosen_draconic_ancestry'){const ancestry=choices['draconic_ancestry']||choices['draconic-ancestry'];if(ancestry)adding('resistances','draconic:'+ancestry,source);else out.pendingChoices.push({source,kind:'draconic_ancestry'});}else adding('resistances',v,source);}}
else if(type==='immunity'){adding('immunities',f.effect||f.damage_type||f.condition||'unspecified',source);}
else if(type==='proficiency'){const kind=f.kind;const vals=f.ids||f.skills||f.tools||[];if(out.proficiencies[kind])for(const v of vals){if(!out.proficiencies[kind].includes(v))out.proficiencies[kind].push(v);out.provenance.push({field:'proficiency.'+kind,value:v,source});}}
else if(type==='speed'){const key=f.mode==='fly'?'fly_ft':f.mode==='swim'?'swim_ft':f.mode==='climb'?'climb_ft':f.mode+'_ft';out.speeds[key]=f.value==='walking_speed'?out.speeds.walk_ft:f.value??f.speed_ft??null;if(f.unavailable_armor)out.conditionalEffects.push({source,effect:f,reason:'armor_condition'});}
else if(type==='natural_weapon'){out.naturalWeapons.push({...f,source});}
else if(type==='hp_progression'){out.otherEffects.push({source,type:'hp_bonus',value:level*Number(f.per_character_level||0)});}
else if(type==='spell_grant'){for(const s of f.spells||[f])spell(s,source);}
else if(type==='spell_progression'||type==='racial_spellcasting'){for(const s of f.spells||f.progression||[])spell(s,source);}
else if(type==='limited_use'){resource(f,source);}
else if(type==='choice'||type==='skill_proficiency_choice'){
const kind=type==='skill_proficiency_choice'?'skill_proficiency':f.kind;const count=Number(f.count||1);const selection=choices[source]??choices[t.id]??choices[kind];const picked=selection==null?[]:Array.isArray(selection)?selection:[selection];
if(picked.length!==count||new Set(picked).size!==picked.length){out.pendingChoices.push({source,kind,count,options:f.options||f.ids||f.pool||null});}else{const options=f.options||f.ids;if(Array.isArray(options)&&picked.some(p=>!options.includes(p)))errors.push(fail('invalid_choice','Elección fuera de catálogo: '+source));else if(kind==='skill_proficiency'&&picked.every(p=>typeof p==='string'))for(const p of picked){if(!out.proficiencies.skill.includes(p))out.proficiencies.skill.push(p);out.provenance.push({field:'proficiency.skill',value:p,source});}else out.otherEffects.push({source,type:'choice',kind,values:picked});}}
else if(type==='conditional_advantage'||type==='conditional_disadvantage'||type==='conditional_bonus'||type==='ac_formula'||type==='mode'||type==='transformation'||type==='temporary_proficiency_choice')out.conditionalEffects.push({source,effect:f});
else out.otherEffects.push({source,effect:f});
}
}}
if(choices.abilityScores){for(const k of ABILITIES)if(Number(choices.abilityScores[k]||0)+out.abilityIncreases[k]>20)errors.push(fail('score_above_20',k+' supera 20'));}
return out;}
function audit(db){const map=indexLibrary(db),warnings=[],types={};for(const e of db.entries){try{lineage(map,e.id);}catch(err){warnings.push(err.message);}for(const t of e.traits||[])for(const f of t.effects||[]){types[f.type]=(types[f.type]||0)+1;if(!f.type)warnings.push('Efecto sin tipo: '+e.id+'/'+t.id);}}return {entries:db.entries.length,effectTypes:types,warnings};}
return Object.freeze({resolve,audit,indexLibrary});
});
