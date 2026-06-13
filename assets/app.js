/* ===========================================================
   김치 Phytate 학습 앱 — 로직
   =========================================================== */
const LS = "kimchi_phytate_progress_v1";
const state = load();
function load(){ try{return JSON.parse(localStorage.getItem(LS))||{}}catch(e){return {}} }
function save(){ localStorage.setItem(LS, JSON.stringify(state)); }
state.read = state.read || {};        // {c1:true,...}
state.quiz = state.quiz || {};        // {basic:6, inter:5}
let curChapter = 0, quizTab = "basic";

/* ---------- 네비게이션 ---------- */
const SECTIONS = [
  ["home","🏠","개요"],
  ["paper","📄","논문 원문"],
  ["chapters","📚","챕터 학습"],
  ["quiz","✏️","이해도 퀴즈"],
  ["think","💭","생각해볼 주제"],
  ["related","🔗","연관 주제 탐색"],
  ["report","📝","보고서 가이드"]
];

function buildNav(){
  const ul = document.getElementById("nav");
  ul.innerHTML = SECTIONS.map(([id,ic,label])=>`
    <li><button data-sec="${id}"><span>${ic}</span><span>${label}</span><span class="done" id="navdone-${id}"></span></button></li>`).join("");
  ul.querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>{ go(b.dataset.sec); ul.classList.remove("open"); }));
}

function go(sec){
  document.querySelectorAll(".section").forEach(s=>s.classList.toggle("active", s.id==="sec-"+sec));
  document.querySelectorAll("#nav button").forEach(b=>b.classList.toggle("active", b.dataset.sec===sec));
  window.scrollTo(0,0);
  if(sec==="quiz") renderQuiz();
}

/* ---------- 진행률 ---------- */
function updateProgress(){
  const total = CHAPTERS.length;
  const done = CHAPTERS.filter(c=>state.read[c.id]).length;
  document.getElementById("prog-text").textContent = `챕터 ${done}/${total} 읽음`;
  document.getElementById("prog-bar").style.width = (done/total*100)+"%";
  document.getElementById("navdone-chapters").textContent = done? `${done}/${total}`:"";
  const qb = state.quiz.basic, qi = state.quiz.inter;
  document.getElementById("navdone-quiz").textContent = (qb!=null||qi!=null)? "✓":"";
}

/* ---------- 홈 ---------- */
function renderHome(){
  document.getElementById("sec-home").innerHTML = `
    <h1 class="page">김치 유산균으로 현미의 ‘숨은 영양 방해꾼’ 없애기</h1>
    <p class="lead">논문 1편 + 짝꿍 특허 1건으로 배우는 김치 전문가 스터디 · 박성희 박사(세계김치연구소) 트랙</p>
    <div class="pair">
      <div class="card">
        <span class="tag">📄 논문</span>
        <h3 style="margin-top:10px">${PAPER.titleKo}</h3>
        <p class="kv">${PAPER.authors}</p>
        <p class="kv"><b>${PAPER.journal} (${PAPER.year})</b></p>
        <p class="kv">${PAPER.org}</p>
      </div>
      <div class="card">
        <span class="tag">⚙️ 특허</span>
        <h3 style="margin-top:10px">${PATENT.title}</h3>
        <p class="kv"><b>${PATENT.no}</b> · ${PATENT.owner}</p>
        <p class="kv">등록 ${PATENT.granted}</p>
        <p class="kv">${PATENT.deposit}</p>
      </div>
    </div>
    <div class="card" style="background:#fff3e9">
      <h3>한눈에 보는 스토리</h3>
      <p>현미는 몸에 좋지만 <b>피트산</b>이 무기질 흡수를 막습니다. 연구진은 김치에서 피트산 분해균
      <b><i>L. sakei</i> Wikim001</b>을 찾아 현미 피트산을 <b>절반 이하(약 57%)</b>로 줄였고,
      <b>같은 균주</b>가 발효현미 제조 <b>특허</b>로 이어졌습니다. ‘발견 → 상품화’ 한 편의 이야기입니다.</p>
      <button class="btn" onclick="go('chapters')">📚 챕터 학습 시작하기 →</button>
    </div>
    <h2>이렇게 학습하세요</h2>
    <div class="card">
      <p>① <b>논문 원문</b> 한번 훑기 → ② <b>챕터 8개</b>를 해설과 함께 읽고 ‘읽음’ 체크 →
      ③ <b>퀴즈 초급·중급</b>으로 점검 → ④ <b>생각해볼 주제·연관 주제</b>로 넓히기 →
      ⑤ <b>보고서 가이드</b>로 마무리. <br>진행 상황은 이 브라우저에 자동 저장됩니다.</p>
    </div>`;
}

/* ---------- 논문 원문 ---------- */
function renderPaper(){
  document.getElementById("sec-paper").innerHTML = `
    <h1 class="page">📄 논문 원문 보기</h1>
    <p class="lead">아래 버튼으로 공식 오픈액세스(무료) 원문 PDF를 볼 수 있습니다.</p>
    <div class="card">
      <span class="tag">학술논문</span>
      <h3 style="margin-top:10px">${PAPER.titleKo}</h3>
      <p style="color:var(--muted);font-style:italic">${PAPER.titleEn}</p>
      <p class="kv"><b>저자</b> ${PAPER.authors}</p>
      <p class="kv"><b>소속</b> ${PAPER.org}</p>
      <p class="kv"><b>출처</b> ${PAPER.journal} (${PAPER.year})</p>
      <p class="kv"><b>DOI</b> ${PAPER.doi}</p>
      <div style="margin-top:16px;display:flex;gap:10px;flex-wrap:wrap">
        <a class="btn" href="${PAPER.oaUrl}" target="_blank" rel="noopener">📥 원문 PDF 보기 (오픈액세스)</a>
        <a class="btn ghost" href="${PAPER.doiUrl}" target="_blank" rel="noopener">🔗 DOI로 이동</a>
      </div>
      <p class="src">${PAPER.oaNote}</p>
    </div>
    <div class="card">
      <span class="tag">⚙️ 짝꿍 특허</span>
      <h3 style="margin-top:10px">${PATENT.title}</h3>
      <p class="kv"><b>${PATENT.no}</b> · ${PATENT.owner} · 등록 ${PATENT.granted}</p>
      <a class="btn ghost sm" href="${PATENT.url}" target="_blank" rel="noopener" style="margin-top:8px">Google Patents에서 보기 →</a>
    </div>
    <div class="card" style="background:#f8f1ea">
      💡 원문이 어렵게 느껴지면, 먼저 <a href="#" onclick="go('chapters');return false">📚 챕터 학습</a>에서
      쉬운 해설을 읽은 뒤 원문을 보면 훨씬 잘 읽힙니다.
    </div>`;
}

/* ---------- 챕터 학습 ---------- */
function renderChapters(){
  const chips = CHAPTERS.map((c,i)=>{
    const cls = (state.read[c.id]?"read ":"") + (i===curChapter?"cur":"");
    return `<button class="${cls}" onclick="openChapter(${i})">${i+1}${state.read[c.id]?" ✓":""}</button>`;
  }).join("");
  const c = CHAPTERS[curChapter];
  document.getElementById("sec-chapters").innerHTML = `
    <h1 class="page">📚 챕터 학습</h1>
    <p class="lead">8개 챕터를 차례로 읽고 ‘읽음’을 체크하세요. 다 읽으면 퀴즈가 열립니다.</p>
    <div class="chip-row">${chips}</div>
    <div class="card">
      <span class="tag">CHAPTER ${curChapter+1} / ${CHAPTERS.length}</span>
      <h3 style="margin-top:10px;font-size:1.25rem">${c.title}</h3>
      <div class="tldr">📌 ${c.tldr}</div>
      <div class="body">${c.body.map(p=>`<p>${p}</p>`).join("")}</div>
      <div class="terms">
        <h4>🔑 핵심 용어</h4>
        ${c.terms.map(t=>`<div><b>${t.t}</b> — ${t.d}</div>`).join("")}
      </div>
      <p class="src">📖 원문 근거: ${c.src}</p>
      <div class="chap-nav">
        <button class="btn ghost" onclick="prevChapter()" ${curChapter===0?"disabled":""}>◀ 이전</button>
        <button class="btn" id="readbtn" onclick="toggleRead('${c.id}')">${state.read[c.id]?"✓ 읽음 (취소)":"읽음 표시하기"}</button>
        <button class="btn ghost" onclick="nextChapter()" ${curChapter===CHAPTERS.length-1?"disabled":""}>다음 ▶</button>
      </div>
    </div>`;
}
function openChapter(i){ curChapter=i; renderChapters(); window.scrollTo(0,0); }
function prevChapter(){ if(curChapter>0){curChapter--;renderChapters();window.scrollTo(0,0);} }
function nextChapter(){ if(curChapter<CHAPTERS.length-1){curChapter++;renderChapters();window.scrollTo(0,0);} }
function toggleRead(id){
  state.read[id] = !state.read[id]; save(); updateProgress();
  const allRead = CHAPTERS.every(c=>state.read[c.id]);
  if(state.read[id] && curChapter<CHAPTERS.length-1){ nextChapter(); }
  else { renderChapters(); }
  if(allRead) setTimeout(()=>{ if(confirm("모든 챕터를 읽었습니다! 이해도 퀴즈를 풀어볼까요?")) go("quiz"); },200);
}

/* ---------- 퀴즈 ---------- */
let qIdx=0, qScore=0, qAnswered=false;
function renderQuiz(){
  const allRead = CHAPTERS.every(c=>state.read[c.id]);
  const sec = document.getElementById("sec-quiz");
  const head = `<h1 class="page">✏️ 이해도 퀴즈</h1>
    <p class="lead">초급(사실 확인) → 중급(적용·분석) 순서로 풀어보세요.</p>
    <div class="tabs">
      <button class="${quizTab==='basic'?'active':''}" onclick="setTab('basic')">초급 (${QUIZ.basic.length})</button>
      <button class="${quizTab==='inter'?'active':''}" onclick="setTab('inter')">중급 (${QUIZ.inter.length})</button>
    </div>`;
  if(!allRead){
    sec.innerHTML = head + `<div class="card lock"><div class="big">🔒</div>
      <p>먼저 <b>챕터 8개를 모두 읽어</b> 주세요. (${CHAPTERS.filter(c=>state.read[c.id]).length}/${CHAPTERS.length} 읽음)</p>
      <button class="btn" onclick="go('chapters')">📚 챕터 학습으로</button>
      <p style="margin-top:14px"><button class="btn ghost sm" onclick="forceQuiz()">그래도 지금 풀기</button></p></div>`;
    return;
  }
  startQuiz(head);
}
function forceQuiz(){ startQuiz(`<h1 class="page">✏️ 이해도 퀴즈</h1>
    <div class="tabs">
      <button class="${quizTab==='basic'?'active':''}" onclick="setTab('basic')">초급 (${QUIZ.basic.length})</button>
      <button class="${quizTab==='inter'?'active':''}" onclick="setTab('inter')">중급 (${QUIZ.inter.length})</button>
    </div>`); }
function setTab(t){ quizTab=t; qIdx=0; qScore=0; renderQuiz(); }
function startQuiz(head){
  qIdx=0; qScore=0; qAnswered=false;
  document.getElementById("sec-quiz").innerHTML = head + `<div id="qbox"></div>`;
  renderQ();
}
function curList(){ return QUIZ[quizTab]; }
function correctIndex(item){ return item.type==='ox' ? (item.answer?0:1) : item.answer; }
function renderQ(){
  const list=curList(); const item=list[qIdx]; qAnswered=false;
  const choices = item.type==='ox' ? ['⭕ 맞다 (O)','❌ 아니다 (X)'] : item.choices;
  document.getElementById("qbox").innerHTML = `
    <div class="card">
      <div class="qmeta">문제 ${qIdx+1} / ${list.length} · ${quizTab==='basic'?'초급':'중급'}</div>
      <div class="q">${item.q}</div>
      <div class="choices">${choices.map((c,i)=>`<button class="choice" data-i="${i}">${c}</button>`).join("")}</div>
      <div class="why" id="why"></div>
      <div class="chap-nav" style="justify-content:flex-end"><button class="btn" id="qnext" disabled>다음 ▶</button></div>
    </div>`;
  document.querySelectorAll(".choice").forEach(b=>b.addEventListener("click",pickQ));
  document.getElementById("qnext").addEventListener("click",nextQ);
}
function pickQ(e){
  if(qAnswered) return; qAnswered=true;
  const item=curList()[qIdx]; const chosen=+e.target.dataset.i; const correct=correctIndex(item);
  document.querySelectorAll(".choice").forEach((b,i)=>{ b.disabled=true;
    if(i===correct)b.classList.add("correct"); if(i===chosen&&chosen!==correct)b.classList.add("wrong"); });
  if(chosen===correct)qScore++;
  const why=document.getElementById("why");
  why.innerHTML=(chosen===correct?"✅ 정답! ":"❌ 오답. ")+item.why; why.classList.add("show");
  document.getElementById("qnext").disabled=false;
}
function nextQ(){ const list=curList(); qIdx++; if(qIdx<list.length)renderQ(); else finishQuiz(); }
function finishQuiz(){
  const list=curList(); const pct=Math.round(qScore/list.length*100);
  state.quiz[quizTab]=qScore; save(); updateProgress();
  let msg = pct>=80?"훌륭해요! 잘 이해했어요 👍":pct>=50?"좋아요. 틀린 부분은 챕터로 복습!":"챕터를 한 번 더 읽어볼까요?";
  const nextBtn = quizTab==='basic' ? `<button class="btn" onclick="setTab('inter')">중급 도전 →</button>` :
    `<button class="btn" onclick="go('think')">💭 생각해볼 주제로 →</button>`;
  document.getElementById("qbox").innerHTML = `<div class="card score">
      <div class="big">${qScore} / ${list.length}</div>
      <p style="font-size:1.1rem;font-weight:700">${pct}점 · ${msg}</p>
      <div class="chap-nav" style="justify-content:center;gap:10px">
        <button class="btn ghost" onclick="setTab('${quizTab}')">다시 풀기</button>${nextBtn}
      </div></div>`;
}

/* ---------- 생각해볼 주제 ---------- */
function renderThink(){
  document.getElementById("sec-think").innerHTML = `
    <h1 class="page">💭 생각해볼 주제</h1>
    <p class="lead">정답이 없는 질문들입니다. 보고서에 깊이를 더하거나 발표 토론거리로 좋아요.</p>
    ${THINK.map((t,i)=>`<div class="think">
        <div class="qq">${i+1}. ${t.q}</div>
        <details><summary>생각 도우미 보기</summary><div class="hint">💡 ${t.hint}</div></details>
      </div>`).join("")}`;
}

/* ---------- 연관 주제 탐색 ---------- */
function renderRelated(){
  document.getElementById("sec-related").innerHTML = `
    <h1 class="page">🔗 연관 주제 탐색 도우미</h1>
    <p class="lead">더 알아보고 싶은 주제를 바로 검색해 보세요. (새 탭으로 열립니다)</p>
    ${RELATED.map(r=>{
      const g="https://scholar.google.com/scholar?q="+encodeURIComponent(r.kw);
      const s="https://scienceon.kisti.re.kr/search/totalSearch.do?query="+encodeURIComponent(r.kw);
      return `<div class="related">
        <div class="txt"><b>${r.t}</b><span>${r.d}</span></div>
        <div class="search-actions">
          <a class="btn sm" href="${g}" target="_blank" rel="noopener">Scholar</a>
          <a class="btn ghost sm" href="${s}" target="_blank" rel="noopener">ScienceON</a>
        </div></div>`;
    }).join("")}
    <div class="card" style="background:#f8f1ea;margin-top:18px">
      💡 검색어는 영어로 넣으면 결과가 더 잘 나옵니다. 마음에 드는 논문을 찾으면
      <code>papers/</code> 폴더에 저장하고 Claude에게 "스터디 노트 만들어줘"라고 하세요.
    </div>`;
}

/* ---------- 보고서 가이드 ---------- */
function renderReport(){
  const g=REPORT_GUIDE;
  document.getElementById("sec-report").innerHTML = `
    <h1 class="page">📝 보고서 작성 가이드</h1>
    <p class="lead">아래 구조·규칙을 지키면 과제 제출용 A4 1장 보고서가 완성됩니다.</p>
    <div class="card"><h3>보고서 1장 구조</h3>
      <table class="guide-table">${g.structure.map(([a,b])=>`<tr><td>${a}</td><td>${b}</td></tr>`).join("")}</table>
    </div>
    <div class="card"><h3>⚖️ 저작권·정확성 규칙</h3>
      <ul class="rules">${g.rules.map(r=>`<li>${r}</li>`).join("")}</ul></div>
    <div class="card"><h3>✅ 제출 전 체크리스트</h3>
      <ul class="check">${g.checklist.map(c=>`<li><label><input type="checkbox"> ${c}</label></li>`).join("")}</ul></div>
    <h2>📄 현재 작성된 보고서 (초안)</h2>
    <div class="report-md">${mdToHtml(g.current)}</div>
    <div class="card" style="background:#fff3e9;margin-top:18px">
      ✍️ 고치고 싶으면 Claude에게 "결론을 더 임팩트 있게", "특허 설명 더 쉽게"처럼 말하세요.
      완성되면 "한글 워드로 만들어줘"로 제출본을 받을 수 있습니다.
    </div>`;
}

/* 아주 작은 마크다운 → HTML 변환기 (제목/굵게/이탤릭/문단) */
function mdToHtml(md){
  return md.split("\n").map(line=>{
    line=line.replace(/\*\*(.+?)\*\*/g,"<b>$1</b>").replace(/\*(.+?)\*/g,"<em>$1</em>");
    if(line.startsWith("## ")) return "<h2>"+line.slice(3)+"</h2>";
    if(line.startsWith("# ")) return "<h1>"+line.slice(2)+"</h1>";
    if(line.trim()==="") return "";
    return "<p>"+line+"</p>";
  }).join("");
}

/* ---------- init ---------- */
function init(){
  buildNav();
  renderHome(); renderPaper(); renderChapters(); renderThink(); renderRelated(); renderReport();
  updateProgress();
  document.getElementById("menu-btn").addEventListener("click",()=>document.getElementById("nav").classList.toggle("open"));
  go("home");
}
init();
