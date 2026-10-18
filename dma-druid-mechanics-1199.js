/* DMAid 1.19.9: mechanics lookup, never roll or spend resources automatically. */
(function(){'use strict';
const spells=()=>Array.isArray(window.DMA_DRUID_SPELLS_1189)?window.DMA_DRUID_SPELLS_1189:[];
const key=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');
const getSpell=name=>spells().find(s=>key(s.n)===key(name))||null;
function wildShapeLimits(druidLevel,subclass){
 const n=Math.max(0,Math.floor(Number(druidLevel)||0));
 const moon=/moon|luna/i.test(subclass||'');
 if(n<2)return {available:false,uses:0,crMax:0,allowSwim:false,allowFly:false};
 const max=moon?(n<6?1:Math.floor(n/3)):(n<4?0.25:n<8?0.5:1);
 return {available:true,uses:n>=20?Infinity:2,crMax:max,allowSwim:n>=4,allowFly:n>=8,durationHours:Math.floor(n/2),activation:moon?'bonus_action':'action',source:'PHB 2014'};
}
function asNumberCR(v){if(typeof v==='number')return v;const t=String(v??'').trim();if(!t)return null;const m=t.match(/(?:^|\s)(\d+)\s*\/\s*(\d+)(?:$|\s)/);if(m)return +m[1]/+m[2];const n=Number(t.replace(',','.'));return Number.isFinite(n)?n:null}
function beastCandidates(monsters,druidLevel,subclass){const lim=wildShapeLimits(druidLevel,subclass);if(!lim.available)return [];return (Array.isArray(monsters)?monsters:[]).filter(b=>{const ty=String(b.type||b.creatureType||b.monster_type||'').toLowerCase();const cr=asNumberCR(b.cr??b.challenge_rating??b.challengeRating);if(!/(beast|bestia)/.test(ty)||cr===null||cr>lim.crMax)return false;const fly=Number(b.flySpeed||b.fly_speed)||/(fly|vuelo)\s*\d+/i.test(String(b.speed||''));const swim=Number(b.swimSpeed||b.swim_speed)||/(swim|nado)\s*\d+/i.test(String(b.speed||''));return (lim.allowFly||!fly)&&(lim.allowSwim||!swim)}).map(b=>({monster:b,requiresDMSeenCheck:true}));}
window.DMADruidRules1199=Object.freeze({getSpell,wildShapeLimits,beastCandidates,asNumberCR,summonOptions:name=>getSpell(name)?.summon||null});
})();
