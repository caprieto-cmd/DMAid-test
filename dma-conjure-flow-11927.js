/* DMAid 1.19.27 · Invocación en una sola operación.
   Las opciones de CR y cantidad de Conjure Animals (PHB 2014) forman pares fijos.
   El DM escoge los bloques concretos; la aplicación solo administra los recursos.
*/
(function(){'use strict';
 const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');
 const supported=new Set(['conjureanimals','conjurewoodlandbeings','conjureminorelementals','conjureelemental','conjurefey','summonbeast','summonfey','summonelemental']);
 const mem=new Map();
 const labels={Air:'Aire',Land:'Tierra',Water:'Agua',Earth:'Tierra',Fire:'Fuego',Fuming:'Furioso',Mirthful:'Alegre',Tricksy:'Astuto',fey:'Feérico',beast:'Bestia'};
 const title=s=>labels[s]||s;
 const crString=v=>v===.5?'1/2':v===.25?'1/4':v===.125?'1/8':v==null?'No aplica':String(v);
 function add(parent,tag,cls,text){const node=document.createElement(tag);if(cls)node.className=cls;if(text!==undefined)node.textContent=text;parent.append(node);return node}
 function selector(parent,text,choices,val){const label=add(parent,'label','dma-conjure-field11927');add(label,'span','',text);const select=add(label,'select');
  for(const c of choices){const item=add(select,'option','',c.label);item.value=String(c.value)}
  if(val!==undefined&&choices.some(x=>String(x.value)===String(val)))select.value=String(val);
  return select;}
 function castingInfo(i,name){return window.DMAspellCasting11920?.spellContext?.(i,name)}
 function spellMeta(name){return window.DMADruidRules1199?.getSpell?.(name)?.mechanics?.summon||null}
 function bestiary(name,cap,form){const api=window.DMASummonBrowser11910;const k=norm(name);
  const mode=k==='conjurefey'?form:(k==='conjureelemental'?form:'all');
  return api?.filterMonsters?.(name,cap,mode,mode)||[];
 }
 function build(panel,key){if(!/^p\d+$/.test(String(key)))return;const i=Number(key.slice(1));if(!state.players?.[i])return;
  const box=panel.querySelector('.dma-spell-quick1188');if(!box)return;
  const spellSelect=box.querySelector('label select');if(!spellSelect)return;
  const root=add(box,'section','dma-conjure-flow11927');
  const old=box.querySelector('.dma-cast-controls11920');
  let lastName='';
  function rebuild(){const name=spellSelect.value,mode=norm(name),isSummon=supported.has(mode)&&!!spellMeta(name);
   root.hidden=!isSummon;box.classList.toggle('dma-conjure-mode11927',isSummon);
   if(old)old.hidden=isSummon;
   root.replaceChildren();if(!isSummon)return;
   const meta=spellMeta(name),context=castingInfo(i,name),memory=mem.get(i)||{};
   if(name!==lastName){lastName=name;}
   add(root,'h4','','🐾 Preparar invocación');
   add(root,'p','dma-conjure-note11927','Selecciona todas las opciones y confirma una sola vez. Se gastará un espacio y se registrarán las criaturas en iniciativa y daño rápido.');
   if(!context||context.reason){add(root,'p','dma-conjure-error11927',context?.reason||'No se encontró el conjuro.');return;}
   const choices=context.options||[];if(!choices.length){add(root,'p','dma-conjure-error11927','No quedan espacios disponibles para lanzar este conjuro.');return;}
   const initial=choices.find(o=>o.id===memory.slot&&memory.name===name)||choices[0];
   const level=selector(root,'1. Nivel del espacio de conjuro',choices.map(o=>({label:o.label,value:o.id})),initial.id);
   const crRow=add(root,'div','dma-conjure-row11927');
   const optionsEl=selector(crRow,'2. Opción de CR máximo',[],undefined);
   const amount=add(crRow,'div','dma-conjure-amount11927');
   const formRow=add(root,'div','dma-conjure-row11927');
   const groupType=meta.forms?.length?selector(formRow,'4. Forma del espíritu',meta.forms.map(x=>({value:x,label:title(x)})),memory.form):
    mode==='conjureelemental'?selector(formRow,'4. Elemento', ['Air','Earth','Fire','Water'].map(x=>({value:x,label:title(x)})),memory.form):
    mode==='conjurefey'?selector(formRow,'4. Tipo de criatura',[{value:'fey',label:'Feérico'},{value:'beast',label:'Bestia como espíritu feérico'}],memory.form):null;
   const monsterWrap=add(root,'div','dma-conjure-row11927');
   const creatureSearch=(meta.forms?.length)?null:add(monsterWrap,'label','dma-conjure-field11927');
   let q=null;
   if(creatureSearch){add(creatureSearch,'span','','Filtrar por nombre');q=add(creatureSearch,'input');q.type='search';q.placeholder='Buscar en bestiario';q.value=memory.search||'';}
   const monster=(meta.forms?.length)?null:selector(monsterWrap,'5. Criatura del bestiario',[],undefined);
   const preview=add(root,'div','dma-conjure-preview11927');const status=add(root,'p','dma-conjure-status11927');status.setAttribute('role','status');
   const btn=add(root,'button','dma-conjure-launch11927','Lanzar conjuro e invocar');btn.type='button';
   let generatedOptions=[],available=[],prepared=null;
   function optionsFor(){const selected=choices.find(o=>o.id===level.value)||choices[0];const api=window.DMASummonedCombat11925;
    return api?.summonOptions?.(name,selected.level)||[]}
   function setOptions(){const oldVal=optionsEl.value;generatedOptions=optionsFor();optionsEl.replaceChildren();
    for(const o of generatedOptions){const option=add(optionsEl,'option','', 'CR '+crString(o.crMax));option.value=String(o.index)}
    if(generatedOptions.some(o=>String(o.index)===oldVal))optionsEl.value=oldVal;
    else if(memory.name===name&&generatedOptions.some(o=>String(o.index)===memory.optionIndex))optionsEl.value=memory.optionIndex;
    else optionsEl.value=String(generatedOptions[0]?.index??0);
    optionsEl.closest('label').hidden=!!meta.forms?.length;
   }
   function calculate(){const selection=choices.find(o=>o.id===level.value)||choices[0],opt=generatedOptions.find(x=>String(x.index)===optionsEl.value);
    const form=groupType?.value||'all';
    if(!opt){btn.disabled=true;return;}
    amount.replaceChildren();add(amount,'span','', '3. Cantidad permitida');add(amount,'strong','',String(opt.count));
    add(amount,'small','','La cantidad está vinculada al CR elegido por las reglas del conjuro.');
    if(monster){const prev=monster.value;available=bestiary(name,opt.crMax,form).filter(m=>String(m.name||'').toLowerCase().includes(String(q?.value||'').trim().toLowerCase()));
     monster.replaceChildren();
     for(const entry of available){const optItem=add(monster,'option','',String(entry.name||'Criatura')+' · CR '+crString(window.DMASummonBrowser11910.asCR(entry.cr)));optItem.value=String(entry.id)}
     if(available.some(x=>String(x.id)===prev))monster.value=prev;
     else if(memory.name===name&&available.some(x=>String(x.id)===memory.monsterId))monster.value=memory.monsterId;
     monster.disabled=!available.length;
    }
    const request={name,slot:selection.level,optionIndex:Number(optionsEl.value),form,monsterId:monster?.value,attackBonus:window.DMAcombatSpells1188?.castingBonus?.(i)?.bonus||0,dc:window.DMAcombatSpells1188?.castingBonus?.(i)?.dc||8};
    prepared=null;preview.replaceChildren();
    try{
     prepared=window.DMASummonedCombat11925.planCast11927(i,request);
     const one=prepared.units[0];preview.innerHTML=window.DMASummonedCombat11925.statHTML(one);
     status.textContent=prepared.count+' criatura(s), una tirada de iniciativa para el grupo; cada una con su tarjeta de HP y CA.';
     if(prepared.spirit)status.textContent='Un espíritu con turno inmediatamente después del lanzador; HP y CA propios.';
     btn.disabled=false;
    }catch(e){status.textContent=e.message;btn.disabled=true;}
    mem.set(i,{name,slot:level.value,optionIndex:optionsEl.value,form,monsterId:monster?.value||'',search:q?.value||''});
   }
   level.addEventListener('change',()=>{setOptions();calculate()});optionsEl.addEventListener('change',calculate);
   groupType?.addEventListener('change',calculate);monster?.addEventListener('change',calculate);q?.addEventListener('input',calculate);
   btn.addEventListener('click',()=>{if(!prepared||btn.disabled)return;
    const confirmed=window.DMAspellCasting11920?.cast?.(i,name,level.value,{optionIndex:prepared.optionIndex,form:prepared.form,monsterId:monster?.value});
    if(!confirmed){status.textContent='No se registró el lanzamiento. Revisa la disponibilidad de espacios y las opciones.';return;}
   });
   setOptions();calculate();
  }
  spellSelect.addEventListener('change',rebuild);
  // El selector original recuerda el último conjuro; conservar esa selección también aquí.
  rebuild();
 }
 const prev=renderActivePlayerBlock;
 renderActivePlayerBlock=function(panel,key){const result=prev.apply(this,arguments);build(panel,key);return result};
 window.DMAConjureFlow11927={supported,bestiary};
})();
