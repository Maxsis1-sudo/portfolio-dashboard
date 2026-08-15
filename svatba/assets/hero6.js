/* Restore the original final hero-image chunk from the commit that introduced it. */
try{
  const x=new XMLHttpRequest();
  x.open('GET','https://raw.githubusercontent.com/Maxsis1-sudo/portfolio-dashboard/a75d0cfc265fba0f4176fc1948259f7fd7319d6c/svatba/assets/hero6.js',false);
  x.send(null);
  if(x.status>=200&&x.status<300)(0,eval)(x.responseText);
}catch(e){}

/* Wedding-site enhancements run after the page's main inline script initializes. */
setTimeout(()=>{
  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];

  /* Keep the generated hero image reliable. */
  if(window.HERO_B64&&$('#heroPhoto')) $('#heroPhoto').src='data:image/jpeg;base64,'+window.HERO_B64;

  /* Natural Czech wording for attendance + adults-only form. */
  const firstQuick=$('.quick .q');
  if(firstQuick){
    const strong=$('strong',firstQuick),small=$('small',firstQuick);
    if(strong) strong.textContent='Potvrdit účast';
    if(small) small.textContent='Počet osob + alergie';
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
    if(adults){
      const label=adults.closest('.f')?.querySelector('label');
      if(label) label.textContent='Počet osob';
      adults.min='1';
    }

    const note=cloned.querySelector('textarea[name="note"]');
    if(note){
      const label=note.closest('.f')?.querySelector('label');
      if(label) label.textContent='Alergie / dieta / poznámka';
    }

    const submit=cloned.querySelector('button[type="submit"]');
    if(submit) submit.textContent='Poslat potvrzení';
    const save=cloned.querySelector('button[type="button"]');
    if(save) save.textContent='Uložit do telefonu';

    const makeText=()=>{
      const f=new FormData(cloned);
      return `Potvrzení účasti – Roman & Romča\nJméno: ${f.get('name')}\nÚčast: ${f.get('attend')}\nPočet osob: ${f.get('adults')}\nAlergie / poznámka: ${f.get('note')||'-'}`;
    };
    cloned.addEventListener('submit',e=>{
      e.preventDefault();
      localStorage.setItem('roman-romca-rsvp',JSON.stringify(Object.fromEntries(new FormData(cloned))));
      shareText('Potvrzení účasti – Roman & Romča',makeText());
    });
    window.saveRsvp=()=>{
      localStorage.setItem('roman-romca-rsvp',JSON.stringify(Object.fromEntries(new FormData(cloned))));
      toastMessage('Potvrzení uloženo v telefonu');
    };
    try{
      const saved=JSON.parse(localStorage.getItem('roman-romca-rsvp')||'null');
      if(saved) Object.entries(saved).forEach(([k,v])=>{if(cloned.elements[k])cloned.elements[k].value=v});
    }catch(e){}
  }

  /* Adults-only wording everywhere visible. */
  $$('summary').forEach(s=>{
    if(s.textContent.includes('Mohou děti?')){
      s.textContent='👶 Je svatba s dětmi?';
      const p=s.parentElement?.querySelector('p');
      if(p) p.innerHTML='Náš svatební den bude <b>pouze pro dospělé</b>. Děkujeme za pochopení a těšíme se, že si ho společně pořádně užijeme. 🧡';
    }
    if(s.textContent.includes('Alergie?')){
      const p=s.parentElement?.querySelector('p');
      if(p) p.textContent='Stačí je uvést při potvrzení účasti.';
    }
  });

  /* Additional pastel-only styling. */
  const style=document.createElement('style');
  style.textContent=`
    .live-card{background:linear-gradient(135deg,var(--ps),var(--os),var(--ys));border:1px solid var(--line);border-radius:22px;padding:18px;display:flex;align-items:center;gap:14px;box-shadow:0 7px 17px rgba(70,45,35,.06)}
    .live-ico{width:52px;height:52px;flex:0 0 52px;border-radius:50%;display:grid;place-items:center;background:var(--y);font-size:25px}
    .live-copy strong{display:block;font:400 21px Georgia,serif;margin-bottom:4px}.live-copy small{display:block;color:var(--muted);font-size:11px;line-height:1.45}
    .live-bar{height:7px;background:var(--ps);border-radius:99px;overflow:hidden;margin-top:10px}.live-bar i{display:block;height:100%;width:0;background:var(--o);border-radius:99px;transition:width .6s ease}
    .program .p{transition:.2s}.program .p.current{transform:translateY(-3px);box-shadow:0 9px 22px rgba(70,45,35,.14);outline:3px solid var(--o)}
    .weather-card{background:linear-gradient(135deg,var(--ys),var(--os),var(--ps));border:1px solid var(--line);border-radius:22px;padding:18px;display:grid;grid-template-columns:auto 1fr;gap:14px;align-items:center}
    .weather-ico{width:58px;height:58px;border-radius:50%;display:grid;place-items:center;background:var(--paper);font-size:30px}.weather-copy strong{display:block;font:400 21px Georgia,serif;margin-bottom:4px}.weather-copy small{display:block;color:var(--muted);font-size:11px;line-height:1.45}.weather-tip{margin-top:9px;padding:9px 11px;border-radius:13px;background:var(--paper);font-size:10px;color:var(--muted)}
    .extras{grid-template-columns:repeat(auto-fit,minmax(135px,1fr))!important}.quiz-extra{background:var(--y)!important}
    .quiz-q{margin-top:12px;padding:14px;border-radius:18px;background:var(--ps)}.quiz-q>b{display:block;font-size:13px;margin-bottom:8px}.quiz-options{display:grid;gap:7px}.quiz-options button{border:0;border-radius:12px;padding:10px;background:var(--paper);color:var(--ink);text-align:left;cursor:pointer}.quiz-options button.chosen{background:var(--o)}
    .quiz-score{display:none;margin-top:14px;padding:16px;border-radius:18px;background:var(--ys);text-align:center}.quiz-score b{font:400 24px Georgia,serif;display:block;margin-bottom:4px}
    @media(max-width:520px){.weather-card{grid-template-columns:1fr;text-align:center}.weather-ico{margin:auto}}
  `;
  document.head.appendChild(style);

  /* Live "what is happening right now" section. */
  const countdown=$('.countdown')?.closest('.section');
  if(countdown&&!$('#liveNow')){
    const sec=document.createElement('section');
    sec.className='section';
    sec.id='liveNow';
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
  const fmt=ms=>{
    const min=Math.max(0,Math.ceil(ms/60000));
    if(min<60)return `${min} min`;
    const h=Math.floor(min/60),m=min%60;
    return m?`${h} h ${m} min`:`${h} h`;
  };
  function updateLive(){
    const now=Date.now(),ico=$('#liveIco'),title=$('#liveTitle'),sub=$('#liveSub'),bar=$('#liveProgress'),cards=$$('.program .p');
    cards.forEach(c=>c.classList.remove('current'));
    if(!ico||!title||!sub||!bar)return;
    if(now<weddingStart){
      ico.textContent='💛';title.textContent='Ještě se těšíme';sub.textContent='V den svatby se tady automaticky zobrazí aktuální část programu.';bar.style.width='0%';return;
    }
    if(now>=weddingEnd){
      ico.textContent='🧡';title.textContent='Děkujeme, že jste byli s námi';sub.textContent='Byl to náš den — a jsme rádi, že jste u něj byli.';bar.style.width='100%';return;
    }
    const st=stages.find(s=>now>=s.start&&now<s.end);
    if(st){
      ico.textContent=st.ico;title.textContent=st.title;sub.textContent=`${st.next} · za ${fmt(st.end-now)}`;
      bar.style.width=Math.min(100,Math.max(0,(now-st.start)/(st.end-st.start)*100))+'%';
      if(cards[st.card])cards[st.card].classList.add('current');
    }
  }
  updateLive();
  setInterval(updateLive,30000);

  /* Wedding-day weather. Exact venue coordinates; forecast appears automatically near the date. */
  const programHeading=$$('.head h2').find(h=>h.textContent.trim()==='Náš den');
  const programSection=programHeading?.closest('.section');
  if(programSection&&!$('#weddingWeather')){
    const sec=document.createElement('section');
    sec.className='section';
    sec.id='weddingWeather';
    sec.innerHTML='<div class="head"><h2>Počasí na svatbu</h2><p>Předpověď se sama objeví, až bude termín dostatečně blízko.</p></div><div class="weather-card"><div class="weather-ico" id="weatherIco">☀️</div><div class="weather-copy"><strong id="weatherTitle">Předpověď zatím spí</strong><small id="weatherText">Přibližně 7–10 dní před svatbou se tady automaticky zobrazí aktuální výhled pro Habrovku.</small><div class="weather-tip" id="weatherTip">Až bude předpověď dostupná, přidáme i jednoduchý tip, co si vzít na sebe.</div></div></div>';
    programSection.insertAdjacentElement('beforebegin',sec);
  }

  const weatherLabel=code=>{
    if(code===0)return{icon:'☀️',text:'Jasno'};
    if(code<=3)return{icon:'🌤️',text:'Polojasno'};
    if(code<=48)return{icon:'🌫️',text:'Mlha'};
    if(code<=67)return{icon:'🌦️',text:'Déšť'};
    if(code<=77)return{icon:'🌨️',text:'Srážky'};
    if(code<=82)return{icon:'🌧️',text:'Přeháňky'};
    if(code<=86)return{icon:'🌨️',text:'Sněhové přeháňky'};
    return{icon:'⛈️',text:'Bouřky'};
  };
  async function loadWeather(){
    const wedding=new Date('2027-06-05T12:00:00+02:00');
    const diff=(wedding-Date.now())/86400000;
    if(diff>16||diff<-1)return;
    try{
      const url='https://api.open-meteo.com/v1/forecast?latitude=49.90526&longitude=15.73156&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max&timezone=Europe%2FPrague&forecast_days=16';
      const r=await fetch(url);
      const j=await r.json();
      const i=j.daily.time.indexOf('2027-06-05');
      if(i<0)return;
      const w=weatherLabel(j.daily.weather_code[i]);
      const max=Math.round(j.daily.temperature_2m_max[i]);
      const min=Math.round(j.daily.temperature_2m_min[i]);
      const rain=Math.round(j.daily.precipitation_probability_max[i]||0);
      const wind=Math.round(j.daily.wind_speed_10m_max[i]||0);
      $('#weatherIco').textContent=w.icon;
      $('#weatherTitle').textContent=`${w.text} · ${max} °C`;
      $('#weatherText').textContent=`Minimum ${min} °C · déšť ${rain} % · vítr do ${wind} km/h`;
      let tip='Vypadá to příjemně — na večer jen lehkou vrstvu pro jistotu.';
      if(rain>=50)tip='Deštník nebo něco nepromokavého se může hodit.';
      else if(min<=13)tip='Na večer si vezměte něco přes ramena.';
      else if(max>=27)tip='Bude teplo — hodí se voda a něco lehkého.';
      $('#weatherTip').textContent=tip;
    }catch(e){
      if($('#weatherTitle'))$('#weatherTitle').textContent='Předpověď se právě nenačetla';
      if($('#weatherText'))$('#weatherText').textContent='Zkuste stránku později znovu.';
    }
  }
  loadWeather();

  /* Mini quiz. Uses only confirmed wedding facts; personal couple questions can be swapped in later. */
  const extras=$('.extras');
  let quizDialog=$('#quiz');
  if(extras&&!quizDialog){
    const quizBtn=document.createElement('button');
    quizBtn.className='extra quiz-extra';
    quizBtn.innerHTML='<span class="icon">❓</span><strong>Mini kvíz</strong><small>Jak dobře znáte náš den?</small>';
    extras.appendChild(quizBtn);

    quizDialog=document.createElement('dialog');
    quizDialog.id='quiz';
    quizDialog.innerHTML='<div class="modal"><div class="mh"><h3>Mini svatební kvíz</h3><button class="x" type="button">×</button></div><p>Jak dobře znáte náš svatební den?</p><div id="quizBody"></div><div id="quizScore" class="quiz-score"></div><div class="actions"><button class="btn orange" id="quizFinish" type="button">Vyhodnotit</button><button class="btn yellow" id="quizReset" type="button">Zkusit znovu</button></div></div>';
    document.body.appendChild(quizDialog);
    quizDialog.querySelector('.x').addEventListener('click',()=>quizDialog.close());
    quizBtn.addEventListener('click',()=>{renderQuiz();quizDialog.showModal()});
  }

  const quizData=[
    {q:'Kdy se bereme?',o:['5. 6. 2027','6. 5. 2027','5. 7. 2027'],a:0},
    {q:'Kde bude svatba?',o:['Stodola Habrovka','Zámek Slatiňany','Praha'],a:0},
    {q:'V kolik začíná obřad?',o:['11:00','13:00','15:00'],a:1},
    {q:'Jak to máme s dětmi?',o:['Svatba je pouze pro dospělé','Děti jsou vítané','Jen děti do 6 let'],a:0},
    {q:'Kam patří nejlepší fotky ze svatby?',o:['Do společného alba','Jen do telefonu','Nikomu je neukazovat'],a:0}
  ];
  let quizAnswers={};
  function renderQuiz(){
    const body=$('#quizBody');
    if(!body||body.children.length)return;
    quizData.forEach((x,i)=>{
      const d=document.createElement('div');
      d.className='quiz-q';
      d.innerHTML='<b>'+(i+1)+'. '+x.q+'</b><div class="quiz-options">'+x.o.map((v,j)=>`<button type="button" data-q="${i}" data-a="${j}">${v}</button>`).join('')+'</div>';
      body.appendChild(d);
    });
    $$('.quiz-options button',body).forEach(b=>b.addEventListener('click',()=>{
      const i=Number(b.dataset.q),j=Number(b.dataset.a);
      quizAnswers[i]=j;
      b.parentElement.querySelectorAll('button').forEach(x=>x.classList.remove('chosen'));
      b.classList.add('chosen');
    }));
  }
  function finishQuiz(){
    const score=quizData.reduce((n,x,i)=>n+(quizAnswers[i]===x.a),0);
    const box=$('#quizScore');
    if(!box)return;
    box.style.display='block';
    const msg=score===5?'Svatební profík! 💛':score>=3?'Skoro jako rodina. 🧡':'Ještě jeden průchod webem a bude to. 🌸';
    box.innerHTML=`<b>${score} / ${quizData.length}</b>${msg}`;
  }
  function resetQuiz(){
    quizAnswers={};
    const body=$('#quizBody'),box=$('#quizScore');
    if(body)body.innerHTML='';
    if(box)box.style.display='none';
    renderQuiz();
  }
  $('#quizFinish')?.addEventListener('click',finishQuiz);
  $('#quizReset')?.addEventListener('click',resetQuiz);
},0);
