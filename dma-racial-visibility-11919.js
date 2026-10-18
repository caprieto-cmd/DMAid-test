/* DMAid 1.19.19: racial traits in both the character management sheet and
   the encounter statblock. Reads the stored V2 racial result first; for
   historical characters uses the pre-2024 library with inherited traits.
   This presentation layer does not spend resources or roll dice. */
(function(){
'use strict';
const LIBRARY_URL='./races.pre2024.normalized.v7.json?v=1.19.19';
let library=null, attempted=false;
const sanitize=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=s=>String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const level=i=>Math.max(1,(profile(i)?.classes||[]).reduce((n,c)=>n+(Number(c.level)||0),0));
function loadLibrary(){
 if(attempted)return;
 attempted=true;
 fetch(LIBRARY_URL,{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('HTTP '+r.status);return r.json()}).then(db=>{
  if(!Array.isArray(db.entries))return;
  library=db;
  // Decorate existing sheets without reconstructing the modal or moving scroll.
  paintSheets();
  const combat=document.getElementById('eldaria-active-stat');
  if(combat){const active=combat.querySelector('.eld-player-statblock');if(active){
   const k=active.getAttribute('data-key')||active.dataset.playerKey||'';
   if(/^p\d+$/.test(k))paintCombat(combat,k);
  }}
 }).catch(()=>{/* V2 snapshots remain usable offline. */});
}
function getEntry(sh){
 const rows=library?.entries||[];
 if(!rows.length)return null;
 const stored=sh?.creationV2?.racialSourceId;
 if(stored){const record=rows.find(e=>e.id===stored);if(record)return record;}
 const raceRaw=String(sh?.raceNameV170||sh?.race||'').replace(/\s*\([^)]*(?:PHB|MMotM|2014|2022)[^)]*\)\s*$/i,'');
 const raceAlias={halfling:'mediano',lightfoot:'piesligeros',stout:'fornido'};
 const race=raceAlias[norm(raceRaw)]||norm(raceRaw),variant=raceAlias[norm(sh?.raceVariantV130||'')]||norm(sh?.raceVariantV130||'');
 const candidates=rows.filter(e=>norm(e.name)===race||(e.legacy_names||[]).some(x=>norm(x)===race));
 const variants=rows.filter(e=>e.parent_id&&(norm(e.name)===variant||norm(e.name)===race));
 const fromVariant=variants.find(e=>candidates.some(p=>e.parent_id===p.id))||variants.find(e=>norm(e.name)===race);
 if(fromVariant)return fromVariant;
 const exact=candidates.find(e=>!e.parent_id);
 if(exact)return exact;
 // Do not guess from ambiguous or unrecognized names.
 return candidates.length===1?candidates[0]:null;
}
function inherited(sh){
 const record=getEntry(sh);if(!record)return null;
 const map=new Map(library.entries.map(e=>[e.id,e]));
 const path=[],seen=new Set();let e=record;
 while(e&&!seen.has(e.id)){seen.add(e.id);path.unshift(e);e=e.parent_id?map.get(e.parent_id):null;}
 return {name:path.map(x=>x.name).join(' · '),source:record.source?.book_id||record.source?.book||'',traits:path.flatMap(x=>x.traits||[])};
}
function racialData(i){
 const sh=profile(i);if(!sh)return null;
 const snap=sh.creationV2?.racialResult;
 if(Array.isArray(snap?.traits)&&snap.traits.length){
  const label=[sh.race,sh.raceVariantV130].filter(x=>x&&!/sin subraza/i.test(x)).join(' · ');
  return {name:label||snap.raceName||sh.race||'Especie',source:snap.source?.book_id||snap.source?.book||'',traits:snap.traits};
 }
 return inherited(sh);
}
function traitSummary(t,isHalfling){
 if(isHalfling&&norm(t?.name)==='lucky')return 'Pasivo · sin gasto de acción ni reacción · usos ilimitados';
 return '';
}
function markup(data){
 const isHalfling=norm(data.name).includes('mediano')||norm(data.name).includes('halfling');
 const seen=new Set();const cards=[];
 for(const t of data.traits){
  if(!t||!t.name)continue;
  const id=norm(t.id||t.name);if(seen.has(id))continue;seen.add(id);
  const description=String(t.description||'').trim();
  const other=String(t.supplementary_rules||'').trim();
  const supplement=other&&norm(other)!==norm(description)?`<p>${sanitize(other)}</p>`:'';
  const usage=traitSummary(t,isHalfling);
  cards.push(`<div class="dma-racial-trait11919"><strong>${sanitize(t.name)}</strong>${usage?`<small class="dma-racial-usage11919">${sanitize(usage)}</small>`:''}<p>${sanitize(description||'Descripción mecánica no disponible en el catálogo; consulta la fuente correspondiente.')}</p>${supplement}</div>`);
 }
 if(!cards.length)return '';
 return `<div class="dma-racial-read11919"><p class="dma-racial-source11919">${sanitize(data.name)}${data.source?' · '+sanitize(data.source):''}</p>${cards.join('')}</div>`;
}
function identifyCard(card){
 const field=card.querySelector('[onchange*="setPlayerName("]');
 const index=field?.getAttribute('onchange')?.match(/setPlayerName\((\d+)/)?.[1];
 return index==null?-1:Number(index);
}
function paintSheet(card,i){
 if(!card||!state.players?.[i])return;
 const data=racialData(i);if(!data?.traits?.length)return;
 const host=card.querySelector('.dma-sheet-sections-1123')||card.querySelector('.dma-sheet-full')||card;
 if(!host)return;
 // Remove old presentational racial cards before mounting the single unified section.
 const preexisting=card.querySelectorAll('.dma-race-audit-1164');
 let fold=host.querySelector(':scope > .dma-racial-sheet11919');
 if(!fold){
  fold=document.createElement('details');fold.className='dma-section-1123 dma-racial-sheet11919';fold.open=false;
  const heading=document.createElement('summary');heading.textContent='🧬 Rasgos raciales';
  const inner=document.createElement('div');inner.className='dma-section-content-1123 dma-racial-sheet-inner11919';
  fold.append(heading,inner);
  const classes=[...host.querySelectorAll(':scope > details.dma-section-1123')].find(d=>/rasgos de clase|identidad y clases/i.test(d.querySelector(':scope > summary')?.textContent||''));
  if(classes)classes.before(fold);else host.prepend(fold);
 }
 const inner=fold.querySelector('.dma-racial-sheet-inner11919');
 if(inner)inner.innerHTML=markup(data);
 preexisting.forEach(old=>{if(!fold.contains(old))old.remove();});
}
function paintSheets(){
 document.querySelectorAll('#sheetsplayers article.sheet').forEach(card=>{
  const i=identifyCard(card);if(i>=0)paintSheet(card,i);
 });
}
function paintCombat(panel,key){
 if(!/^p\d+$/.test(String(key)))return;
 const i=Number(String(key).slice(1));if(!state.players?.[i])return;
 const data=racialData(i);if(!data?.traits?.length)return;
 const root=panel?.querySelector('.eld-player-statblock');if(!root)return;
 const cat=root.querySelector('details.dma-unified-panel-1177[data-dma-category="racial"],.dma-four-racial-11615');
 if(!cat)return;
 const content=cat.querySelector('.dma-unified-body-1177')||cat;
 // The MMotM module already renders its own complete notes in combat. A PHB
 // snapshot must not be discarded merely because it is absent from that catalog.
 const existing=content.querySelector('.dma-race-audit-1164');
 const isLegacyMmotm=!!profile(i)?.racialMetadataV170;
 if(existing&&isLegacyMmotm)return;
 content.querySelectorAll('.dma-empty-11615').forEach(x=>x.remove());
 let mount=content.querySelector('.dma-racial-combat11919');
 if(!mount){mount=document.createElement('div');mount.className='dma-racial-combat11919';content.prepend(mount);}
 mount.innerHTML=markup(data);
 // Remove duplicate descriptions injected by older PHB V2 bridges.
 content.querySelectorAll('.dma-race-audit-1164').forEach(old=>{if(!mount.contains(old))old.remove();});
}
// These hooks run after the existing views, retaining their own controls and state.
const beforeSheets=renderSheets;
renderSheets=function(){const result=beforeSheets.apply(this,arguments);paintSheets();return result;};
const beforeCombat=renderActivePlayerBlock;
renderActivePlayerBlock=function(panel,key){const result=beforeCombat.apply(this,arguments);paintCombat(panel,key);return result;};
window.DMARacialVisibility11919={racialData,paintSheets,paintCombat,loadLibrary};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',loadLibrary,{once:true});else loadLibrary();
})();
