/* DMAid 1.19.18. Traducción de reglas por bloque COMPLETO, no por sustitución de palabras.
   Una entrada sin traducción verificada se muestra ÍNTEGRA en el idioma de origen.
   No modifica valores originales guardados en el bestiario. */
(function(){'use strict';
const LABELS={
 'Lion':'León','Wolf':'Lobo','Dire Wolf':'Lobo terrible','Brown Bear':'Oso pardo',
 'Saber-Toothed Tiger':'Tigre dientes de sable','Tiger':'Tigre','Black Bear':'Oso negro',
 'Giant Spider':'Araña gigante','Giant Eagle':'Águila gigante','Giant Owl':'Búho gigante',
 'Bite':'Mordisco','Claw':'Garra','Claws':'Garras','Multiattack':'Ataque múltiple',
 'Keen Smell':'Olfato agudo','Pack Tactics':'Tácticas de manada',
 'Pounce':'Abalanzarse','Running Leap':'Salto con carrera',
 'Keen Hearing and Smell':'Oído y olfato agudos','Keen Hearing':'Oído agudo',
 'Keen Sight':'Vista aguda','Flyby':'Vuelo evasivo',
 'Spider Climb':'Trepar cual araña','Web Sense':'Sentido de telaraña',
 'Web Walker':'Caminar por telarañas','Charge':'Carga','Trampling Charge':'Carga arrolladora',
 'Rake':'Desgarrar','Rampage':'Frenesí','Hold Breath':'Contener la respiración',
 'Perception':'Percepción','Stealth':'Sigilo','Athletics':'Atletismo',
 'Acrobatics':'Acrobacias','Insight':'Perspicacia','Survival':'Supervivencia',
 'Arcana':'Arcanos','Investigation':'Investigación','Intimidation':'Intimidación',
 'beast':'Bestia','elemental':'Elemental'
};
const formatName=n=>LABELS[n]||n;
function tags(raw){return String(raw??'')
 .replace(/\{@atk\s+mw\}/gi,'Melee Weapon Attack:')
 .replace(/\{@atk\s+rw\}/gi,'Ranged Weapon Attack:')
 .replace(/\{@atk\s+mw,rw\}/gi,'Melee or Ranged Weapon Attack:')
 .replace(/\{@hit\s+([+-]?\d+)\}/gi,(_,x)=>`${Number(x)>=0?'+':''}${Number(x)}`)
 .replace(/\{@h\}/gi,'Hit:')
 .replace(/\{@(?:damage|dice|d20|dc)\s+([^}|]+)(?:\|[^}]*)?\}/gi,'$1')
 .replace(/\{@(?:condition|skill|sense|creature|action|item|spell)\s+([^}|]+)(?:\|([^}]*)\})?/gi,(_,v,display)=>display||v)
 .replace(/\{@\w+(?:\s+([^}|]+))?(?:\|[^}]*)?\}/g,(_,v)=>v||'')
 .replace(/<[^>]*>/g,'').trim();}
function rawText(value){if(value==null)return '';
 if(Array.isArray(value))return value.map(rawText).filter(Boolean).join(' ');
 if(typeof value==='object'){
  if(value.entries||value.entry)return rawText(value.entries||value.entry);
  return Object.values(value).map(rawText).join(' ');
 }
 return tags(value).replace(/\s+/g,' ').trim();}
const feat={
 'Lion':{
 'Keen Smell':'El león tiene ventaja en las pruebas de Sabiduría (Percepción) que dependan del olfato.',
 'Pack Tactics':'El león tiene ventaja en una tirada de ataque contra una criatura si al menos uno de sus aliados está a 5 pies o menos de ella y dicho aliado no está incapacitado.',
 'Pounce':'Si el león se mueve al menos 20 pies en línea recta hacia una criatura y, en ese mismo turno, la impacta con un ataque de garra, el objetivo debe superar una tirada de salvación de Fuerza CD 13 o quedar derribado. Si el objetivo está derribado, el león puede efectuar un ataque de mordisco contra él como acción adicional.',
 'Running Leap':'Si toma una carrera de al menos 10 pies, el león puede realizar un salto de longitud de hasta 25 pies.',
 'Bite':'Ataque de arma cuerpo a cuerpo: +5 al ataque, alcance de 5 pies, un objetivo. Impacto: 7 (1d8 + 3) de daño perforante.',
 'Claw':'Ataque de arma cuerpo a cuerpo: +5 al ataque, alcance de 5 pies, un objetivo. Impacto: 6 (1d6 + 3) de daño cortante.'
 }
};
const types={piercing:'perforante',slashing:'cortante',bludgeoning:'contundente',fire:'de fuego',cold:'de frío',acid:'de ácido',poison:'de veneno',necrotic:'necrótico',radiant:'radiante',lightning:'de relámpago',thunder:'de trueno',psychic:'psíquico',force:'de fuerza'};
function attackText(src){
 const pat=/^(Melee Weapon Attack|Ranged Weapon Attack|Melee or Ranged Weapon Attack):\s*([+\-]?\d+)\s+to hit,\s*(reach\s+\d+\s*ft\.|range\s+\d+(?:\/\d+)?\s*ft\.),?\s*(one target|one creature|one target or creature)\.\s*Hit:\s*(\d+)\s*\(([^)]+)\)\s+(\w+)\s+damage\.?$/i;
 const m=src.match(pat);if(!m||!types[m[7].toLowerCase()])return null;
 const atk={'Melee Weapon Attack':'Ataque de arma cuerpo a cuerpo','Ranged Weapon Attack':'Ataque de arma a distancia','Melee or Ranged Weapon Attack':'Ataque de arma cuerpo a cuerpo o a distancia'}[m[1]];
 const range=/reach/i.test(m[3])?`alcance de ${m[3].match(/\d+/)[0]} pies`:`alcance de ${m[3].match(/\d+(?:\/\d+)?/)[0]} pies`;
 return `${atk}: ${Number(m[2])>=0?'+':''}${Number(m[2])} al ataque, ${range}, un objetivo. Impacto: ${m[5]} (${m[6]}) de daño ${types[m[7].toLowerCase()]}.`;
}
function genericText(name,src){
 const atk=attackText(src);if(atk)return atk;
 if(name==='Keen Smell'&&/^The \w+ has advantage on Wisdom \(Perception\) checks that rely on smell\.$/i.test(src))return 'Tiene ventaja en las pruebas de Sabiduría (Percepción) basadas en el olfato.';
 if(name==='Pack Tactics'&&/has advantage on an attack roll against a creature if at least one of .* allies is within 5 feet of the creature and the ally isn.t incapacitated/i.test(src))return 'Tiene ventaja en las tiradas de ataque contra una criatura si al menos un aliado está a 5 pies o menos de ella y no está incapacitado.';
 if(name==='Keen Hearing and Smell'&&/has advantage on Wisdom \(Perception\) checks that rely on hearing or smell/i.test(src))return 'Tiene ventaja en las pruebas de Sabiduría (Percepción) que dependan del oído o del olfato.';
 return null;
}
function entry(monster,section,act){
 const name=String(act.name||section).trim();const src=rawText(act.entries||act.entry||act);
 const id=String(monster.name||'').trim();
 // Solo usar una traducción fija del león del MM 2014 si coinciden estadísticas.
 const confirmedLion=id==='Lion'&&Number(monster.ac)===12&&Number(monster.hp)===26&&Number(monster.cr)===1&&/^(MM|Monster Manual)$/i.test(String(monster.source||''));
 let t=confirmedLion?feat.Lion[name]:null;
 // Los ataques genéricos solo se traducen si el parser reconoce TODA la regla.
 if(!t)t=genericText(name,src);
 return {name:formatName(name),body:t||src,translated:!!t,original:src,languagePending:!t&&/\b(the|creature|attack|saving throw|damage|feet|hit points|must|can|has advantage|if)\b/i.test(src)};
}
function skillText(s){
 if(!s||typeof s!=='object'||Array.isArray(s))return String(s||'').replace(/\b(perception|stealth|athletics|acrobatics|insight|survival|arcana|investigation|intimidation)\s*:/gi,(v)=>formatName(v.slice(0,-1).trim().replace(/^./,c=>c.toUpperCase()))+':');
 return Object.entries(s).map(([key,val])=>`${formatName(key[0].toUpperCase()+key.slice(1))}: ${val}`).join(' · ');
}
window.DMABestiaryES11918={entry,formatName,rawText,skillText};
})();
