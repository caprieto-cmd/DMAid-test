const assert=require('assert');
let current=[];global.dmaArmorer1161=i=> i===0?{level:8}:null;
global.invV19=i=>current;
global.itemInfoV19=r=>({slot:r.slot,ac:r.ac});
function dmaArmorEnabled1161(i){
 // Use the same normalized armor identity as the inventory/AC calculation.
 // Armor may be stored as LA/MA/HA, an English/Spanish equipment name, or
 // a magic armor item with inherited armor category. Clothing and shields
 // are never considered Arcane Armor.
 if(!dmaArmorer1161(i))return false;
 return invV19(i).some(row=>{
   if(!row||!row.equipped)return false;
   const name=String(row.name||'').trim();
   if(/^(?:common clothes|fine clothes|traveler'?s clothes|simple clothes|clothes|costume|vestments|ropajes|ropa|vestiduras|atuendo)(?:\b|$)/i.test(name))return false;
   const detail=itemInfoV19(row);
   return ['light','medium','heavy','armor'].includes(String(detail?.slot||'').toLowerCase())
     && detail?.ac!=null && Number.isFinite(Number(detail.ac));
 });
}
function check(label,rows,result,i=0){current=rows;assert.strictEqual(dmaArmorEnabled1161(i),result,label);console.log('OK '+label)}
check('armadura ligera con tipo normalizado',[{name:'Leather Armor',equipped:true,slot:'light',ac:11}],true);
check('armadura media',[{name:'Breastplate',equipped:true,slot:'medium',ac:14}],true);
check('armadura pesada',[{name:'Plate',equipped:true,slot:'heavy',ac:18}],true);
check('armadura no equipada',[{name:'Plate',equipped:false,slot:'heavy',ac:18}],false);
check('ropajes simples',[{name:'Ropajes sencillos',equipped:true,slot:'armor',ac:10}],false);
check('escudo',[{name:'Shield',equipped:true,slot:'shield',ac:2}],false);
check('sin CA reconocida',[{name:'Armadura desconocida',equipped:true,slot:'armor',ac:null}],false);
check('personaje sin Armorer',[{name:'Plate',equipped:true,slot:'heavy',ac:18}],false,1);
