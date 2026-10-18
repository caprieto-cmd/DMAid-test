/* DMAid 1.19.6 · Concentration is an encounter tracker, not an automated spell cast. */
(function(){'use strict';
 function esc(s){return String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
 function spellChoices(i){
  const sh=profile(i);const d=sh?.dmaMagic1185||{};
  const ns=[...(d.prepared||[]),...(d.known||[]),...(d.cantrips||[]),...(sh?.dmaGranted1194||[])];
  const catalog=[...(window.DMA_DRUID_SPELLS_1189||[]),...(typeof SPELL_LIBRARY!=='undefined'?SPELL_LIBRARY:[]),...(window.DMA_SUBCLASS_SPELLS_1194||[])];
  const result=[];for(const n of ns){const x=catalog.find(s=>String(s.n||s.name||'').toLowerCase()===String(n).toLowerCase());if(x?.concentration&&!result.includes(n))result.push(n);}return result.sort();
 }
 function current(i){return profile(i)?.dmaMagic1185?.concentrating||'';}
 function control(i,compact){
  const active=current(i),options=spellChoices(i),selectId='dma-conc-select-1196-'+(compact?'quick':'stat')+'-'+i;
  if(!active&&!options.length)return '';
  return `<div class="dma-conc-1196 ${compact?'compact':''}"><div class="dma-conc-title">🎯 Concentración</div>`+
    (active?`<label class="dma-conc-active"><input type="checkbox" checked onchange="DMAconcentration1196.clear(${i})"> ${esc(active)} <small>Desmarcar si termina o falla la salvación</small></label>`:'<small>Sin concentración activa</small>')+
    (options.length?`<div class="dma-conc-set"><select id="${selectId}" aria-label="Conjuro de concentración">${options.map(n=>`<option value="${esc(n)}">${esc(n)}</option>`).join('')}</select><button type="button" onclick="DMAconcentration1196.mark(${i},'${selectId}')">Marcar</button></div>`:'')+
    '</div>';
 }
 function updateViews(){if(typeof renderQuickEnemies==='function')renderQuickEnemies();if(typeof renderEldariaStatBlock==='function')renderEldariaStatBlock();}
 window.DMAconcentration1196={mark(i,id){const name=document.getElementById(id)?.value;if(!name)return;const sh=profile(i);sh.dmaMagic1185=sh.dmaMagic1185||{cantrips:[],prepared:[],known:[],concentrating:null};sh.dmaMagic1185.concentrating=name;save();updateViews();},clear(i){const sh=profile(i);if(!sh?.dmaMagic1185)return;sh.dmaMagic1185.concentrating=null;save();updateViews();}};
 const previousQuick=renderQuickEnemies;
 renderQuickEnemies=function(){const ret=previousQuick.apply(this,arguments);const root=document.getElementById('quickenemygrid');if(!root)return ret;
  const group=root.querySelector('.quick-group');if(!group)return ret;const cards=group.querySelectorAll('.quick-enemy');state.players.forEach((_,i)=>{if(cards[i])cards[i].insertAdjacentHTML('beforeend',control(i,true));});return ret;};
 const previousActive=renderActivePlayerBlock;
 renderActivePlayerBlock=function(panel,key){const ret=previousActive.apply(this,arguments);if(/^p\d+$/.test(String(key||''))){const i=Number(key.slice(1));if(state.players[i]&&panel&&!panel.querySelector('.dma-conc-1196'))panel.insertAdjacentHTML('beforeend',control(i,false));}return ret;};
})();