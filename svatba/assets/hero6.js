/* Load the complete previous wedding-site version first. */
try{
  const x=new XMLHttpRequest();
  x.open('GET','https://raw.githubusercontent.com/Maxsis1-sudo/portfolio-dashboard/42a2ba89d3e5674a540ab0b75ee76909883ecf84/svatba/assets/hero6.js',false);
  x.send(null);
  if(x.status>=200&&x.status<300)(0,eval)(x.responseText);
}catch(e){}

/* Automatic form delivery to Roman's email via FormSubmit. */
setTimeout(()=>{
  const $=(s,r=document)=>r.querySelector(s);
  const EMAIL_ENDPOINT='https://formsubmit.co/ajax/fronekroman@seznam.cz';

  async function sendWeddingForm(payload){
    const response=await fetch(EMAIL_ENDPOINT,{
      method:'POST',
      headers:{'Content-Type':'application/json','Accept':'application/json'},
      body:JSON.stringify({...payload,_template:'table',_url:location.href})
    });
    let data={};
    try{data=await response.json()}catch(e){}
    if(!response.ok||data.success===false)throw new Error(data.message||'Form could not be sent');
    return data;
  }

  /* RSVP: replace old share-based handler with automatic email submission. */
  const old=$('#rsvpForm');
  if(old){
    const form=old.cloneNode(true);
    old.replaceWith(form);
    window.rsvpForm=form;

    const submit=form.querySelector('button[type="submit"]');
    if(submit)submit.textContent='Odeslat potvrzení';

    const save=form.querySelector('button[type="button"]');
    if(save)save.remove();

    if(!form.querySelector('.privacy-note')){
      const note=document.createElement('p');
      note.className='privacy-note';
      note.style.cssText='font-size:10px;color:var(--muted);margin:10px 0 0;line-height:1.45';
      note.textContent='Údaje slouží pouze k organizaci svatby.';
      form.appendChild(note);
    }

    try{
      const saved=JSON.parse(localStorage.getItem('roman-romca-rsvp')||'null');
      if(saved)Object.entries(saved).forEach(([k,v])=>{if(form.elements[k])form.elements[k].value=v});
    }catch(e){}

    form.addEventListener('submit',async e=>{
      e.preventDefault();
      if(!form.reportValidity())return;
      const f=new FormData(form);
      const btn=form.querySelector('button[type="submit"]');
      const original=btn?.textContent||'Odeslat potvrzení';
      if(btn){btn.disabled=true;btn.textContent='Odesílám…';}
      const payload={
        _subject:'💒 Nové potvrzení účasti – Roman & Romča',
        'Typ formuláře':'Potvrzení účasti',
        'Jméno':f.get('name')||'-',
        'Účast':f.get('attend')||'-',
        'Počet osob':f.get('adults')||'-',
        'Alergie / dieta / poznámka':f.get('note')||'-'
      };
      try{
        localStorage.setItem('roman-romca-rsvp',JSON.stringify(Object.fromEntries(f)));
        await sendWeddingForm(payload);
        toastMessage('Děkujeme, potvrzení máme ❤️');
        setTimeout(()=>{try{document.getElementById('rsvp')?.close()}catch(e){}},700);
      }catch(err){
        toastMessage('Nepodařilo se odeslat. Zkuste to prosím znovu.');
      }finally{
        if(btn){btn.disabled=false;btn.textContent=original;}
      }
    });
  }

  /* Song request: add guest name and send directly instead of opening Share. */
  const songDialog=$('#song');
  if(songDialog){
    const songField=$('#songInput')?.closest('.f');
    if(songField&&!$('#songName')){
      const nameField=document.createElement('div');
      nameField.className='f';
      nameField.innerHTML='<label>Jméno (volitelně)</label><input id="songName" placeholder="Kdo posílá tip?">';
      songField.insertAdjacentElement('beforebegin',nameField);
    }
    const btn=songDialog.querySelector('.actions .btn');
    if(btn)btn.textContent='Odeslat tip';

    window.shareSong=async function(){
      const song=$('#songInput')?.value.trim();
      const name=$('#songName')?.value.trim()||'-';
      if(!song)return toastMessage('Napište písničku');
      const b=songDialog.querySelector('.actions .btn');
      const original=b?.textContent||'Odeslat tip';
      if(b){b.disabled=true;b.textContent='Odesílám…';}
      try{
        await sendWeddingForm({
          _subject:'🎵 Nový tip na písničku – Roman & Romča',
          'Typ formuláře':'Tip na písničku',
          'Jméno':name,
          'Písnička':song
        });
        toastMessage('Tip na písničku odeslán 🎵');
        if($('#songInput'))$('#songInput').value='';
        if($('#songName'))$('#songName').value='';
        setTimeout(()=>{try{songDialog.close()}catch(e){}},700);
      }catch(err){
        toastMessage('Tip se nepodařilo odeslat. Zkuste to znovu.');
      }finally{
        if(b){b.disabled=false;b.textContent=original;}
      }
    };
  }

  /* Put the three most important actions directly under the countdown. */
  if(!document.getElementById('priorityActions')){
    const style=document.createElement('style');
    style.textContent=`
      .priority-actions{margin:0 auto 10px;padding:0}
      .priority-panel{background:rgba(255,253,251,.97);border:1px solid var(--line);border-radius:26px;padding:16px;box-shadow:0 12px 30px rgba(70,45,35,.10)}
      .priority-title{text-align:center;margin:0 0 12px}.priority-title b{display:block;font:400 26px Georgia,serif}.priority-title span{display:block;margin-top:3px;font-size:10px;color:var(--muted)}
      .priority-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
      .priority-card{border:0;border-radius:20px;min-height:118px;padding:16px 10px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;color:var(--ink);cursor:pointer;box-shadow:0 7px 17px rgba(70,45,35,.07);transition:transform .18s ease,box-shadow .18s ease}
      .priority-card:hover{transform:translateY(-2px);box-shadow:0 11px 24px rgba(70,45,35,.11)}
      .priority-card:nth-child(1){background:var(--p)}.priority-card:nth-child(2){background:var(--o)}.priority-card:nth-child(3){background:var(--y)}
      .priority-card .pi{font-size:32px;line-height:1;margin-bottom:9px}.priority-card strong{font-size:16px;line-height:1.1}.priority-card small{font-size:9px;line-height:1.35;margin-top:5px;opacity:.75}
      @media(max-width:520px){.priority-panel{padding:12px;border-radius:22px}.priority-grid{gap:7px}.priority-card{min-height:104px;padding:13px 6px;border-radius:17px}.priority-card .pi{font-size:28px}.priority-card strong{font-size:13px}.priority-card small{font-size:8px}.priority-title b{font-size:23px}}
    `;
    document.head.appendChild(style);

    const countdownSection=document.querySelector('.countdown')?.closest('.section');
    if(countdownSection){
      const section=document.createElement('section');
      section.id='priorityActions';
      section.className='section priority-actions';
      section.innerHTML=`<div class="priority-panel"><div class="priority-title"><b>Nejdůležitější</b><span>Tři věci, které budete nejspíš potřebovat jako první.</span></div><div class="priority-grid"><button class="priority-card" type="button" onclick="openModal('rsvp')"><span class="pi">✉️</span><strong>Potvrdit účast</strong><small>Počet osob a alergie</small></button><button class="priority-card" type="button" onclick="openModal('photos')"><span class="pi">📸</span><strong>Fotky</strong><small>Společné album</small></button><button class="priority-card" type="button" onclick="openModal('gift')"><span class="pi">🎁</span><strong>Svatební dar</strong><small>QR platba a účet</small></button></div></div>`;
      countdownSection.insertAdjacentElement('afterend',section);
    }
  }

  /* Remove duplicated RSVP / Photos / Gift cards from the lower quick-actions section. */
  const quick=document.querySelector('.quick');
  if(quick){
    [...quick.querySelectorAll('.q')].forEach(card=>{
      const action=card.getAttribute('onclick')||'';
      if(action.includes("'rsvp'")||action.includes("'photos'")||action.includes("'gift'"))card.remove();
    });
    const sec=quick.closest('.section');
    const h=sec?.querySelector('.head h2');
    const p=sec?.querySelector('.head p');
    if(h)h.textContent='Další užitečné';
    if(p)p.textContent='Navigace, kalendář a písnička pro DJ.';
  }

  /* Keep only Wedding Mission in the guest features section. */
  const extras=document.querySelector('.extras');
  if(extras){
    [...extras.querySelectorAll('.extra')].forEach(card=>{
      const action=card.getAttribute('onclick')||'';
      if(!action.includes("'mission'"))card.remove();
    });
    extras.style.gridTemplateColumns='1fr';
    const missionCard=extras.querySelector('.extra');
    if(missionCard){
      missionCard.style.maxWidth='360px';
      missionCard.style.width='100%';
      missionCard.style.margin='0 auto';
    }
    const sec=extras.closest('.section');
    const h=sec?.querySelector('.head h2');
    const p=sec?.querySelector('.head p');
    if(h)h.textContent='Svatební mise';
    if(p)p.textContent='Vylosuj si náhodný úkol pro zábavu.';
  }
},700);

/* Expanded pool of 50 wedding missions. */
setTimeout(()=>{
  const weddingMissions=[
    'Udělej selfie s někým, koho dnes poznáváš poprvé.',
    'Vyfoť nejhezčí detail výzdoby.',
    'Vytáhni někoho na parket, kdo ještě netančil.',
    'Pošli novomanželům jednu fotku, která tě dnes rozesmála.',
    'Najdi hosta, který zná Romana nejdéle.',
    'Najdi hosta, který zná Romču nejdéle.',
    'Vyfoť skupinku alespoň pěti lidí, kteří se smějí.',
    'Zjisti, kdo přijel na svatbu z největší dálky.',
    'Vyfoť nejvtipnější taneční pohyb večera.',
    'Připij si s někým, koho jsi před dneškem neznal/a.',
    'Najdi někoho se stejným křestním jménem jako máš ty.',
    'Vyfoť moment, který podle tebe nejlépe vystihuje dnešní svatbu.',
    'Řekni nevěstě jeden upřímný kompliment.',
    'Řekni ženichovi jeden upřímný kompliment.',
    'Zjisti, kdo z hostů má nejdelší vztah.',
    'Najdi pár, který je spolu nejkratší dobu.',
    'Udělej fotku s někým z opačné strany rodiny.',
    'Vyfoť nejbarevnější outfit mezi hosty.',
    'Najdi člověka, který dnes urazil nejvíc kilometrů.',
    'Získej fotku tří generací na jednom snímku.',
    'Vyfoť někoho při opravdovém záchvatu smíchu.',
    'Zatanči si alespoň jednu celou písničku s někým novým.',
    'Zjisti oblíbenou písničku jednoho z hostů a pošli ji jako tip DJovi.',
    'Najdi hosta, který chodil s Romanem do školy.',
    'Najdi hosta, který chodil s Romčou do školy.',
    'Vyfoť nejhezčí pár bot na svatbě.',
    'Udělej fotku, na které je alespoň sedm hostů.',
    'Najdi někoho, kdo má narozeniny nejblíž dnešnímu datu.',
    'Vyfoť přípitek z netradičního úhlu.',
    'Zjisti, kdo šel dnes spát nejpozději před svatbou.',
    'Najdi někoho, kdo umí říct „na zdraví“ alespoň ve třech jazycích.',
    'Udělej společnou fotku s někým, kdo má stejnou barvu oblečení jako ty.',
    'Vyfoť nejromantičtější moment, který během večera uvidíš.',
    'Přesvědč dva další hosty, aby s tebou šli na parket.',
    'Zjisti, kdo z hostů má nejvíc sourozenců.',
    'Najdi někoho, kdo byl na svatbě jako poslední ženich nebo nevěsta.',
    'Vyfoť nejhezčí jídlo nebo dezert večera.',
    'Udělej fotku s někým o alespoň jednu generaci starším.',
    'Udělej fotku s někým o alespoň jednu generaci mladším.',
    'Najdi člověka, který zná oba novomanžele déle než deset let.',
    'Zjisti od hosta jednu vtipnou historku o Romanovi.',
    'Zjisti od hosta jednu vtipnou historku o Romče.',
    'Vyfoť taneční parket ve chvíli, kdy je úplně plný.',
    'Najdi největšího cestovatele mezi hosty a zjisti jeho oblíbenou zemi.',
    'Dej někomu, koho moc neznáš, symbolický „high five“ a představ se.',
    'Vyfoť detail, kterého si podle tebe většina hostů nevšimla.',
    'Najdi dva hosty, kteří se dnes seznámili poprvé, a vyfoť je spolu.',
    'Udělej fotku s někým, kdo má na sobě něco růžového, oranžového nebo žlutého.',
    'Najdi největšího tanečníka večera a dej si s ním jednu písničku.',
    'Na konci večera vyber svou nejoblíbenější fotku a nahraj ji do společného alba.'
  ];
  window.newMission=function(){
    const el=document.getElementById('missionText');
    if(el)el.textContent=weddingMissions[Math.floor(Math.random()*weddingMissions.length)];
  };
},900);
