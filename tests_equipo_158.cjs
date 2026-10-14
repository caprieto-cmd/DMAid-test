const assert=require('node:assert/strict');
const GEAR_V130={
 'Bárbaro':{choices:[[['Hacha a dos manos'],['Arma marcial cuerpo a cuerpo (a elegir)']],[['Dos hachas de mano'],['Arma sencilla (a elegir)']]],fixed:[['Jabalina',4],'Paquete de explorador']},
 'Bardo':{choices:[[['Estoque'],['Espada larga'],['Arma sencilla (a elegir)']],[['Paquete de diplomático'],['Paquete de artista']],[['Laúd'],['Instrumento musical (a elegir)']]],fixed:[['Armadura de cuero',1],['Daga',1]]},
 'Clérigo':{choices:[[['Maza'],['Martillo de guerra (si competente)']],[['Cota de escamas'],['Armadura de cuero'],['Cota de malla (si competente)']],[['Ballesta ligera',1],['Virote',20],['Arma sencilla (a elegir)']],[['Paquete de sacerdote'],['Paquete de explorador']]],fixed:[['Escudo',1],['Símbolo sagrado',1]]},
 'Druida':{choices:[[['Escudo de madera'],['Arma sencilla (a elegir)']],[['Cimitarra'],['Arma sencilla cuerpo a cuerpo (a elegir)']]],fixed:[['Armadura de cuero',1],'Paquete de explorador',['Foco druídico',1]]},
 'Guerrero':{choices:[ [ [['Cota de malla',1]], [['Armadura de cuero',1],['Arco largo',1],['Flecha',20]] ], [ [['Arma marcial (a elegir)',1],['Escudo',1]], [['Arma marcial (a elegir)',2]] ], [ [['Ballesta ligera',1],['Virote',20]], [['Hacha de mano',2]] ], [ ['Paquete de aventurero'], ['Paquete de explorador'] ] ],fixed:[]},
 'Monje':{choices:[[['Espada corta'],['Arma sencilla (a elegir)']],[['Paquete de aventurero'],['Paquete de explorador']]],fixed:[['Dardo',10]]},
 'Paladín':{choices:[ [ [['Arma marcial (a elegir)',1],['Escudo',1]], [['Arma marcial (a elegir)',2]] ], [ [['Jabalina',5]], [['Arma sencilla cuerpo a cuerpo (a elegir)',1]] ], [ ['Paquete de sacerdote'], ['Paquete de explorador'] ] ],fixed:[['Cota de malla',1],['Símbolo sagrado',1]]},
 'Explorador':{choices:[[['Cota de escamas'],['Armadura de cuero']],[['Espada corta',2],['Arma sencilla cuerpo a cuerpo (a elegir)',2]],[['Paquete de aventurero'],['Paquete de explorador']]],fixed:[['Arco largo',1],['Flecha',20]]},
 'Pícaro':{choices:[[['Estoque'],['Espada corta']],[['Arco corto',1],['Flecha',20],['Espada corta',1]],[['Paquete de aventurero'],['Paquete de explorador'],['Paquete de ladrón']]],fixed:[['Armadura de cuero',1],['Daga',2],['Herramientas de ladrón',1]]},
 'Hechicero':{choices:[[['Ballesta ligera',1],['Virote',20]],[['Arma sencilla (a elegir)']],[['Bolsa de componentes'],['Foco arcano']],[['Paquete de aventurero'],['Paquete de explorador']]],fixed:[['Daga',2]]},
 'Brujo':{choices:[[['Ballesta ligera',1],['Virote',20]],[['Arma sencilla (a elegir)']],[['Bolsa de componentes'],['Foco arcano']],[['Paquete de erudito'],['Paquete de explorador']]],fixed:[['Armadura de cuero',1],['Arma sencilla (a elegir)',1],['Daga',2]]},
 'Mago':{choices:[[['Bastón'],['Daga']],[['Bolsa de componentes'],['Foco arcano']],[['Paquete de erudito'],['Paquete de explorador']]],fixed:[['Libro de conjuros',1]]}
};

// Normalización de grupos de elección: cada alternativa es una lista de artículos.
GEAR_V130['Bárbaro'].choices=[[[['Hacha a dos manos',1]],[['Arma marcial cuerpo a cuerpo (a elegir)',1]]],[[['Hacha de mano',2]],[['Arma sencilla (a elegir)',1]]]];
GEAR_V130['Clérigo'].choices=[[[['Maza',1]],[['Martillo de guerra (si competente)',1]]],[[['Cota de escamas',1]],[['Armadura de cuero',1]],[['Cota de malla (si competente)',1]]],[[['Ballesta ligera',1],['Virote',20]],[['Arma sencilla (a elegir)',1]]],[['Paquete de sacerdote'],['Paquete de explorador']]];
GEAR_V130['Pícaro'].choices=[[[['Estoque',1]],[['Espada corta',1]]],[[['Arco corto',1],['Flecha',20]],[['Espada corta',1]]],[['Paquete de aventurero'],['Paquete de explorador'],['Paquete de ladrón']]];
GEAR_V130['Hechicero'].choices=[[[['Ballesta ligera',1],['Virote',20]],[['Arma sencilla (a elegir)',1]]],[[['Bolsa de componentes',1]],[['Foco arcano',1]]],[['Paquete de aventurero'],['Paquete de explorador']]];
GEAR_V130['Brujo'].choices=[[[['Ballesta ligera',1],['Virote',20]],[['Arma sencilla (a elegir)',1]]],[[['Bolsa de componentes',1]],[['Foco arcano',1]]],[['Paquete de erudito'],['Paquete de explorador']]];
GEAR_V130['Druida'].choices=[[[['Escudo de madera',1]],[['Arma sencilla (a elegir)',1]]],[[['Cimitarra',1]],[['Arma sencilla cuerpo a cuerpo (a elegir)',1]]]];
GEAR_V130['Explorador'].choices=[[[['Cota de escamas',1]],[['Armadura de cuero',1]]],[[['Espada corta',2]],[['Arma sencilla cuerpo a cuerpo (a elegir)',2]]],[['Paquete de aventurero'],['Paquete de explorador']]];
GEAR_V130['Monje'].choices=[[[['Espada corta',1]],[['Arma sencilla (a elegir)',1]]],[['Paquete de aventurero'],['Paquete de explorador']]];
GEAR_V130['Mago'].choices=[[[['Bastón',1]],[['Daga',1]]],[[['Bolsa de componentes',1]],[['Foco arcano',1]]],[['Paquete de erudito'],['Paquete de explorador']]];
GEAR_V130['Bardo'].choices=[[[['Estoque',1]],[['Espada larga',1]],[['Arma sencilla (a elegir)',1]]],[['Paquete de diplomático'],['Paquete de artista']],[ [['Laúd',1]],[['Instrumento musical (a elegir)',1]] ]];

/* v1.5.8: una alternativa del PHB siempre es una lista completa de objetos.
   No separar las municiones de la ballesta ni las flechas del arco. */
const GEAR_BUNDLES_V158={
 'Clérigo':{2:[[['Ballesta ligera',1],['Virote',20]],[['Arma sencilla (a elegir)',1]]]},
 'Pícaro':{1:[[['Arco corto',1],['Flecha',20]],[['Espada corta',1]]]},
 'Hechicero':{0:[[['Ballesta ligera',1],['Virote',20]],[['Arma sencilla (a elegir)',1]]]},
 'Brujo':{0:[[['Ballesta ligera',1],['Virote',20]],[['Arma sencilla (a elegir)',1]]]},
 'Guerrero':{2:[[['Ballesta ligera',1],['Virote',20]],[['Hacha de mano',2]]]},
};
for(const [cls,slots] of Object.entries(GEAR_BUNDLES_V158)){
 for(const [ix,options] of Object.entries(slots))GEAR_V130[cls].choices[Number(ix)]=options;
}
// Normaliza también las elecciones de paquetes que las versiones previas guardaban como texto.
for(const config of Object.values(GEAR_V130)){
 config.choices=(config.choices||[]).map(options=>options.map(option=>option.map(item=>typeof item==='string'?[item,1]:item)));
}
function gearBundleAuditV158(){
 const issues=[];
 for(const [cls,config] of Object.entries(GEAR_V130)){
  for(const [i,opts] of (config.choices||[]).entries()){
   if(!Array.isArray(opts)||opts.length<2){issues.push(`${cls}: elección ${i+1} sin alternativas`);continue;}
   for(const [j,option] of opts.entries()){
    if(!Array.isArray(option)||!option.length||option.some(it=>!Array.isArray(it)||typeof it[0]!=='string'||!it[0].trim()||!Number.isInteger(Number(it[1]??1))||Number(it[1]??1)<1))issues.push(`${cls}: alternativa ${i+1}${String.fromCharCode(65+j)} inválida`);
    for(const [weapon,ammo] of [['Ballesta ligera','Virote'],['Arco corto','Flecha'],['Arco largo','Flecha']]){
     if(option.some(it=>it[0]===weapon)&&!option.some(it=>it[0]===ammo))issues.push(`${cls}: ${weapon} sin ${ammo} en ${i+1}${String.fromCharCode(65+j)}`);
    }
   }
  }
 }
 return issues;
}


const audit=gearBundleAuditV158();assert.deepEqual(audit,[],audit.join('\n'));
const expected={
 'Clérigo': [2,0,'Ballesta ligera','Virote',20],
 'Pícaro': [1,0,'Arco corto','Flecha',20],
 'Hechicero': [0,0,'Ballesta ligera','Virote',20],
 'Brujo': [0,0,'Ballesta ligera','Virote',20],
 'Guerrero': [2,0,'Ballesta ligera','Virote',20],
};
for(const [cls,[i,j,weapon,ammo,qty]] of Object.entries(expected)){
 const option=GEAR_V130[cls].choices[i][j];
 assert(option.some(r=>r[0]===weapon));assert(option.some(r=>r[0]===ammo&&r[1]===qty));
}
assert.equal(Object.keys(GEAR_V130).length,12);
// A choice must include exactly its items, and switching alternatives must not leak ammo.
for(const [cls,[i]] of Object.entries(expected)){
 const opts=GEAR_V130[cls].choices[i];
 assert(opts[0].length===2);assert.equal(opts[1].some(r=>r[0]==='Virote'||r[0]==='Flecha'),false);
}
console.log('PASS: 12 clases auditadas; 5 bundles de arma+munición; alternativas aisladas.');
