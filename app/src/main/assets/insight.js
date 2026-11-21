(function(){
if (window.ShowdownInsight) { window.ShowdownInsight.refresh(); return; }
const style=document.createElement('style'); style.textContent=`
#si-panel{position:fixed;z-index:2147483646;left:8px;right:8px;bottom:8px;max-height:52vh;overflow:auto;background:#101827;color:#f1f5f9;border:1px solid #526176;border-radius:13px;box-shadow:0 8px 30px #000a;font:13px system-ui;padding:12px;display:none}
#si-panel button{background:#304c76;color:white;border:0;border-radius:6px;padding:6px;margin:3px}
#si-panel .si-muted{color:#b4c3d7;font-size:11px}#si-panel .si-move{border-top:1px solid #344055;padding:8px 0}
`; document.head.appendChild(style);
const panel=document.createElement('section'); panel.id='si-panel'; panel.innerHTML='<b>Showdown Insight · Gen 9 Random</b><button id="si-close">Close</button><div id="si-body">Open a battle to see available moves.</div>';
document.body.appendChild(panel);
panel.querySelector('#si-close').onclick=()=>panel.style.display='none';
function text(el){return (el?.textContent||'').trim()}
function activeBattle(){return [...document.querySelectorAll('.battle-room,.ps-room')].find(el=>el.querySelector('.battle,.battle-controls,.movemenu'))}
function getMoves(room){
 const buttons=[...room.querySelectorAll('.movemenu button, .movemenu .button, button[name="chooseMove"]')];
 return buttons.map((b,i)=>({name:(b.getAttribute('data-move')||text(b.querySelector('.movename'))||text(b).split('\n')[0]).trim(),disabled:b.disabled||b.classList.contains('disabled'),index:i})).filter(x=>x.name);
}
function analyze(name){
 // Use Showdown's own publicly loaded move data if available; no hidden data or battle requests are intercepted.
 try {let m=window.Dex?.moves?.get?.(name)||window.Dex?.getMove?.(name); if(m?.exists||m?.basePower) return {power:m.basePower||0,type:m.type||'?',accuracy:typeof m.accuracy==='number'?m.accuracy:100,category:m.category||'?',priority:m.priority||0}; }catch(e){}
 return null;
}
function refresh(){
 const room=activeBattle(); const body=panel.querySelector('#si-body');
 if(!room){body.innerHTML='<p>Waiting for a battle. Start a Gen 9 Random Battle in this app.</p>';return;}
 const moves=getMoves(room);
 if(!moves.length){body.innerHTML='<p>Battle detected, but move buttons are not currently visible. Wait for your turn.</p>';return;}
 const ranked=moves.map(m=>({...m,info:analyze(m.name)}));
 ranked.sort((a,b)=>((b.info?.power||0)*(b.info?.accuracy||100)/100)-((a.info?.power||0)*(a.info?.accuracy||100)/100));
 body.replaceChildren();
 const info=document.createElement('p'); info.className='si-muted'; info.textContent='Live move list · preliminary raw-power ordering only. NOT a best-move prediction: no STAB, type matchup, abilities, items, or damage simulation yet.'; body.append(info);
 ranked.forEach((m,i)=>{let div=document.createElement('div');div.className='si-move';div.textContent=`${i+1}. ${m.name}${m.disabled?' (unavailable)':''} — ${m.info?`${m.info.type}, ${m.info.category}, ${m.info.power} BP, ${m.info.accuracy}% accuracy`:'move data unavailable'}`;body.append(div)});
}
window.ShowdownInsight={refresh,toggle(){panel.style.display=panel.style.display==='none'?'block':'none';refresh()}};
refresh();
})();
