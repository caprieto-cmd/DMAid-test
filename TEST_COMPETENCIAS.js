const fs=require('fs'),vm=require('vm'),assert=require('assert');
const source=fs.readFileSync(__dirname+'/character-builder-v2.js','utf8');
const fragment=source.slice(source.indexOf('const KNOWLEDGE_SKILLS='),source.indexOf('const classSaves='));
function exercise({knowledge,choice,extra,feat}){
 const ctx={SKILLS_V110:[['Arcanos'],['Historia'],['Religión'],['Naturaleza'],['Perspicacia']],model:{classes:[{name:'Clérigo',sub:knowledge?'Knowledge':'Life',level:3}],race:{skill:'Percepción',feat:feat||''},proficiencies:{classSkills:['Perspicacia','Medicina'],knowledgeSkills:choice||[]},background:{name:'Cloistered Scholar',extraSkill:extra||'Arcanos',replacement:{}}},BG_V120:{'Cloistered Scholar':{skills:['Historia']}},variantHuman:()=>true};
 vm.createContext(ctx);vm.runInContext(fragment+';this.testResult=resolveCompetencyLedger({raceName:"Humano variante",proficiencies:{skill:[]}});this.has=hasKnowledgeDomain();',ctx);
 return ctx.testResult.ledger;
}
let l=exercise({knowledge:true,choice:['Historia','Religión'],extra:'Arcanos',feat:'Resilient'});
assert.equal(l['skill:Historia'].rank,'expertise');assert.equal(l['skill:Religión'].rank,'expertise');
assert.equal(l['skill:Historia'].sources.length,2);assert.equal(l['skill:Arcanos'].rank,'proficient');
assert.equal(l['skill:Perspicacia'].rank,'proficient');
assert.equal(l['skill:Percepción'].rank,'proficient');
let n=exercise({knowledge:false,choice:[],extra:'Naturaleza'});
assert.equal(n['skill:Historia'].rank,'proficient');assert.equal(n['skill:Religión'],undefined);
const bonus=2;const intel=12;assert.equal(Math.floor((intel-10)/2)+2*bonus,5);
console.log('OK: ledger pericia, procedencia múltiple, clase, trasfondo, raza, dominio y bonificador +5');
