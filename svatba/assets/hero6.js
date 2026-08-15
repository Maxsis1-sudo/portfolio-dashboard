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
},700);
