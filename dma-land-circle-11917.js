/* DMAid 1.19.17 · Circle of the Land, PHB/SRD 5.1 (2014).
   Character sheets: choices and always-prepared spells. Combat: Natural Recovery.
   Never rolls dice or spends spell slots merely to display a choice. */
(function(){'use strict';
const TERRAIN={
 Arctic:{es:'Ártico',groups:[['Hold Person','Spike Growth'],['Sleet Storm','Slow'],['Freedom of Movement','Ice Storm'],['Commune with Nature','Cone of Cold']]},
 Coast:{es:'Costa',groups:[['Mirror Image','Misty Step'],['Water Breathing','Water Walk'],['Control Water','Freedom of Movement'],['Conjure Elemental','Scrying']]},
 Desert:{es:'Desierto',groups:[['Blur','Silence'],['Create Food and Water','Protection from Energy'],['Blight','Hallucinatory Terrain'],['Insect Plague','Wall of Stone']]},
 Forest:{es:'Bosque',groups:[['Barkskin','Spider Climb'],['Call Lightning','Plant Growth'],['Divination','Freedom of Movement'],['Commune with Nature','Tree Stride']]},
 Grassland:{es:'Pradera',groups:[['Invisibility','Pass without Trace'],['Daylight','Haste'],['Divination','Freedom of Movement'],['Dream','Insect Plague']]},
 Mountain:{es:'Montaña',groups:[['Spider Climb','Spike Growth'],['Lightning Bolt','Meld into Stone'],['Stone Shape','Stoneskin'],['Passwall','Wall of Stone']]},
 Swamp:{es:'Pantano',groups:[['Darkness',"Melf's Acid Arrow"],['Water Walk','Stinking Cloud'],['Freedom of Movement','Locate Creature'],['Insect Plague','Scrying']]},
 Underdark:{es:'Infraoscuridad',groups:[['Spider Climb','Web'],['Gaseous Form','Stinking Cloud'],['Greater Invisibility','Stone Shape'],['Cloudkill','Insect Plague']]}
};
// Circle spells not present in the packaged catalogue. Official 2014 spell mechanics
// paraphrased for the rules viewer. classes=[] deliberately: Land-granted only,
// not spells available to every Druid for normal preparation.
const SUPPLEMENT=[
 {n:'Blur',l:2,school:'Ilusión',casting_time:'1 acción',range:'Personal',components:'V',duration:'Concentración, hasta 1 minuto',concentration:true,description:'Mientras dure el conjuro, los ataques contra el lanzador tienen desventaja si el atacante depende de la vista. No afecta a una criatura que perciba sin visión, por ejemplo con vista ciega, o que pueda ver a través de ilusiones, por ejemplo con visión verdadera.'},
 {n:'Create Food and Water',l:3,school:'Conjuración',casting_time:'1 acción',range:'30 pies',components:'V, S',duration:'Instantánea',concentration:false,description:'Crea 45 libras de alimento y 30 galones de agua en suelo o recipientes dentro del alcance. Suficiente para alimentar a 15 humanoides o 5 monturas durante 24 horas. La comida se estropea si no se consume en 24 horas; el agua se mantiene limpia.'},
 {n:'Darkness',l:2,school:'Evocación',casting_time:'1 acción',range:'60 pies',components:'V, M (pelo de murciélago y gota de brea o carbón)',duration:'Concentración, hasta 10 minutos',concentration:true,description:'Oscuridad mágica en una esfera de radio 15 pies, que se extiende alrededor de las esquinas. La visión en la oscuridad no permite ver a través de ella y la luz no mágica no la ilumina. Si el punto está en un objeto no llevado ni vestido, la oscuridad se mueve con él; taparlo completamente con un objeto opaco bloquea el efecto. Si se solapa con luz creada por conjuro de nivel 2 o inferior, disipa ese conjuro de luz.'},
 {n:'Divination',l:4,school:'Adivinación',casting_time:'1 acción (ritual posible)',range:'Personal',components:'V, S, M (incienso y ofrenda por valor conjunto mínimo de 25 po, consumidos)',duration:'Instantánea',concentration:false,description:'Consulta a una deidad o sus servidores sobre un objetivo, suceso o actividad específicos que ocurrirá en los próximos siete días. El DM da una respuesta veraz, incluso críptica, sin contemplar cambios futuros de las circunstancias. Tras el primer lanzamiento antes del siguiente descanso largo, cada uso adicional suma un 25 % acumulativo de probabilidad de lectura aleatoria; el DM lo determina en secreto.'},
 {n:'Dream',l:5,school:'Ilusión',casting_time:'1 minuto',range:'Especial (mismo plano)',components:'V, S, M (arena, tinta y pluma de un ave dormida)',duration:'8 horas',concentration:false,description:'El lanzador o un mensajero voluntario tocado entra en trance y contacta en sueños a una criatura conocida que duerma en su mismo plano (no sirve con criaturas que no duermen). El mensajero puede conversar y modificar el entorno del sueño; no puede actuar ni desplazarse mientras está en trance. Opcionalmente adopta una forma terrorífica y transmite hasta diez palabras: el objetivo supera salvación de SAB o su descanso no le beneficia y recibe 3d6 psíquico al despertar. Si posees una parte corporal del objetivo, su salvación tiene desventaja.'},
 {n:'Gaseous Form',l:3,school:'Transmutación',casting_time:'1 acción',range:'Toque',components:'V, S, M (gasa y una voluta de humo)',duration:'Concentración, hasta 1 hora',concentration:true,description:'Una criatura voluntaria tocada, con objetos vestidos y transportados, se vuelve una nube. Termina al caer a 0 HP; no afecta a incorpóreos. Tiene vuelo de 10 pies como único desplazamiento; puede ocupar espacios de otras criaturas, atravesar grietas y huecos pequeños, pero no líquidos como superficies libres. Obtiene resistencia al daño no mágico y ventaja en salvaciones de FUE, DES y CON. No puede hablar, manipular objetos, atacar ni lanzar conjuros.'},
 {n:"Melf's Acid Arrow",l:2,school:'Evocación',casting_time:'1 acción',range:'90 pies',components:'V, S, M (ruibarbo pulverizado y estómago de víbora)',duration:'Instantánea',concentration:false,description:'Ataque de conjuro a distancia contra un objetivo. Impacto: 4d4 de ácido inmediatamente y 2d4 de ácido al final del siguiente turno del objetivo. Fallo: mitad del daño inicial, sin daño posterior. Espacio de nivel 3 o superior: +1d4 al daño inicial y +1d4 al daño posterior por cada nivel por encima de 2.',damage:'4d4 ácido inicial y 2d4 ácido posterior (impacto)',attack_type:'Ataque de conjuro a distancia'},
 {n:'Passwall',l:5,school:'Transmutación',casting_time:'1 acción',range:'30 pies',components:'V, S, M (semillas de sésamo)',duration:'1 hora',concentration:false,description:'Abre un pasaje temporal en una superficie visible de madera, yeso o piedra. Puedes establecer medidas de hasta 5 pies de ancho, 8 pies de alto y 20 pies de profundidad. No desestabiliza la estructura. Cuando desaparece, las criaturas u objetos que estén dentro son expulsados sin daño al espacio libre más cercano a la superficie.'},
 {n:'Silence',l:2,school:'Ilusión',casting_time:'1 acción (ritual posible)',range:'120 pies',components:'V, S',duration:'Concentración, hasta 10 minutos',concentration:true,description:'En una esfera de radio 20 pies centrada en un punto elegido no se puede crear sonido ni pasar sonido. Las criaturas completamente dentro quedan ensordecidas; ninguna criatura puede lanzar allí un conjuro que requiera componente verbal. Las criaturas y objetos dentro de la esfera son inmunes al daño de trueno.'},
 {n:'Spider Climb',l:2,school:'Transmutación',casting_time:'1 acción',range:'Toque',components:'V, S, M (una gota de betún y una araña)',duration:'Concentración, hasta 1 hora',concentration:true,description:'Una criatura voluntaria tocada puede moverse por muros y techos incluso boca abajo sin usar las manos, y obtiene velocidad de trepar igual a su velocidad al caminar.'},
 {n:'Stinking Cloud',l:3,school:'Conjuración',casting_time:'1 acción',range:'90 pies',components:'V, S, M (huevo podrido u hojas de col mofeta)',duration:'Concentración, hasta 1 minuto',concentration:true,description:'Crea una nube de gas de radio 20 pies que dobla esquinas y oscurece intensamente el área. Una criatura completamente dentro al inicio de su turno hace salvación de CON contra veneno: si falla pierde su acción ese turno por arcadas. Inmunidad a veneno o no necesitar respirar concede éxito automático. Viento moderado (10 mph) la disipa tras 4 asaltos; viento fuerte (20 mph) tras 1 asalto.'}
].map(s=>({...s,classes:[],source:'PHB 2014 · Conjuros del Círculo de la Tierra',edition:'5e-2014',fromHandbook:true,verification:{status:'metadata_and_mechanics_reviewed',scope:'PHB 2014; sin reproducir texto editorial literalmente'}}));
const already=new Set((window.DMA_DRUID_SPELLS_1189||[]).map(s=>String(s.n).toLowerCase()));
window.DMA_DRUID_SPELLS_1189=window.DMA_DRUID_SPELLS_1189||[];
for(const s of SUPPLEMENT)if(!already.has(s.n.toLowerCase()))window.DMA_DRUID_SPELLS_1189.push(s);

const clean=s=>String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');
const html=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const lvls=[3,5,7,9];
function row(i){const cs=profile(i)?.classes||[];return cs.find(c=>c.name==='Druida'&&Number(c.level)>=2&&/land|tierra/i.test(String(c.sub||'')))||null}
function stateFor(i){const sh=profile(i);if(!sh.dmaLand11917||typeof sh.dmaLand11917!=='object')sh.dmaLand11917={terrain:'',cantrip:''};const d=sh.dmaLand11917;
 // Existing 1.19.16 terrain registry: migrate without changing the character.
 const old=sh.featureChoices1161?.['Druida:landTerrain'];
 if(!d.terrain&&TERRAIN[old])d.terrain=old;
 if(!TERRAIN[d.terrain])d.terrain='';
 d.cantrip=String(d.cantrip||'');return d}
function granted(i){const c=row(i),d=c?stateFor(i):null;if(!d||!TERRAIN[d.terrain])return [];
 return TERRAIN[d.terrain].groups.flatMap((names,j)=>Number(c.level)>=lvls[j]?names:[])}
function bonus(i){const c=row(i),d=c?stateFor(i):null;return c&&d?.cantrip?[d.cantrip]:[]}
function maxRecovery(i){const c=row(i);return c?Math.ceil(Number(c.level)/2):0}
function recState(i){const sh=profile(i);if(!sh.dmaLandRecovery11917||typeof sh.dmaLandRecovery11917!=='object')sh.dmaLandRecovery11917={spent:false};return sh.dmaLandRecovery11917}
function cantrips(){const source=window.DMA_DRUID_SPELLS_1189||[];return [...new Set(source.filter(s=>Number(s.l)===0&&Array.isArray(s.classes)&&s.classes.includes('Druida')&&!/2024/i.test(String(s.source||''))).map(s=>s.n))].sort((a,b)=>a.localeCompare(b));}
function setting(i,key,value){if(!row(i))return;const d=stateFor(i),sh=profile(i);
 if(key==='terrain'){
  if(value&&!TERRAIN[value])return;
  if(d.terrain&&d.terrain!==value&&!confirm('¿Cambiar el terreno del Círculo de la Tierra? Los conjuros concedidos automáticamente se actualizarán. Hazlo solo con autorización del DM.'))return;
  d.terrain=value;
  sh.featureChoices1161=sh.featureChoices1161||{};
  sh.featureChoices1161['Druida:landTerrain']=value; // compatibility with previous versions
 }else if(key==='cantrip'){
  if(value&&!cantrips().some(x=>clean(x)===clean(value)))return;
  const normal=sh.dmaMagic1185?.cantrips||[];
  if(value&&normal.some(n=>clean(n)===clean(value)))return alert('Ese truco ya es conocido normalmente. Elige otro para el beneficio adicional del círculo.');
  d.cantrip=value;
 }else return;
 window.DMAmagic1185?.syncGranted?.(i);
 save();renderSheets(); // Keep combat render separate from editing; no scroll jump.
}
function notes(i){const c=row(i),d=stateFor(i),chosen=granted(i);if(!c)return '';
 const terr=TERRAIN[d.terrain];const byLevel=terr?terr.groups.map((spells,j)=>`<div class="dma-land-spell-group"><b>Druida ${lvls[j]}</b><span>${spells.map(html).join(' · ')}</span><small>${Number(c.level)>=lvls[j]?'Siempre preparados':'Se desbloquean en nivel '+lvls[j]}</small></div>`).join(''):'';
 const known=cantrips();return `<div class="dma-land-sheet11917"><h5>🌱 Círculo de la Tierra · Elecciones (PHB 2014)</h5>
 <label>Terreno de origen<select data-land-choice="terrain" data-land-player="${i}" aria-label="Terreno del Círculo de la Tierra"><option value="">Elegir terreno…</option>${Object.entries(TERRAIN).map(([key,v])=>`<option value="${key}" ${d.terrain===key?'selected':''}>${html(v.es)} · ${key}</option>`).join('')}</select></label>
 <label>Truco adicional del círculo<select data-land-choice="cantrip" data-land-player="${i}" aria-label="Truco adicional del Círculo de la Tierra"><option value="">Elegir truco…</option>${known.map(n=>`<option value="${html(n)}" ${clean(d.cantrip)===clean(n)?'selected':''}>${html(n)}</option>`).join('')}</select></label>
 <p class="dma-land-note11917">El truco adicional no ocupa cupo. Los conjuros del terreno quedan siempre preparados desde los niveles indicados y no cuentan entre tus conjuros preparados normales.</p>
 ${terr?`<div class="dma-land-spell-grid">${byLevel}</div>`:'<p class="dma-land-warning">Falta elegir terreno. No se pueden conceder conjuros de círculo hasta resolver esta elección.</p>'}
 ${!d.cantrip?'<p class="dma-land-warning">Falta elegir el truco adicional concedido en nivel 2.</p>':''}
 <p class="dma-land-note11917"><b>Natural Recovery:</b> durante un descanso corto puedes recuperar espacios gastados por una suma de niveles de hasta ${maxRecovery(i)}; ninguno puede ser de nivel 6 o superior. Una vez por descanso largo. El botón de recuperación se encuentra en combate.</p></div>`}
function injectSheets(){const root=document.getElementById('sheetsplayers');if(!root)return;
 root.querySelectorAll('article.sheet').forEach(card=>{
  const identifier=card.querySelector('[onchange*="setPlayerName("]')?.getAttribute('onchange')||'';
  const m=identifier.match(/setPlayerName\((\d+)/);
  if(!m)return;const i=Number(m[1]);if(!state.players[i]||!row(i))return;
  const target=card.querySelector('.dma-features-1110');if(!target||target.querySelector('.dma-land-sheet11917'))return;
  target.insertAdjacentHTML('afterbegin',notes(i));
 });
}
function status(i){const s=recState(i),n=maxRecovery(i);return `<div class="dma-land-combat11917" data-land-combat="${i}"><div class="dma-land-combat-top"><b>🌱 Natural Recovery</b><span>${s.spent?'Utilizada hasta próximo descanso largo':'Disponible'} · ${n} nivel(es) de espacios recuperables</span></div><p>Durante un descanso corto, selecciona espacios gastados para recuperar. La suma de niveles no puede superar ${n} y no pueden recuperarse espacios de nivel 6 o superior.</p>${s.spent?'<small>Esta capacidad ya se utilizó. Se restablece en descanso largo.</small>':recoveryForm(i)}</div>`}
function recoveryForm(i){const sh=profile(i);const totals=sh.slots||slotCalc(i).slots||[];const spent=sh.used||[];
 const levels=[1,2,3,4,5].filter(n=>Number(spent[n-1])>0&&Number(totals[n-1])>0);
 if(!levels.length)return '<small>No tienes espacios de nivel 1–5 gastados que recuperar.</small>';
 return `<div class="dma-land-recovery-fields11917">${levels.map(n=>`<label>Nivel ${n}<span>Gastados: ${Math.min(Number(spent[n-1]),Number(totals[n-1]))}</span><input type="number" min="0" max="${Math.min(Number(spent[n-1]),Number(totals[n-1]))}" step="1" value="0" data-land-recover-level="${n}" data-land-recover-player="${i}"></label>`).join('')}</div><div class="dma-land-recovery-actions11917"><strong data-land-budget="${i}">0 / ${maxRecovery(i)} niveles elegidos</strong><button type="button" data-land-confirm="${i}" disabled>Recuperar espacios</button></div>`}
function refreshBudget(i){const form=document.querySelector(`[data-land-combat="${i}"]`);if(!form)return;const total=[...form.querySelectorAll('[data-land-recover-level]')].reduce((sum,el)=>sum+Number(el.dataset.landRecoverLevel)*Number(el.value||0),0);
 const available=maxRecovery(i),valid=total>0&&total<=available&&[...form.querySelectorAll('[data-land-recover-level]')].every(el=>Number.isInteger(Number(el.value))&&Number(el.value)>=0&&Number(el.value)<=Number(el.max));
 const meter=form.querySelector(`[data-land-budget="${i}"]`);if(meter)meter.textContent=total+' / '+available+' niveles elegidos'+(total>available?' · excede el límite':'');
 const b=form.querySelector(`[data-land-confirm="${i}"]`);if(b)b.disabled=!valid;
}
function use(i){if(!row(i)||recState(i).spent)return;
 const form=document.querySelector(`[data-land-combat="${i}"]`);if(!form)return;
 const sh=profile(i),total=sh.slots||slotCalc(i).slots||[];const used=Array.isArray(sh.used)?sh.used:(sh.used=Array(9).fill(0));
 const picks=[...form.querySelectorAll('[data-land-recover-level]')].map(el=>[Number(el.dataset.landRecoverLevel),Number(el.value)]).filter(([,qty])=>qty>0);
 const cost=picks.reduce((v,[lvl,qty])=>v+lvl*qty,0);
 if(cost<1||cost>maxRecovery(i)||picks.some(([lvl,qty])=>lvl<1||lvl>5||!Number.isInteger(qty)||qty>Math.min(Number(used[lvl-1])||0,Number(total[lvl-1])||0)))return alert('Selección inválida: revisa el límite de recuperación y los espacios gastados.');
 if(!confirm('¿Registrar Natural Recovery tras un descanso corto? Solo puedes usarlo una vez hasta completar un descanso largo.'))return;
 picks.forEach(([lvl,qty])=>{used[lvl-1]=Math.max(0,Number(used[lvl-1])-qty)});recState(i).spent=true;
 save();render();renderSheets();
}
function injectCombat(panel,key){if(!String(key||'').startsWith('p'))return;const i=Number(key.slice(1));if(!state.players[i]||!row(i))return;
 const classPanel=panel.querySelector('.dma-four-class-11615');if(!classPanel)return;
 const base=classPanel.querySelector('.dma-combat-1121')||classPanel;
 if(base.querySelector('.dma-land-combat11917'))return;
 base.insertAdjacentHTML('beforeend',status(i));
}
const oldSheets=renderSheets;renderSheets=function(){oldSheets();injectSheets()};
const oldCombat=renderActivePlayerBlock;renderActivePlayerBlock=function(panel,key){oldCombat(panel,key);injectCombat(panel,key)};
document.addEventListener('change',e=>{const c=e.target.closest('[data-land-choice]');if(c){setting(Number(c.dataset.landPlayer),c.dataset.landChoice,c.value);return}
 if(e.target.matches('[data-land-recover-level]'))refreshBudget(Number(e.target.dataset.landRecoverPlayer));});
document.addEventListener('input',e=>{if(e.target.matches('[data-land-recover-level]'))refreshBudget(Number(e.target.dataset.landRecoverPlayer));});
document.addEventListener('click',e=>{const b=e.target.closest('[data-land-confirm]');if(b){e.preventDefault();use(Number(b.dataset.landConfirm));}});
window.DMALand11917={TERRAIN,row,stateFor,granted,bonus,maxRecovery,recState,setting,use,injectSheets,injectCombat};
})();
