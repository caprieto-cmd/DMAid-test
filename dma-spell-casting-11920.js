/* DM.AID 1.19.20 · Registro de lanzamiento de conjuros, sin dados ni efectos simulados. */
(function(){'use strict';
  const uiByPlayer=new Map();
  const spellAPI=()=>window.DMAcombatSpells1188;
  const number=v=>Math.max(0,Number(v)||0);
  const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');
  const normalizedSpell=(i,name)=>spellAPI()?.getSpell(name)||null;
  function castingTime(spell){
    const indexed=spell?.casting_time||spell?.time||spell?.mechanics?.casting_time;
    if(indexed)return String(indexed);
    // Algunas fichas heredadas solo poseen un resumen. Estos son tiempos
    // inequívocos de 2014, nunca se infieren de una etiqueta arbitraria.
    const name=norm(spell?.n||spell?.name);
    if(['shield','counterspell','absorbelements','featherfall','hellishrebuke','silverybarbs','temporalshunt'].includes(name))return '1 reaction';
    if(['healingword','masshealingword','mistystep','spiritualweapon','sanctuary','shieldoffaith','huntersmark','hex','divinefavor','shillelagh'].includes(name))return '1 bonus action';
    return '';
  }
  function isReaction(spell){return /\breact(?:ion)?\b|reacci[oó]n/i.test(castingTime(spell));}
  function isBonus(spell){return /bonus\s*action|acci[oó]n\s+adicional/i.test(castingTime(spell));}
  function concentration(spell){return !!(spell?.concentration||spell?.mechanics?.durationConcentration||/^\s*concentraci[oó]n|^\s*concentration/i.test(String(spell?.duration||spell?.mechanics?.duration||''))||/^\s*concentraci[oó]n\b/i.test(String(spell?.summary||'')));}
  function slots(i,minLevel){
    const sh=profile(i),calc=slotCalc(i);
    const total=sh.slots||calc.slots||[],used=Array.isArray(sh.used)?sh.used:[];
    const rows=[];
    for(let l=Math.max(1,minLevel);l<=9;l++){
      const max=number(total[l-1]),remaining=Math.max(0,max-number(used[l-1]));
      if(remaining>0)rows.push({id:'normal-'+l,kind:'normal',level:l,remaining,label:'Nivel '+l+' · '+remaining+' disponible'+(remaining===1?'':'s')});
    }
    const pact=calc.pact||[0,0],pactMax=number(pact[0]),pactLevel=number(pact[1]);
    const pactRemaining=Math.max(0,pactMax-number(sh.pactUsed));
    if(pactRemaining>0&&pactLevel>=Math.max(1,minLevel))rows.push({id:'pact-'+pactLevel,kind:'pact',level:pactLevel,remaining:pactRemaining,label:'Magia de pacto · nivel '+pactLevel+' ('+pactRemaining+' disponible'+(pactRemaining===1?'':'s')+')'});
    return rows;
  }
  function spellContext(i,name){
    const spell=normalizedSpell(i,name);if(!spell)return {spell:null,level:null,reason:'Conjuro sin nivel indexado: no se puede registrar su lanzamiento automáticamente.'};
    const level=Number(spell.l);
    if(!Number.isInteger(level)||level<0||level>9)return {spell,level:null,reason:'Nivel del conjuro no verificable.'};
    return {spell,level,options:level===0?[]:slots(i,level)};
  }
  function refresh(i){
    // Actualiza los círculos, el explorador y ambas vistas de concentración.
    if(typeof renderEldariaStatBlock==='function')renderEldariaStatBlock();
    if(typeof renderQuickEnemies==='function')renderQuickEnemies();
  }
  function lastMessage(i){
    const last=profile(i).dmaLastCast11920;
    if(!last)return '';
    return 'Último lanzamiento: '+last.name+(last.level?' · '+(last.pact?'pacto':'espacio')+' nivel '+last.level:' · truco')+(last.concentration?' · concentración ✓':'');
  }
  function cast(i,name,slotId){
    try{
      const p=state.players?.[i];if(!p)throw Error('No se encontró el personaje.');
      const context=spellContext(i,name),spell=context.spell;
      if(context.reason)throw Error(context.reason);
      const sh=profile(i);let option=null;
      if(context.level>0){
        option=context.options.find(s=>s.id===slotId);
        if(!option)throw Error('El espacio seleccionado no está disponible. Comprueba su nivel y los usos restantes.');
        if(option.level<context.level)throw Error('No puedes lanzar un conjuro con un espacio inferior a su nivel.');
      }
      if(isReaction(spell)&&sh.dmaReactionUsed1178)throw Error('La reacción de este personaje ya está gastada.');
      // No se modifican recursos hasta pasar todas las comprobaciones.
      if(option){
        if(option.kind==='pact')sh.pactUsed=number(sh.pactUsed)+1;
        else{
          if(!Array.isArray(sh.used))sh.used=Array(9).fill(0);
          sh.used[option.level-1]=number(sh.used[option.level-1])+1;
        }
      }
      if(isReaction(spell))sh.dmaReactionUsed1178=true;
      if(concentration(spell)){
        sh.dmaMagic1185=sh.dmaMagic1185||{cantrips:[],prepared:[],known:[],concentrating:null};
        // Lanzar un nuevo conjuro de concentración termina el anterior (PHB 2014).
        sh.dmaMagic1185.concentrating=name;
      }
      sh.dmaLastCast11920={name,level:option?.level||0,pact:option?.kind==='pact',concentration:concentration(spell),reaction:isReaction(spell)};
      save();window.DMASummonedCombat11925?.onCast?.(i,name,option?.level||0);refresh(i);
      return true;
    }catch(err){
      console.error('[DMAid] No se registró el conjuro',err);
      alert('No se registró el lanzamiento: '+(err.message||String(err)));
      return false;
    }
  }
  function createCastControls(panel,key){
    if(!/^p\d+$/.test(String(key||'')))return;
    const i=Number(key.slice(1));if(!state.players?.[i])return;
    const spellRoot=panel.querySelector('.dma-spell-quick1188');if(!spellRoot)return;
    const spellSelect=spellRoot.querySelector('label select');if(!spellSelect)return;
    const box=document.createElement('div');box.className='dma-cast-controls11920';
    const row=document.createElement('div');row.className='dma-cast-row11920';
    const slotWrap=document.createElement('label');slotWrap.className='dma-cast-slot11920';slotWrap.textContent='Espacio que se utilizará';
    const slotSelect=document.createElement('select');slotSelect.setAttribute('aria-label','Nivel y origen del espacio de conjuro');slotWrap.append(slotSelect);
    const castButton=document.createElement('button');castButton.type='button';castButton.className='dma-cast-button11920';castButton.textContent='Lanzar';
    const note=document.createElement('div');note.className='dma-cast-note11920';note.setAttribute('role','status');
    row.append(slotWrap,castButton);box.append(row,note);spellRoot.append(box);
    let saved=uiByPlayer.get(i)||{name:'',slot:''};
    function update(){
      const name=spellSelect.value;const context=spellContext(i,name);
      slotSelect.replaceChildren();const {level,spell,options=[]}=context;
      row.hidden=!name;note.textContent='';castButton.disabled=!name||!!context.reason;
      if(!name){note.textContent=lastMessage(i);return;}
      if(context.reason){note.textContent=context.reason;slotWrap.hidden=true;return;}
      if(level===0){slotWrap.hidden=true;castButton.textContent='Registrar truco';}
      else{
        slotWrap.hidden=false;castButton.textContent='Lanzar';
        for(const o of options){const el=document.createElement('option');el.value=o.id;el.textContent=o.label;slotSelect.append(el)}
        if(saved.name===name&&options.some(o=>o.id===saved.slot))slotSelect.value=saved.slot;
        castButton.disabled=!options.length;
      }
      let message=concentration(spell)?'Concentración: al lanzar se marcará como activa.':'No modifica la concentración actual.';
      if(isReaction(spell))message+=' Utiliza la reacción.';
      else if(isBonus(spell))message+=' Bonus Action: recuerda la restricción de otros conjuros en el mismo turno (2014).';
      if(level>0&&!options.length)message='Sin espacios disponibles de nivel '+level+' o superior.';
      const last=lastMessage(i);note.textContent=message+(last?' · '+last:'');
    }
    spellSelect.addEventListener('change',()=>{saved={name:spellSelect.value,slot:''};uiByPlayer.set(i,saved);update()});
    slotSelect.addEventListener('change',()=>{saved={name:spellSelect.value,slot:slotSelect.value};uiByPlayer.set(i,saved)});
    castButton.addEventListener('click',()=>{
      const name=spellSelect.value;const slot=slotSelect.value;
      if(!name||castButton.disabled)return;
      uiByPlayer.set(i,{name,slot});
      cast(i,name,slot);
    });
    if(saved.name&&Array.from(spellSelect.options).some(o=>o.value===saved.name)){
      spellSelect.value=saved.name;
      // El visor de reglas original escucha este evento para reconstruir detalles y statblocks.
      spellSelect.dispatchEvent(new Event('change'));
    }
    update();
  }
  const oldActive=renderActivePlayerBlock;
  renderActivePlayerBlock=function(panel,key){const result=oldActive.apply(this,arguments);createCastControls(panel,key);return result;};
  window.DMAspellCasting11920={cast,spellContext,slots,concentration};
})();
