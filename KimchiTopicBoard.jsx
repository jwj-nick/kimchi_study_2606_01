import React, { useState } from "react";

/*
  김치 논문·특허 주제 보드
  — 정렬·펼치기 없이 쭉 훑어보는 리스트. 박성희 박사 연구를 상단에 강조.
  팔레트: 소금물 종이 / 배추 청록 / 고춧가루 / 묵은지 골드 / 옹기
*/

const P = {
  sogeum: "#F3ECDD", paper: "#FBF7EE", ongi: "#2B211C",
  baechu: "#2F5D52", baechuLt: "#4A8576", gochu: "#BE3A2B",
  geumun: "#C9982E", geumunDeep: "#9A7420",
  ink: "#352D26", muted: "#897D6D", line: "rgba(43,33,28,0.10)",
};

// 박성희 박사 — 확인된 논문 + 검색 경로
const PARK = {
  name: "박성희 박사",
  org: "세계김치연구소",
  line: "김치 저장성 · 항균 유산균 · 종균 선발",
  papers: [
    {
      title: "김치의 저장성 향상을 위한 항균활성 우수 유산균 선발",
      journal: "한국식품영양과학회지 43권 2호 · 2014",
      gist: "유통 중 산도가 계속 올라 상품성이 떨어지는 문제에 주목 → 과숙 관여 균주를 찾고, 이를 억제하는 항균 유산균(Lc. lactis, Lb. brevis)을 적숙기 김치에서 선발. 종균 적용 가능성까지 확인.",
      role: "공저 (세계김치연구소)",
    },
  ],
  searchKeys: ["박성희 세계김치연구소", "김치 항균활성 유산균", "김치 저장성 종균"],
};

const TOPICS = [
  {
    n: "발효미생물", tag: "유산균·종균", mat: "기초발견(논문 중심)",
    diff: 2, data: 5, fit: 4,
    keys: ["김치 유산균", "김치 종균", "kimchi lactic acid bacteria"],
    paper: "김치 유산균의 장내 '기능 재설계' 원리 세계 최초 규명 (2026.4)",
    patent: "유산균 활용 발효 제어 특허 다수",
    note: "자료가 가장 풍부. 무난하지만 동기들과 겹칠 확률이 높음.",
  },
  {
    n: "건강·기능성", tag: "면역·항비만", mat: "기초·응용",
    diff: 2, data: 5, fit: 3,
    keys: ["김치 면역", "김치 항비만", "김치 장내미생물"],
    paper: "고지방식이 마우스 모델에서 김치의 비만 억제 효과",
    patent: "기능성 유산균 조성물 특허",
    note: "대중적 흥미는 높지만 '어떤 효능'으로 좁혀야 산만하지 않음.",
  },
  {
    n: "포장·저장", tag: "숙성도·가스", mat: "특허 중심", star: true,
    diff: 5, data: 4, fit: 3,
    keys: ["김치 포장", "김치 숙성도", "kimchi packaging"],
    paper: "최적 포장으로 김치종균 반감기 13.4→74.9일 (5배↑, 2026.5)",
    patent: "숙성도 식별 스티커(KR100231168B1) / TTI 지시계(KR20010103799A)",
    note: "특허 분석은 차별화 1순위. 다른 수강생이 잘 안 고름.",
  },
  {
    n: "제조·AI", tag: "스마트 발효", mat: "응용·특허",
    diff: 4, data: 3, fit: 3,
    keys: ["김치 절임", "김치 발효 예측", "김치 AI"],
    paper: "AI 발효 품질 예측 모델 (발효 영상 30만 시간 학습)",
    patent: "김치제조용 절임·숙성 탱크 장치",
    note: "'전통 발효의 디지털화' 각도. 엔지니어 감성과 잘 맞음.",
  },
  {
    n: "환경·신소재", tag: "미세플라스틱", mat: "최신 발견", star: true,
    diff: 5, data: 2, fit: 2,
    keys: ["김치 미세플라스틱", "김치 유산균 흡착", "kimchi nanoplastic"],
    paper: "김치 유산균이 나노플라스틱 87% 흡착·배출 (Bioresource Tech, IF 9.0, 2026.3)",
    patent: "관련 흡착 소재 특허 (탐색 중)",
    note: "최신성+의외성을 모두 잡는 카드. 발표 임팩트 최고.",
  },
  {
    n: "수출·산업", tag: "통상·표준", mat: "산업·제품",
    diff: 3, data: 4, fit: 3,
    keys: ["김치 수출", "김치 종주국", "kimchi export"],
    paper: "김치 수출액 2025년 약 1.5억 달러 돌파",
    patent: "파오차이 vs 김치 CODEX 통관 기준 이슈",
    note: "연도별 수출액 그래프로 1장 인포그래픽 만들기 좋음.",
  },
  {
    n: "양념·재료", tag: "고춧가루·젓갈", mat: "응용",
    diff: 3, data: 3, fit: 5,
    keys: ["김치 고춧가루", "김치 젓갈", "김치 양념 발효"],
    paper: "재료별 기능성·발효 영향 논문 다수",
    patent: "양념 배합·숙성 촉진 특허",
    note: "전문가 과정과 직접 연결. 전문성을 살리기 좋음.",
  },
  {
    n: "문화·역사", tag: "김장문화", mat: "인문",
    diff: 2, data: 4, fit: 4,
    keys: ["김장문화", "김치 역사", "유네스코 무형문화유산"],
    paper: "760년 이전 식단에 김치 / 고려 이규보 시에 김장 언급",
    patent: "유네스코 등재 대상은 '김치'가 아닌 '김장문화'(정확히 쓰면 가점)",
    note: "과학 주제와 짝지으면 '전통+현대 과학'으로 균형 잡힌 1장.",
  },
];

function Copyable({ text, color }) {
  const [done, setDone] = useState(false);
  return (
    <button onClick={() => navigator.clipboard?.writeText(text).then(() => { setDone(true); setTimeout(() => setDone(false), 1100); })}
      title="탭하면 복사"
      style={{
        fontSize: 12, padding: "4px 10px", borderRadius: 99, cursor: "pointer",
        border: `1px solid ${done ? color : "rgba(0,0,0,0.13)"}`,
        background: done ? color : "transparent", color: done ? "#fff" : P.ink,
        fontFamily: "'IBM Plex Mono', monospace", transition: "all .18s",
      }}>
      {done ? "복사됨 ✓" : text}
    </button>
  );
}

function Dots({ n, color, label }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, color: P.muted }}>
      {label}
      <span style={{ display: "inline-flex", gap: 2 }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <span key={i} style={{ width: 6, height: 6, borderRadius: 99, background: i <= n ? color : "rgba(0,0,0,0.12)" }} />
        ))}
      </span>
    </span>
  );
}

function TopicRow({ t, idx }) {
  const accent = t.star ? P.gochu : P.baechu;
  return (
    <div style={{ background: P.paper, borderRadius: 14, padding: 16, border: `1px solid ${P.line}` }}>
      <div className="flex items-center" style={{ gap: 10, marginBottom: 10 }}>
        <span style={{
          width: 26, height: 26, borderRadius: 7, background: accent, color: "#fff",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, fontWeight: 600, flexShrink: 0,
        }}>{idx}</span>
        <h3 style={{ fontFamily: "'Gowun Batang', serif", fontSize: 18, color: P.ink, margin: 0 }}>{t.n}</h3>
        {t.star && <span style={{ fontSize: 10, color: "#fff", background: P.gochu, padding: "2px 7px", borderRadius: 99 }}>차별화 추천</span>}
        <span style={{ marginLeft: "auto", fontSize: 11, color: P.muted }}>{t.tag} · {t.mat}</span>
      </div>

      <div className="flex flex-wrap" style={{ gap: 6, marginBottom: 12 }}>
        {t.keys.map((k) => <Copyable key={k} text={k} color={accent} />)}
      </div>

      <div style={{ fontSize: 13, lineHeight: 1.55, color: P.ink }}>
        <div style={{ marginBottom: 4 }}><span style={{ color: P.baechu, fontWeight: 600 }}>논문 </span>{t.paper}</div>
        <div style={{ marginBottom: 8 }}><span style={{ color: P.gochu, fontWeight: 600 }}>특허 </span>{t.patent}</div>
        <div style={{ fontSize: 12.5, color: P.muted, lineHeight: 1.5 }}>{t.note}</div>
      </div>

      <div className="flex flex-wrap" style={{ gap: 14, marginTop: 12, paddingTop: 10, borderTop: `1px dashed ${P.line}` }}>
        <Dots n={t.diff} color={P.gochu} label="차별화" />
        <Dots n={t.data} color={P.baechu} label="자료량" />
        <Dots n={t.fit} color={P.geumun} label="전문성" />
      </div>
    </div>
  );
}

export default function KimchiTopicBoard() {
  return (
    <div style={{ minHeight: "100vh", background: P.sogeum }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Gowun+Batang:wght@400;700&family=IBM+Plex+Sans+KR:wght@400;500;600&family=IBM+Plex+Mono:wght@500;600&display=swap');
        * { box-sizing: border-box; } body { margin: 0; }
        .tb, .tb * { font-family: 'IBM Plex Sans KR', sans-serif; }
      `}</style>

      <div className="tb" style={{ maxWidth: 600, margin: "0 auto", padding: "0 16px 48px" }}>
        {/* Header */}
        <header style={{ padding: "32px 4px 18px" }}>
          <div style={{ fontSize: 11, letterSpacing: 2.5, color: P.gochu, fontWeight: 600, marginBottom: 8 }}>
            사이언스온 과제 도우미
          </div>
          <h1 style={{ fontFamily: "'Gowun Batang', serif", fontSize: 29, lineHeight: 1.25, color: P.ongi, margin: 0 }}>
            김치 논문·특허<br />주제 보드
          </h1>
          <p style={{ fontSize: 13.5, color: P.muted, marginTop: 12, lineHeight: 1.6 }}>
            8개 주제를 쭉 훑어보고 끌리는 걸 고르세요. 키워드를 <b style={{ color: P.baechu }}>탭하면 복사</b>되니, 사이언스온에 그대로 붙여넣어 검색하면 됩니다.
          </p>
        </header>

        {/* 박성희 박사 강조 섹션 */}
        <section style={{
          background: P.ongi, borderRadius: 18, padding: 20, marginBottom: 22, color: "#fff",
          border: `2px solid ${P.geumun}`,
        }}>
          <div style={{ fontSize: 11, letterSpacing: 1.5, color: P.geumun, fontWeight: 600, marginBottom: 6 }}>
            ★ 특정 연구자 추적
          </div>
          <h2 style={{ fontFamily: "'Gowun Batang', serif", fontSize: 22, margin: "0 0 2px" }}>
            {PARK.name} <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>· {PARK.org}</span>
          </h2>
          <div style={{ fontSize: 12.5, color: P.geumun, marginBottom: 14 }}>{PARK.line}</div>

          {PARK.papers.map((p) => (
            <div key={p.title} style={{
              background: "rgba(255,255,255,0.07)", borderRadius: 12, padding: 14, marginBottom: 12,
              borderLeft: `3px solid ${P.geumun}`,
            }}>
              <div style={{ fontFamily: "'Gowun Batang', serif", fontSize: 16, lineHeight: 1.35, marginBottom: 4 }}>
                {p.title}
              </div>
              <div style={{ fontSize: 11, color: P.geumun, fontFamily: "'IBM Plex Mono', monospace", marginBottom: 8 }}>
                {p.journal} · {p.role}
              </div>
              <div style={{ fontSize: 12.5, lineHeight: 1.6, color: "rgba(255,255,255,0.9)" }}>{p.gist}</div>
            </div>
          ))}

          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.85)", lineHeight: 1.6, marginBottom: 10 }}>
            <b style={{ color: P.geumun }}>전체 논문 찾기</b> · 동명이인이 있어 직접 확인이 정확합니다. 아래 키워드로 사이언스온·DBpia 저자 검색 → '세계김치연구소' 소속만 추리면 박성희 박사 논문 목록이 나옵니다.
          </div>
          <div className="flex flex-wrap" style={{ gap: 6 }}>
            {PARK.searchKeys.map((k) => <Copyable key={k} text={k} color={P.geumun} />)}
          </div>
          <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.65)", marginTop: 12, lineHeight: 1.5 }}>
            보고서 각도: "과숙(시어짐)을 막는 유산균" — 문제→해결이 명확해 1장으로 정리하기 좋습니다.
          </div>
        </section>

        {/* 전체 주제 리스트 */}
        <div style={{ fontSize: 12, color: P.muted, fontWeight: 600, letterSpacing: 1, margin: "0 4px 12px" }}>
          전체 주제 8
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {TOPICS.map((t, i) => <TopicRow key={t.n} t={t} idx={i + 1} />)}
        </div>

        {/* 점수 안내 */}
        <div style={{
          marginTop: 20, background: P.paper, borderRadius: 12, padding: 14,
          border: `1px solid ${P.line}`, fontSize: 11.5, color: P.muted, lineHeight: 1.6,
        }}>
          <b style={{ color: P.ink }}>점수 읽는 법</b> · 검색으로 추린 상대 평가예요.
          <span style={{ color: P.gochu }}> 차별화</span>가 높으면 남들이 안 하는 주제,
          <span style={{ color: P.baechu }}> 자료량</span>이 높으면 쓰기 쉬움,
          <span style={{ color: P.geumunDeep }}> 전문성</span>이 높으면 김치 전문가 과정과 잘 맞는 주제입니다.
        </div>

        <footer style={{ textAlign: "center", marginTop: 24, fontSize: 11.5, color: P.muted, lineHeight: 1.6 }}>
          숫자는 참고일 뿐, 직접 사이언스온에서 검색해 확인하는 게 과제의 핵심 · 제출 6/18
        </footer>
      </div>
    </div>
  );
}
