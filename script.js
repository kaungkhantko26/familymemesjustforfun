/* =========================
   script.js — Full Version
   ========================= */

   const THEME_KEY = 'family_hub_halloween';
   const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
   
   /* --- Tiny DOM helpers --- */
   const q = (sel, ctx = document) => (ctx || document).querySelector(sel);
   const qAll = (sel, ctx = document) => Array.from((ctx || document).querySelectorAll(sel));
   const create = (tag, props = {}, children = []) => {
     const el = document.createElement(tag);
     Object.entries(props).forEach(([k,v])=>{
       if(k==='class') el.className=v;
       else if(k==='text') el.textContent=v;
       else if(k==='html') el.innerHTML=v;
       else el.setAttribute(k,String(v));
     });
     if(!Array.isArray(children)) children=[children];
     children.forEach(c=>{
       if(typeof c==='string') el.appendChild(document.createTextNode(c));
       else if(c) el.appendChild(c);
     });
     return el;
   };
   
   /* --- Halloween decorations --- */
   function makeDecorFragment(){
     const frag=document.createDocumentFragment();
     const decor=create('div',{class:'halloween-decor','aria-hidden':'true'});
     ['f1','f2','f3','f4','f5'].forEach(f=>{
       const el=create('div',{class:`float ${f}`});
       el.textContent='';
       decor.appendChild(el);
     });
     frag.appendChild(decor);
   
     const falling=create('div',{class:'falling','aria-hidden':'true'});
     ['l1','l2','l3','l4','l5','l6'].forEach(l=>{
       const el=create('div',{class:`leaf ${l}`});
       el.textContent=['🍁','🍂','🍁','🍂','🍂','🍂'][parseInt(l.slice(1))-1];
       falling.appendChild(el);
     });
     frag.appendChild(falling);
     return frag;
   }
   
   /* --- CSS variable helpers --- */
   function setRootVars(vars={}){const root=document.documentElement; Object.entries(vars).forEach(([k,v])=>root.style.setProperty(k,v));}
   function removeRootVars(keys=[]){const root=document.documentElement; keys.forEach(k=>root.style.removeProperty(k));}
   
   /* --- Halloween Theme --- */
   function enableHalloween(){
     if(!document.body.classList.contains('halloween')) document.body.classList.add('halloween');
     setRootVars({
       '--bg':'linear-gradient(180deg,#06040a 0%, #170b17 50%, #260810 100%)',
       '--surface':'rgba(18,18,20,0.72)',
       '--card-surface':'linear-gradient(180deg, rgba(24,14,12,0.8), rgba(32,12,10,0.6))',
       '--text':'#f7f2ea',
       '--muted':'#e6d7c6',
       '--brand':'#ff7b1a',
       '--accent':'#ffb84d'
     });
     if(!REDUCED_MOTION && !q('.halloween-decor')) document.body.appendChild(makeDecorFragment());
     localStorage.setItem(THEME_KEY,'1');
     updateToggleButton(true);
     if(!q('#halloweenCounter')) initHalloweenCounter();
   }
   
   function disableHalloween(){
     document.body.classList.remove('halloween');
     q('.halloween-decor')?.remove();
     q('.falling')?.remove();
     removeRootVars(['--bg','--surface','--card-surface','--text','--muted','--brand','--accent']);
     localStorage.removeItem(THEME_KEY);
     updateToggleButton(false);
     q('#halloweenCounter')?.remove();
   }
   
   function toggleHalloween(){document.body.classList.contains('halloween')?disableHalloween():enableHalloween();}
   
   /* --- Toggle button --- */
   function ensureToggleButton(){
     let btn=q('#halloweenToggle');
     if(btn) return btn;
     btn=create('button',{
       id:'halloweenToggle',
       class:'btn',
       type:'button',
       title:'Toggle Halloween theme',
       'aria-pressed':'false'
     },['🎃 Halloween']);
     (q('.site-header')||document.body).appendChild(btn);
     btn.addEventListener('click',()=>{toggleHalloween(); btn.blur();});
     document.addEventListener('keydown',e=>{
       if(e.key.toLowerCase()==='h' && !['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)){
         e.preventDefault(); toggleHalloween();
       }
     });
     return btn;
   }
   function updateToggleButton(isOn){
     const btn=q('#halloweenToggle');
     if(!btn) return;
     btn.setAttribute('aria-pressed', String(Boolean(isOn)));
     btn.textContent=isOn?'🎃 Halloween (On)':'🎃 Halloween';
   }
   
   /* --- Lazy load iframes --- */
   function lazyLoadIframes(){
     const iframes=qAll('iframe[data-src]');
     if(!iframes.length) return;
     if('IntersectionObserver' in window){
       const obs=new IntersectionObserver((entries,observer)=>{
         entries.forEach(entry=>{
           if(entry.isIntersecting){
             const el=entry.target;
             el.src=el.getAttribute('data-src');
             el.removeAttribute('data-src');
             observer.unobserve(el);
           }
         });
       }, {rootMargin:'200px'});
       iframes.forEach(f=>obs.observe(f));
     } else if(iframes.length){iframes.forEach(f=>{f.src=f.getAttribute('data-src'); f.removeAttribute('data-src');});}
   }
   
   /* --- Button animation --- */
   function wireButtonClicks(){
     qAll('.btn').forEach(btn=>{
       if(btn.tagName==='A') return;
       if(btn._hasClickAnim) return;
       btn._hasClickAnim=true;
       btn.addEventListener('click',()=>{
         if(!REDUCED_MOTION){
           try{btn.animate([{transform:'translateY(0) scale(1)'},{transform:'translateY(-4px) scale(1.02)'},{transform:'translateY(0) scale(0.995)'}],
           {duration:220,easing:'cubic-bezier(.2,.9,.3,1)'});}catch(err){}
         }
         const href=btn.getAttribute('data-href'), target=btn.getAttribute('target');
         if(href){if(target==='blank') window.open(href,'_blank'); else window.location.href=href;}
       });
     });
   }
   
   
   /* ======================
      Security & shortcuts
      ====================== */
   document.addEventListener('contextmenu', e=>e.preventDefault());
   document.addEventListener('keydown', e=>{
     if(e.key==='F12') e.preventDefault();
     if(e.ctrlKey && e.shiftKey && ['I','C','J'].includes(e.key.toUpperCase())) e.preventDefault();
     if(e.ctrlKey && e.key.toLowerCase()==='u') e.preventDefault();
   });
   
   /* ======================
      Experimental DevTools detection
      ====================== */
   let devtoolsOpen=false;
   setInterval(()=>{
     const widthThreshold=window.outerWidth-window.innerWidth>150;
     const heightThreshold=window.outerHeight-window.innerHeight>150;
     if(widthThreshold||heightThreshold){
       if(!devtoolsOpen){ devtoolsOpen=true; console.log("DevTools might be open"); }
     } else devtoolsOpen=false;
   },1500);
   
   /* ======================
      DOM ready init
      ====================== */
   document.addEventListener('DOMContentLoaded', ()=>{
     wireButtonClicks();
     ensureToggleButton();
     if(localStorage.getItem(THEME_KEY)==='1') enableHalloween(); else updateToggleButton(false);
     lazyLoadIframes();
     new MutationObserver(muts=>{if(muts.some(m=>m.addedNodes.length)) wireButtonClicks();}).observe(document.body,{childList:true,subtree:true});
     window.FamilyHub={enableHalloween,disableHalloween,toggleHalloween};
   });
   