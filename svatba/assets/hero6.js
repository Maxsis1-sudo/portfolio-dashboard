/* Load the original final hero-image chunk from the commit that introduced it. */
try{const x=new XMLHttpRequest();x.open('GET','https://raw.githubusercontent.com/Maxsis1-sudo/portfolio-dashboard/a75d0cfc265fba0f4176fc1948259f7fd7319d6c/svatba/assets/hero6.js',false);x.send(null);if(x.status>=200&&x.status<300)(0,eval)(x.responseText)}catch(e){}

/* Content/UX update runs after the page's main inline script has initialized. */
setTimeout(()=>{
  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];

  /* Keep the generated hero image reliable after the original chunk is restored. */
  if(window.HERO_B64&&$('#heroPhoto')) $('#heroPhoto').src='data:image/jpeg;base64,'+window.HERO_B64;

  /* Rename RSVP to natural Czech wording and remove children from the flow. */
  const firstQuick=$('.quick .q');
  if(firstQuick){
    const strong=$('strong',firstQuick),small=$('small',firstQuick);
    if(strong) strong.textContent='Potvrdit účast';
    if(small) small.textContent='Dorazíte? + alergie';
  }

  const oldForm=$('#rsvpForm');
  if(oldForm){
    const cloned=oldForm.cloneNode(true);
    oldForm.replaceWith(cloned);
    window.rsvpForm=cloned;
    const kids=cloned.querySelector('input[name="kids"]');
    if(kids){
      const field=kids.closest('.f');
      const row=field&&field.parentElement;
      if(field) field.remove();
      if(row&&row.classList.contains('g2')) row.style.gridTemplateColumns='1fr';
    }
    const adults=cloned.querySelector('input[name="adults"]');
    if(adults){const label=adults.closest('.f')?.querySelector('label');if(label)label.textContent='Počet osob';}
    const submit=cloned.querySelector('button[type="submit"]');
    if(submit) submit.textContent='Poslat potvrzení';
    const save=cloned.querySelector('button[type="button"]');
    if(save) save.textContent='Uložit do telefonu';

    const makeText=()=>{const f=new FormData(cloned);return `Potvrzení účasti – Roman & Romča\nJméno: ${f.get('name')}\nÚčast: ${f.get('attend')}\nPočet osob: ${f.get('adults')}\nAlergie / poznámka: ${f.get('note')||'-'}`};
    cloned.addEventListener('submit',e=>{e.preventDefault();localStorage.setItem('roman-romca-rsvp',JSON.stringify(Object.fromEntries(new FormData(cloned))));shareText('Potvrzení účasti – Roman & Romča',makeText())});
    window.saveRsvp=()=>{localStorage.setItem('roman-romca-rsvp',JSON.stringify(Object.fromEntries(new FormData(cloned))));toastMessage('Potvrzení uloženo v telefonu')};
    try{const saved=JSON.parse(localStorage.getItem('roman-romca-rsvp')||'null');if(saved)Object.entries(saved).forEach(([k,v])=>{if(cloned.elements[k])cloned.elements[k].value=v})}catch(e){}
  }

  /* Adults-only wording. */
  $$('summary').forEach(s=>{
    if(s.textContent.includes('Mohou děti?')){
      s.textContent='👶 Je svatba s dětmi?';
      const p=s.parentElement?.querySelector('p');
      if(p)p.innerHTML='Náš svatební den bude <b>pouze pro dospělé</b>. Děkujeme za pochopení a těšíme se, že si ho společně pořádně užijeme. 🧡';
    }
    if(s.textContent.includes('Alergie?')){
      const p=s.parentElement?.querySelector('p');
      if(p)p.textContent='Stačí je uvést při potvrzení účasti.';
    }
  });

  /* Live "what is happening now" section. */
  const style=document.createElement('style');
  style.textContent=`
    .live-card{background:linear-gradient(135deg,var(--ps),var(--os),var(--ys));border:1px solid var(--line);border-radius:22px;padding:18px;display:flex;align-items:center;gap:14px;box-shadow:0 7px 17px rgba(70,45,35,.06)}
    .live-ico{width:52px;height:52px;flex:0 0 52px;border-radius:50%;display:grid;place-items:center;background:var(--y);font-size:25px}
    .live-copy strong{display:block;font:400 21px Georgia,serif;margin-bottom:4px}.live-copy small{display:block;color:var(--muted);font-size:11px;line-height:1.45}
    .live-bar{height:7px;background:var(--ps);border-radius:99px;overflow:hidden;margin-top:10px}.live-bar i{display:block;height:100%;width:0;background:var(--o);border-radius:99px;transition:width .6s ease}
    .program .p{transition:.2s}.program .p.current{transform:translateY(-3px);box-shadow:0 9px 22px rgba(70,45,35,.14);outline:3px solid var(--o)}
  `;
  document.head.appendChild(style);

  const countdown=$('.countdown')?.closest('.section');
  if(countdown&&!$('#liveNow')){
    const sec=document.createElement('section');
    sec.className='section';sec.id='liveNow';
    sec.innerHTML='<div class="head"><h2>Co se děje právě teď?</h2><p>V den svatby se program bude měnit automaticky.</p></div><div class="live-card"><div class="live-ico" id="liveIco">💛</div><div class="live-copy"><strong id="liveTitle">Ještě se těšíme</strong><small id="liveSub">V den svatby tu uvidíte, co právě probíhá a co následuje.</small><div class="live-bar"><i id="liveProgress"></i></div></div></div>';
    countdown.insertAdjacentElement('afterend',sec);
  }

  const stages=[
    {start:new Date('2027-06-05T13:00:00+02:00').getTime(),end:new Date('2027-06-05T14:00:00+02:00').getTime(),ico:'💍',title:'Právě probíhá obřad',next:'Další: gratulace a focení ve 14:00',card:0},
    {start:new Date('2027-06-05T14:00:00+02:00').getTime(),end:new Date('2027-06-05T15:00:00+02:00').getTime(),ico:'🥂',title:'Právě jsou gratulace a focení',next:'Další: hostina v 15:00',card:1},
    {start:new Date('2027-06-05T15:00:00+02:00').getTime(),end:new Date('2027-06-05T20:00:00+02:00').getTime(),ico:'🍽️',title:'Právě probíhá hostina',next:'Další: party ve 20:00',card:2},
    {start:new Date('2027-06-05T20:00:00+02:00').getTime(),end:new Date('2027-06-06T04:00:00+02:00').getTime(),ico:'🪩',title:'Party je v plném proudu',next:'Teď už jen hudba, tanec a zábava ♡',card:3}
  ];
  const weddingStart=stages[0].start,weddingEnd=stages[3].end;
  const fmt=ms=>{const min=Math.max(0,Math.ceil(ms/60000));if(min<60)return `${min} min`;const h=Math.floor(min/60),m=min%60;return m?`${h} h ${m} min`:`${h} h`};
  function updateLive(){
    const now=Date.now(),ico=$('#liveIco'),title=$('#liveTitle'),sub=$('#liveSub'),bar=$('#liveProgress'),cards=$$('.program .p');
    cards.forEach(c=>c.classList.remove('current'));
    if(!ico||!title||!sub||!bar)return;
    if(now<weddingStart){ico.textContent='💛';title.textContent='Ještě se těšíme';sub.textContent='V den svatby se tady automaticky zobrazí aktuální část programu.';bar.style.width='0%';return;}
    if(now>=weddingEnd){ico.textContent='🧡';title.textContent='Děkujeme, že jste byli s námi';sub.textContent='Byl to náš den — a jsme rádi, že jste u něj byli.';bar.style.width='100%';return;}
    const st=stages.find(s=>now>=s.start&&now<s.end);
    if(st){ico.textContent=st.ico;title.textContent=st.title;sub.textContent=`${st.next} · za ${fmt(st.end-now)}`;bar.style.width=Math.min(100,Math.max(0,(now-st.start)/(st.end-st.start)*100))+'%';if(cards[st.card])cards[st.card].classList.add('current');}
  }
  updateLive();setInterval(updateLive,30000);
},0);
