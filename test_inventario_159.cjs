const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const html=fs.readFileSync(__dirname+'/index.html','utf8');
const scripts=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
const script=scripts.find(s=>s.includes('DM.AID TEST 1.5.9: cada alternativa'));
assert(script,'No se encontró patch 1.5.9');
function simulate(raw,items=[]){const ctx={wizV110:{gearModeV130:'class'},ITEMS_V18:items,rawGearRowsV153:()=>raw.map(([name,quantity])=>({name,quantity})),equipmentRecordsV153:()=>raw.map(([name,quantity])=>({name,quantity,source:'Equipo inicial PHB 2014'})),console};vm.createContext(ctx);vm.runInContext(script,ctx);return ctx.equipmentRecordsV153();}
let rows=simulate([['Ballesta ligera',1],['Virote',20]]);
assert.equal(rows.length,2);assert.equal(rows[0].quantity,1);assert.equal(rows[1].quantity,20);assert.equal(rows[1].weaponAmmunition,'crossbow');
rows=simulate([['Arco corto',1],['Flecha',20]]);assert.equal(rows.length,2);assert.equal(rows[1].quantity,20);
const items=[{name:'Light Crossbow',source:'PHB',type:'R',dmg1:'1d8',property:['A','LD']},{name:'Crossbow Bolts',source:'PHB',type:'A',weight:0.075,entries:['Ammunition']}];
rows=simulate([['Ballesta ligera',1],['Virote',20]],items);
assert.equal(rows[0].name,'Light Crossbow');assert.equal(rows[0].dmg1,'1d8');assert.equal(rows[0].libraryLinkedV153,true);
assert.equal(rows[1].name,'Crossbow Bolts');assert.equal(rows[1].quantity,20);assert.equal(rows[1].libraryLinkedV153,true);
rows=simulate([['Paquete de explorador',1]]);assert.equal(rows.length,1);
console.log('PASS: pares por separado, cantidades, alias del catálogo, estadísticas, sin importar catálogo y paquete intacto');
