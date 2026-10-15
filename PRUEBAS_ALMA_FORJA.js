const assert=require('node:assert/strict');
let current;
function profile(){return current.sheet;}
function equippedV19(){return current.gear.filter(x=>x.equipped);}
function itemInfoV19(r){return {slot:r.slot||'armor'};}
function itemDetailV19(r){return {type:r.type||'',name:r.name};}
function dmaForgeArmorName11715(v){return String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();}
function dmaHeavyEquipped11715(row){
 if(!row||!row.equipped)return false;
 const d=typeof itemInfoV19==='function'?itemInfoV19(row):{};
 const raw=typeof itemDetailV19==='function'?itemDetailV19(row):{};
 const type=String(raw?.type||row.type||'').toUpperCase();
 const slot=String(d?.slot||'').toLowerCase();
 if(slot==='shield'||['LA','MA','S'].includes(type))return false;
 if(slot==='heavy'||type==='HA')return true;
 const name=dmaForgeArmorName11715([row.name,raw?.name].filter(Boolean).join(' '));
 return /\b(chain mail|cota de malla|splint|armadura de bandas|armadura de placas|plate armor|plate mail|full plate|ring mail|cota de anillas)\b/.test(name);
}
function dmaForgeFeature11715(i){
 const sh=profile(i);
 const eligible=(sh.classes||[]).some(c=>{
  const name=dmaForgeArmorName11715(c.name);
  const sub=dmaForgeArmorName11715(c.sub||c.subclass||c.domain);
  return /^(clerigo|cleric)$/.test(name)&&Number(c.level)>=6&&/^(forge|forja|dominio de la forja|forge domain)$/.test(sub);
 });
 if(!eligible||!!sh.dmaWildShape1165?.active)return false;
 return (typeof equippedV19==='function'?equippedV19(i):[]).some(dmaHeavyEquipped11715);
}
const testCases=[
 ['Forja 8 + cota equipada',8,'Forja',[{name:'Cota de malla',slot:'armor',equipped:true}],true],
 ['Forja 8 + chain mail HA',8,'Forge',[{name:'Chain Mail',type:'HA',equipped:true}],true],
 ['Forja 6 + placas',6,'Forge',[{name:'Plate Armor',slot:'heavy',equipped:true}],true],
 ['Forja 5 + cota',5,'Forge',[{name:'Cota de malla',equipped:true}],false],
 ['Clerigo vida + cota',8,'Life',[{name:'Cota de malla',equipped:true}],false],
 ['Forja 8 + cota no equipada',8,'Forge',[{name:'Cota de malla',equipped:false}],false],
 ['Forja 8 + cuero',8,'Forge',[{name:'Leather Armor',type:'LA',equipped:true}],false],
 ['Forja 8 + escudo',8,'Forge',[{name:'Shield',type:'S',equipped:true}],false],
 ['Forja 8 + ropa',8,'Forge',[{name:'Common Clothes',slot:'',equipped:true}],false]
];
for (const [label,level,sub,gear,expected] of testCases){
 current={sheet:{classes:[{name:'Clérigo',level,sub}]},gear};
 assert.equal(dmaForgeFeature11715(0),expected,label);console.log('PASS',label);
}
current={sheet:{classes:[{name:'Clérigo',level:8,sub:'Forge'}],dmaWildShape1165:{active:true}},gear:[{name:'Cota de malla',equipped:true}]};
assert.equal(dmaForgeFeature11715(0),false);console.log('PASS wild shape');
let result={bonus:2};const base=()=>({...result});
function applyBonus(b){const r=base();if(b)r.bonus=(Number(r.bonus)||0)+1;return r;}
assert.equal(applyBonus(true).bonus,3);assert.equal(applyBonus(true).bonus,3);assert.equal(result.bonus,2);console.log('PASS no accumulation');
