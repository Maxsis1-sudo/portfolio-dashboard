/* Load the previous wedding-site enhancements, then replace the quiz with the personal version. */
try{
  const x=new XMLHttpRequest();
  x.open('GET','https://raw.githubusercontent.com/Maxsis1-sudo/portfolio-dashboard/0aadf8eb5a2cde85967740f600e57d6caf75acbd/svatba/assets/hero6.js',false);
  x.send(null);
  if(x.status>=200&&x.status<300)(0,eval)(x.responseText);
}catch(e){}

setTimeout(()=>{
  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];

  const oldBtn=$('.quiz-extra');
  const extras=$('.extras');
  if(oldBtn) oldBtn.remove();
  const oldDialog=$('#quiz');
  if(oldDialog) oldDialog.remove();

  if(!extras)return;

  const quizBtn=document.createElement('button');
  quizBtn.className='extra quiz-extra';
  quizBtn.innerHTML='<span class="icon">❓</span><strong>Mini kvíz</strong><small>Jak dobře znáte Romana & Romču?</small>';
  extras.appendChild(quizBtn);

  const quizDialog=document.createElement('dialog');
  quizDialog.id='quiz';
  quizDialog.innerHTML='<div class="modal"><div class="mh"><h3>Jak dobře znáte Romana & Romču?</h3><button class="x" type="button">×</button></div><p>10 rychlých otázek. Bez Googlu a bez nápovědy od Chilli. 😄</p><div id="quizBody"></div><div id="quizScore" class="quiz-score"></div><div class="actions"><button class="btn orange" id="quizFinish" type="button">Vyhodnotit</button><button class="btn yellow" id="quizReset" type="button">Zkusit znovu</button></div></div>';
  document.body.appendChild(quizDialog);

  const quizData=[
    {q:'❤️ Kde se Roman a Romča potkali?',o:['Přes společné kamarády','Na Tinderu','U baru ve tři ráno'],a:1},
    {q:'🍔 Kdo toho sní víc?',o:['Roman','Romča','Chilli, když se nikdo nedívá'],a:1},
    {q:'🐶 Jak se jmenuje jejich pes?',o:['Charlie','Chilli','Čenda'],a:1},
    {q:'💍 Kde proběhlo požádání o ruku?',o:['Na dovolené u moře','Ve Stromovce','Doma při Netflixu'],a:1},
    {q:'📅 Kdo je větší plánovač?',o:['Roman','Romča','Chilli – ten plánuje hlavně jídlo'],a:1},
    {q:'🔥 Kdo je větší střela?',o:['Roman','Romča','Po pár drincích se rozdíl maže'],a:0},
    {q:'⏰ Kdo chodí častěji pozdě?',o:['Roman','Romča','Oba tvrdí, že ten druhý'],a:1},
    {q:'🔑 Kdo častěji hledá telefon, klíče nebo něco, co měl ještě před minutou v ruce?',o:['Roman','Romča','Chilli to schoval'],a:1},
    {q:'😴 Kdo usne dřív u filmu?',o:['Roman','Romča','Chilli – ještě před úvodními titulky'],a:1},
    {q:'🍕 Kdo častěji řekne „nemám hlad“ a pak sní půlku jídla tomu druhému?',o:['Roman','Romča','Oba – proto se objednává radši navíc'],a:1}
  ];

  let answers={};

  function renderQuiz(){
    const body=$('#quizBody');
    if(!body)return;
    body.innerHTML='';
    quizData.forEach((x,i)=>{
      const d=document.createElement('div');
      d.className='quiz-q';
      d.innerHTML='<b>'+(i+1)+'. '+x.q+'</b><div class="quiz-options">'+x.o.map((v,j)=>`<button type="button" data-q="${i}" data-a="${j}">${v}</button>`).join('')+'</div>';
      body.appendChild(d);
    });
    $$('.quiz-options button',body).forEach(b=>b.addEventListener('click',()=>{
      const i=Number(b.dataset.q),j=Number(b.dataset.a);
      answers[i]=j;
      b.parentElement.querySelectorAll('button').forEach(x=>x.classList.remove('chosen'));
      b.classList.add('chosen');
    }));
  }

  function finishQuiz(){
    const unanswered=quizData.length-Object.keys(answers).length;
    const box=$('#quizScore');
    if(!box)return;
    box.style.display='block';
    if(unanswered){
      box.innerHTML=`<b>Ještě ${unanswered}</b>${unanswered===1?'otázka čeká na odpověď.':'otázek čeká na odpověď.'}`;
      box.scrollIntoView({behavior:'smooth',block:'nearest'});
      return;
    }
    const score=quizData.reduce((n,x,i)=>n+(answers[i]===x.a),0);
    let msg='Přiznej se, přišel jsi hlavně na hostinu. 😄';
    if(score===10)msg='Podezřelé. Víš toho až moc. 😄';
    else if(score>=7)msg='Skoro člen rodiny. 💛';
    else if(score>=4)msg='Pozvánku sis zasloužil. 🧡';
    box.innerHTML=`<b>${score} / ${quizData.length}</b>${msg}`;
    box.scrollIntoView({behavior:'smooth',block:'nearest'});
  }

  function resetQuiz(){
    answers={};
    const box=$('#quizScore');
    if(box)box.style.display='none';
    renderQuiz();
  }

  quizDialog.querySelector('.x').addEventListener('click',()=>quizDialog.close());
  quizBtn.addEventListener('click',()=>{resetQuiz();quizDialog.showModal()});
  $('#quizFinish').addEventListener('click',finishQuiz);
  $('#quizReset').addEventListener('click',resetQuiz);
},120);
