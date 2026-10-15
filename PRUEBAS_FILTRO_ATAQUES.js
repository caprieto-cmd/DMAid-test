const assert=require('assert');
function itemInfoV19(row){return {slot:row.slot||''}}
function dmaIsArmorNotWeapon11713(row,detail){
 const info=typeof itemInfoV19==='function'?itemInfoV19(row):null;
 if(info&&['light','medium','heavy','armor','shield'].includes(String(info.slot||'').toLowerCase()))return true;
 const norm=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 const type=norm(detail?.type||row?.type);
 if(['la','ma','ha','s','armor','armour','armadura','shield','escudo','light armor','medium armor','heavy armor'].includes(type))return true;
 const names=[row?.name,detail?.name].map(norm);
 // Identificar piezas defensivas aun si llegaron como objeto personalizado o con metadatos incompletos.
 return names.some(n=>/\b(?:chain mail|chain shirt|plate armor|plate mail|half plate|breastplate|scale mail|ring mail|splint armor|leather armor|studded leather|padded armor|hide armor|shield|cota de malla|camisa de malla|armadura de|armadura acolchada|armadura de cuero|cuero tachonado|coraza|media armadura|escudo)\b/.test(n));
}
const cases=[
 [{name:'Cota de malla',slot:'armor'}, {}, true],
 [{name:'Chain Mail',slot:'heavy',damage:'1d6'}, {}, true],
 [{name:'Escudo',slot:'shield'}, {}, true],
 [{name:'Leather Armor',type:'LA'}, {}, true],
 [{name:'Cota de malla',type:'custom'}, {type:'weapon',dmg1:'1d8'}, true],
 [{name:'Mace',slot:'',damage:'1d6'}, {}, false],
 [{name:'Rapier',slot:'',damage:'1d8'}, {}, false],
 [{name:'Thunder Gauntlets',slot:''}, {}, false],
 [{name:'Lightning Launcher',slot:''}, {}, false],
];
for(const [row,detail,expected] of cases){assert.strictEqual(dmaIsArmorNotWeapon11713(row,detail),expected,row.name);console.log('OK',row.name)}
