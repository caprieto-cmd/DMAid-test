/* DM.AID TEST 1.6.0 · Bibliotecas iniciales compartidas */
(function(){
'use strict';
const STORE=DMA_TEST_STORAGE_V153;
const KEY='dmaid-setup-160-complete';
const PHB_KEY='dmaid-races-phb-active';
const RACE_KEY='dmaid-races-imported-v160';
let raceCatalog=[];
try{raceCatalog=JSON.parse(STORE.getItem(RACE_KEY)||'[]');if(!Array.isArray(raceCatalog))raceCatalog=[]}catch{raceCatalog=[]}
const elem=id=>document.getElementById(id);
function note(s){elem('dma-setup-message').textContent=s||''}
function counts(){return {items:(typeof ITEMS_V18!=='undefined'?ITEMS_V18.length:0), monsters:(typeof REMOTE_BESTIARY_V4!=='undefined'?REMOTE_BESTIARY_V4.length:0),races:!!STORE.getItem(PHB_KEY)||raceCatalog.length>0}}
function update(){let c=counts();elem('dma-setup-items-label').textContent=c.items?`${c.items} objetos cargados`:'Pendiente';elem('dma-setup-monsters-label').textContent=c.monsters?`${c.monsters} monstruos cargados`:'Pendiente';elem('dma-setup-races-label').textContent=c.races?`PHB ${STORE.getItem(PHB_KEY)?'✓':''} · ${raceCatalog.length} razas importadas`:'Pendiente';elem('dma-setup-continue').disabled=!(c.items&&c.monsters&&c.races);return c}
function show(){update();if(STORE.getItem(KEY)==='yes'&&update().items&&update().monsters&&update().races)return;const overlay=elem('dma-library-setup');overlay.hidden=false;document.body.style.overflow='hidden'}
window.dmaSetupConfirmPHB=()=>{STORE.setItem(PHB_KEY,'yes');note('Razas originales PHB disponibles. Puedes importar MMotM ahora o más tarde.');update()};
window.dmaSetupFetchItems=async()=>{const b=elem('dma-setup-items-button');b.disabled=true;note('Cargando biblioteca de objetos…');try{await loadItemsOnlineV18();if(!counts().items)throw Error('La descarga no devolvió objetos');note('Objetos cargados. Revisa que las fichas incluyan las propiedades que necesitas.')}catch(e){note('Objetos: '+e.message+'. Puedes importar un JSON.')}finally{b.disabled=false;update()}};
window.dmaSetupFetchMonsters=async()=>{const b=elem('dma-setup-monsters-button');b.disabled=true;note('Cargando Monster Manual…');try{await loadRemoteBestiary('MM');if(!counts().monsters)throw Error('No hay monstruos disponibles tras la descarga');note('Monstruos cargados.')}catch(e){note('Monstruos: '+e.message+'. Puedes importar un JSON.')}finally{b.disabled=false;update()}};
window.dmaSetupImportItems=async(e)=>{const files=[...e.target.files];let count=0;try{for(const f of files){const data=JSON.parse(await f.text());count+=itemImportDataV18(data,f.name)}note(`Objetos importados: ${count} nuevos.`)}catch(err){note('Error al importar objetos: '+err.message)}finally{e.target.value='';update()}};
window.dmaSetupImportMonsters=async(e)=>{let count=0;try{for(const f of [...e.target.files]){const d=JSON.parse(await f.text());const a=Array.isArray(d)?d:(d.monster||d.monsters||[]);if(!Array.isArray(a))throw Error('No existe lista monster');const r=await v8Ingest(a);count+=r.added}note('Fichas de monstruos importadas: '+count)}catch(err){note('Error al importar monstruos: '+err.message)}finally{e.target.value='';update()}};
const sourceNames={MPMM:'Monsters of the Multiverse',PHB:'Player’s Handbook'};
function installRaces(rows,origin){const byId=new Map(raceCatalog.map(x=>[x.source+'|'+x.name.toLowerCase(),x]));let n=0;for(const raw of rows){if(!raw||!raw.name)continue;const source=String(raw.source||origin||'Importado');const entry={...raw,name:String(raw.name),source};const k=source+'|'+entry.name.toLowerCase();if(!byId.has(k))n++;byId.set(k,entry)}raceCatalog=[...byId.values()];STORE.setItem(RACE_KEY,JSON.stringify(raceCatalog));registerRaces();return n}
function registerRaces(){for(const r of raceCatalog){const key=r.name+' ('+(sourceNames[r.source]||r.source)+')';if(!RACES_V110.includes(key))RACES_V110.push(key);if(!RACE_BONUSES_V130[key])RACE_BONUSES_V130[key]={bon:[0,0,0,0,0,0],label:r.name+' · '+r.source};}}
registerRaces();
window.dmaSetupImportRaces=async e=>{let count=0;try{for(const f of [...e.target.files]){const data=JSON.parse(await f.text());const rows=Array.isArray(data)?data:(data.race||data.races||[]);if(!Array.isArray(rows)||!rows.length)throw Error('Se necesita un arreglo race/races');count+=installRaces(rows,f.name)}note('Razas/especies importadas: '+count+'. Se incluirán en el creador de personajes.')}catch(err){note('Error al importar razas: '+err.message)}finally{e.target.value='';update()}};
window.dmaSetupOpen=()=>{elem('dma-library-setup').hidden=false;document.body.style.overflow='hidden';update()};
window.dmaSetupDone=()=>{const c=update();if(!(c.items&&c.monsters&&c.races))return;STORE.setItem(KEY,'yes');elem('dma-library-setup').hidden=true;document.body.style.overflow=elem('dma-gate').hidden?'':'hidden';note('')};
// Create a race-specific flexible origin choice for imported MMotM races; no fixed PHB bonuses applied.
const prevRaceStep=wizardStepOneV110;
wizardStepOneV110=function(){let content=prevRaceStep();const r=raceCatalog.find(x=>wizV110.race===x.name+' ('+(sourceNames[x.source]||x.source)+')');if(!r)return content;const traits=Array.isArray(r.entries)?r.entries.map(x=>typeof x==='string'?x:(x.name||'')).filter(Boolean).slice(0,12).join(', '):'';return content+`<div class="wiz-full dma-race-source">Fuente racial: ${esc(sourceNames[r.source]||r.source)}. ${r.source==='MPMM'?'MMotM permite +2/+1 o +1/+1/+1 en atributos distintos.':'Consulta las reglas de la especie importada.'}<p class="dma-race-preview">Rasgos disponibles: ${esc(traits||'el archivo no aporta rasgos legibles')}</p></div>`};
const prevAdvance=wizardNextV110;
wizardNextV110=function(){if(wizV110&&wizV110.step===1){const r=raceCatalog.find(x=>wizV110.race===x.name+' ('+(sourceNames[x.source]||x.source)+')');if(r&&r.source==='MPMM'){const bonuses=wizV110.bonuses.map(Number).filter(v=>v>0).sort((a,b)=>b-a);if(!(['2,1','1,1,1'].includes(bonuses.join(',')))){alert('MMotM: asigna +2 y +1, o +1 a tres atributos distintos. No se acumulan aumentos sobre un mismo atributo.');return;}wizV110.originalBonusesV130=[...wizV110.bonuses];}}
return prevAdvance()};
// All 3 libraries must be installed on first use. Wait for async IndexedDB monster restoration.
const check=()=>{if(STORE.getItem(KEY)==='yes')return;show()};
setTimeout(check,1200);
const prevMenu=window.dmaCloseCampaignMenu;
window.dmaCloseCampaignMenu=function(){if(STORE.getItem(KEY)!=='yes'){show();return;}return prevMenu()};
})();
