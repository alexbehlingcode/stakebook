import { useState, useMemo } from "react";
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

/* ═══════════════════════════════════════════════════════
   STAKEBOOK — The Personal Betting Journal
   "Track smarter. Bet better. Stay honest."
   ═══════════════════════════════════════════════════════ */

const SPORTS = ["NFL","NBA","MLB","NHL","Soccer","Tennis","Golf","MMA","NCAA FB","NCAA BB","Other"];
const BET_TYPES = ["Moneyline","Spread","Over/Under","Parlay","Prop","Futures","Live Bet","Teaser","Round Robin","Other"];
const OUTCOMES = ["Win","Loss","Push","Pending"];
const SPORTSBOOKS = ["FanDuel","DraftKings","BetMGM","Caesars","Bet365","PointsBet","Hard Rock","ESPN Bet","Fanatics","Other"];
const TIME_PERIODS = [
  { id:"7d", label:"7 Days" },
  { id:"30d", label:"30 Days" },
  { id:"month", label:"This Month" },
  { id:"quarter", label:"Quarter" },
  { id:"year", label:"Year" },
  { id:"all", label:"All Time" },
];

const SAMPLE_BETS = [
  { id:"s1", date:"2026-02-28", sport:"NBA", betType:"Spread", team:"Celtics -4.5", odds:-110, stake:50, outcome:"Win", payout:95.45, sportsbook:"FanDuel", notes:"Celtics at home, strong ATS record this month.", confidence:4 },
  { id:"s2", date:"2026-02-27", sport:"NFL", betType:"Moneyline", team:"Chiefs", odds:-150, stake:75, outcome:"Win", payout:125, sportsbook:"DraftKings", notes:"Mahomes in prime form.", confidence:5 },
  { id:"s3", date:"2026-02-27", sport:"NBA", betType:"Over/Under", team:"Lakers/Warriors O224.5", odds:-105, stake:40, outcome:"Loss", payout:0, sportsbook:"BetMGM", notes:"Pace was slower than expected.", confidence:3 },
  { id:"s4", date:"2026-02-26", sport:"NHL", betType:"Moneyline", team:"Maple Leafs", odds:130, stake:30, outcome:"Win", payout:69, sportsbook:"Bet365", notes:"Value play — Leafs underrated on the road.", confidence:3 },
  { id:"s5", date:"2026-02-26", sport:"NBA", betType:"Parlay", team:"3-leg: Bucks ML / Nuggets -3 / Knicks ML", odds:550, stake:20, outcome:"Loss", payout:0, sportsbook:"FanDuel", notes:"Knicks blew the lead in Q4.", confidence:2 },
  { id:"s6", date:"2026-02-25", sport:"Soccer", betType:"Moneyline", team:"Arsenal", odds:-120, stake:60, outcome:"Win", payout:110, sportsbook:"DraftKings", notes:"Arsenal dominant at home.", confidence:5 },
  { id:"s7", date:"2026-02-24", sport:"NBA", betType:"Prop", team:"Jokic O11.5 rebounds", odds:-115, stake:45, outcome:"Win", payout:84.13, sportsbook:"Caesars", notes:"Jokic averaging 13.2 reb last 10.", confidence:4 },
  { id:"s8", date:"2026-02-23", sport:"MLB", betType:"Futures", team:"Dodgers to win WS", odds:450, stake:25, outcome:"Pending", payout:0, sportsbook:"FanDuel", notes:"Stacked roster again.", confidence:3 },
  { id:"s9", date:"2026-02-22", sport:"MMA", betType:"Moneyline", team:"Islam Makhachev", odds:-200, stake:100, outcome:"Win", payout:150, sportsbook:"DraftKings", notes:"Dominant grappler.", confidence:5 },
  { id:"s10",date:"2026-02-21", sport:"NBA", betType:"Spread", team:"76ers +6.5", odds:-110, stake:55, outcome:"Loss", payout:0, sportsbook:"BetMGM", notes:"Embiid sat out. Should have waited.", confidence:2 },
  { id:"s11",date:"2026-02-20", sport:"NCAA BB", betType:"Moneyline", team:"Duke", odds:-180, stake:35, outcome:"Win", payout:54.44, sportsbook:"Caesars", notes:"Duke at home in Cameron.", confidence:4 },
  { id:"s12",date:"2026-02-18", sport:"NFL", betType:"Prop", team:"Lamar Jackson O1.5 pass TDs", odds:100, stake:50, outcome:"Win", payout:100, sportsbook:"FanDuel", notes:"Good value at even odds.", confidence:4 },
  { id:"s13",date:"2026-02-15", sport:"NBA", betType:"Moneyline", team:"Thunder", odds:-140, stake:70, outcome:"Win", payout:120, sportsbook:"DraftKings", notes:"SGA on fire.", confidence:5 },
  { id:"s14",date:"2026-02-12", sport:"Tennis", betType:"Moneyline", team:"Sinner", odds:-160, stake:40, outcome:"Loss", payout:0, sportsbook:"Bet365", notes:"Upset special.", confidence:3 },
  { id:"s15",date:"2026-02-10", sport:"NBA", betType:"Over/Under", team:"Heat/Pacers O228", odds:-110, stake:55, outcome:"Win", payout:105, sportsbook:"FanDuel", notes:"Classic over spot.", confidence:4 },
  { id:"s16",date:"2026-02-08", sport:"NHL", betType:"Spread", team:"Oilers -1.5", odds:140, stake:25, outcome:"Loss", payout:0, sportsbook:"BetMGM", notes:"McDavid went cold.", confidence:2 },
  { id:"s17",date:"2026-02-05", sport:"NBA", betType:"Live Bet", team:"Mavericks ML (in-game)", odds:180, stake:30, outcome:"Win", payout:84, sportsbook:"DraftKings", notes:"Luka went off in Q3.", confidence:3 },
  { id:"s18",date:"2026-02-02", sport:"Soccer", betType:"Over/Under", team:"Man City/Liverpool O2.5", odds:-130, stake:65, outcome:"Win", payout:115, sportsbook:"Caesars", notes:"Derby match. Goals guaranteed.", confidence:5 },
  { id:"s19",date:"2026-01-30", sport:"NBA", betType:"Spread", team:"Cavaliers -3", odds:-110, stake:50, outcome:"Win", payout:95.45, sportsbook:"FanDuel", notes:"Cavs rolling at home.", confidence:4 },
  { id:"s20",date:"2026-01-28", sport:"NFL", betType:"Moneyline", team:"Bills", odds:-130, stake:65, outcome:"Loss", payout:0, sportsbook:"DraftKings", notes:"Bills choked in the 4th.", confidence:4 },
  { id:"s21",date:"2026-01-25", sport:"NBA", betType:"Parlay", team:"2-leg: Celtics ML / Warriors ML", odds:260, stake:25, outcome:"Win", payout:90, sportsbook:"BetMGM", notes:"Both heavy favorites at home.", confidence:4 },
  { id:"s22",date:"2026-01-22", sport:"NHL", betType:"Moneyline", team:"Panthers", odds:-145, stake:45, outcome:"Win", payout:76.03, sportsbook:"Bet365", notes:"Panthers defense is elite.", confidence:4 },
  { id:"s23",date:"2026-01-19", sport:"Soccer", betType:"Moneyline", team:"Real Madrid", odds:-110, stake:55, outcome:"Win", payout:105, sportsbook:"DraftKings", notes:"La Liga dominance.", confidence:4 },
  { id:"s24",date:"2026-01-15", sport:"NBA", betType:"Prop", team:"LeBron O7.5 assists", odds:110, stake:30, outcome:"Loss", payout:0, sportsbook:"FanDuel", notes:"LeBron was in scoring mode.", confidence:3 },
  { id:"s25",date:"2026-01-12", sport:"NFL", betType:"Spread", team:"Eagles -7", odds:-110, stake:60, outcome:"Win", payout:114.55, sportsbook:"Caesars", notes:"Eagles dominated at home.", confidence:5 },
  { id:"s26",date:"2026-01-08", sport:"NBA", betType:"Moneyline", team:"Nuggets", odds:-155, stake:50, outcome:"Win", payout:82.26, sportsbook:"DraftKings", notes:"Altitude advantage.", confidence:4 },
  { id:"s27",date:"2026-01-05", sport:"NCAA BB", betType:"Spread", team:"UConn -5.5", odds:-110, stake:40, outcome:"Loss", payout:0, sportsbook:"BetMGM", notes:"UConn coasted.", confidence:3 },
  { id:"s28",date:"2026-01-02", sport:"NHL", betType:"Over/Under", team:"Rangers/Bruins O5.5", odds:105, stake:35, outcome:"Win", payout:71.75, sportsbook:"FanDuel", notes:"Both teams scoring a ton.", confidence:3 },
  { id:"s29",date:"2025-12-30", sport:"NBA", betType:"Moneyline", team:"Bucks", odds:-170, stake:85, outcome:"Win", payout:135, sportsbook:"DraftKings", notes:"Giannis healthy.", confidence:5 },
  { id:"s30",date:"2025-12-28", sport:"NFL", betType:"Moneyline", team:"Ravens", odds:-200, stake:100, outcome:"Win", payout:150, sportsbook:"FanDuel", notes:"Lamar MVP season.", confidence:5 },
  { id:"s31",date:"2025-12-25", sport:"NBA", betType:"Spread", team:"Lakers +3", odds:-110, stake:55, outcome:"Loss", payout:0, sportsbook:"BetMGM", notes:"Christmas Day trap.", confidence:3 },
  { id:"s32",date:"2025-12-22", sport:"Soccer", betType:"Moneyline", team:"Barcelona", odds:-135, stake:50, outcome:"Win", payout:87.04, sportsbook:"Caesars", notes:"Barca flying.", confidence:4 },
  { id:"s33",date:"2025-12-19", sport:"NHL", betType:"Moneyline", team:"Avalanche", odds:-125, stake:40, outcome:"Loss", payout:0, sportsbook:"Bet365", notes:"Avs missing key players.", confidence:2 },
  { id:"s34",date:"2025-12-16", sport:"NBA", betType:"Over/Under", team:"Suns/Kings O232", odds:-110, stake:50, outcome:"Win", payout:95.45, sportsbook:"FanDuel", notes:"Two fastest paced teams.", confidence:4 },
  { id:"s35",date:"2025-12-12", sport:"NCAA FB", betType:"Spread", team:"Ohio State -3.5", odds:-110, stake:60, outcome:"Win", payout:114.55, sportsbook:"DraftKings", notes:"Playoff game, OSU motivated.", confidence:4 },
  { id:"s36",date:"2025-12-08", sport:"NFL", betType:"Parlay", team:"3-leg: Chiefs / Bengals / Bills", odds:600, stake:15, outcome:"Loss", payout:0, sportsbook:"FanDuel", notes:"Bengals let me down.", confidence:2 },
  { id:"s37",date:"2025-12-05", sport:"NBA", betType:"Moneyline", team:"Wolves", odds:120, stake:40, outcome:"Win", payout:88, sportsbook:"BetMGM", notes:"Wolves undervalued.", confidence:3 },
  { id:"s38",date:"2025-12-02", sport:"MMA", betType:"Moneyline", team:"Alex Pereira", odds:-175, stake:70, outcome:"Win", payout:110, sportsbook:"DraftKings", notes:"Pereira's power too much.", confidence:4 },
];

// ── Helpers ──
const fmt = n => new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format(n);
const fmtPct = n => (n*100).toFixed(1)+"%";
const uid = () => Date.now().toString(36)+Math.random().toString(36).slice(2,7);
const calcPayout = (stake,odds) => { const s=parseFloat(stake),o=parseInt(odds); if(isNaN(s)||isNaN(o))return 0; return o>0?s+s*(o/100):s+s*(100/Math.abs(o)); };

// ── Theme: Refined, warm, finance-app ──
const T = {
  bg:"#F5F3EE", card:"#FFFFFF", border:"#E4E0D8", text:"#1C1917", sub:"#78716C", light:"#A8A29E",
  brand:"#1B4332", brandLight:"#D8F3DC", brandMid:"#40916C",
  red:"#C81E1E", redBg:"#FEE2E2", orange:"#C2410C", orangeBg:"#FFF7ED",
  blue:"#1D4ED8", blueBg:"#DBEAFE", gold:"#CA8A04", goldBg:"#FEF9C3",
  chart:["#1B4332","#1D4ED8","#C2410C","#C81E1E","#7C3AED","#40916C","#CA8A04","#059669","#DB2777","#0891B2","#4F46E5"],
  shadow:"0 1px 2px rgba(0,0,0,0.04),0 1px 3px rgba(0,0,0,0.06)",
  shadowM:"0 4px 12px rgba(0,0,0,0.06)",
  shadowL:"0 12px 32px rgba(0,0,0,0.1)",
  r:"14px", rs:"8px",
  body:"'Outfit', system-ui, sans-serif",
  display:"'Instrument Serif', Georgia, serif",
};

const S = {
  app:{fontFamily:T.body,background:T.bg,color:T.text,minHeight:"100vh",fontSize:"14px",lineHeight:1.5},
  maxW:{maxWidth:1200,margin:"0 auto",padding:"0 20px"},
  header:{background:"rgba(255,255,255,0.88)",backdropFilter:"blur(16px)",borderBottom:`1px solid ${T.border}`,padding:"14px 0",position:"sticky",top:0,zIndex:100},
  hInner:{maxWidth:1200,margin:"0 auto",padding:"0 20px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12},
  logo:{fontFamily:T.display,fontSize:24,fontWeight:400,color:T.brand,letterSpacing:"-0.01em",display:"flex",alignItems:"center",gap:10,fontStyle:"italic"},
  nav:{display:"flex",gap:2,background:T.bg,borderRadius:10,padding:3},
  navBtn:a=>({padding:"7px 15px",borderRadius:8,border:"none",cursor:"pointer",fontSize:13,fontWeight:500,fontFamily:T.body,background:a?"#FFF":"transparent",color:a?T.text:T.sub,boxShadow:a?T.shadow:"none",transition:"all 0.2s"}),
  sec:{padding:"24px 0"},
  card:{background:T.card,borderRadius:T.r,border:`1px solid ${T.border}`,padding:24,boxShadow:T.shadow},
  cTitle:{fontFamily:T.display,fontSize:18,fontWeight:400,marginBottom:16,color:T.text,fontStyle:"italic"},
  g2:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))",gap:16},
  g4:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:12},
  stat:()=>({background:T.card,borderRadius:T.r,border:`1px solid ${T.border}`,padding:20,display:"flex",flexDirection:"column",gap:4}),
  sLabel:{fontSize:11,fontWeight:600,color:T.sub,textTransform:"uppercase",letterSpacing:"0.06em"},
  sVal:c=>({fontFamily:T.display,fontSize:30,fontWeight:400,color:c||T.text,letterSpacing:"-0.02em",lineHeight:1.1,fontStyle:"italic"}),
  sSub:{fontSize:12,color:T.sub},
  input:{width:"100%",padding:"10px 12px",borderRadius:T.rs,border:`1px solid ${T.border}`,fontSize:14,fontFamily:T.body,background:"#FAFAF7",outline:"none",boxSizing:"border-box",transition:"border 0.2s"},
  select:{width:"100%",padding:"10px 12px",borderRadius:T.rs,border:`1px solid ${T.border}`,fontSize:14,fontFamily:T.body,background:"#FAFAF7",outline:"none",boxSizing:"border-box",appearance:"none",cursor:"pointer"},
  label:{fontSize:11,fontWeight:600,color:T.sub,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:6,display:"block"},
  btn:v=>({padding:"10px 20px",borderRadius:T.rs,border:"none",cursor:"pointer",fontSize:14,fontWeight:600,fontFamily:T.body,transition:"all 0.15s",...(v==="primary"?{background:T.brand,color:"#fff"}:v==="danger"?{background:T.redBg,color:T.red}:{background:"transparent",color:T.sub,border:`1px solid ${T.border}`})}),
  tag:(c,bg)=>({display:"inline-block",padding:"3px 10px",borderRadius:6,fontSize:11,fontWeight:700,color:c,background:bg,letterSpacing:"0.02em"}),
  table:{width:"100%",borderCollapse:"separate",borderSpacing:0,fontSize:13},
  th:{textAlign:"left",padding:"10px 12px",fontSize:10,fontWeight:700,color:T.sub,textTransform:"uppercase",letterSpacing:"0.06em",borderBottom:`1px solid ${T.border}`},
  td:{padding:"12px",borderBottom:`1px solid ${T.border}10`,verticalAlign:"middle"},
  fb:{display:"flex",justifyContent:"space-between",alignItems:"center"},
  overlay:{position:"fixed",inset:0,background:"rgba(28,25,23,0.35)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,backdropFilter:"blur(6px)"},
  modal:{background:T.card,borderRadius:18,padding:28,maxWidth:560,width:"92%",maxHeight:"85vh",overflowY:"auto",boxShadow:T.shadowL},
  pill:a=>({padding:"5px 14px",borderRadius:20,border:`1.5px solid ${a?T.brand:T.border}`,background:a?T.brandLight:"transparent",color:a?T.brand:T.sub,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:T.body,transition:"all 0.15s",whiteSpace:"nowrap"}),
};

const Fonts = () => <style>{`@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Outfit:wght@300;400;500;600;700&display=swap');`}</style>;

// ── SVG Icons ──
const I = ({n,s=18,c="currentColor"}) => {
  const p={
    plus:<path d="M12 5v14M5 12h14" strokeWidth="2" strokeLinecap="round"/>,
    trend:<><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><polyline points="17 6 23 6 23 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></>,
    shield:<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeWidth="2"/>,
    book:<><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" strokeWidth="2"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" strokeWidth="2"/></>,
    chart:<><line x1="18" y1="20" x2="18" y2="10" strokeWidth="2" strokeLinecap="round"/><line x1="12" y1="20" x2="12" y2="4" strokeWidth="2" strokeLinecap="round"/><line x1="6" y1="20" x2="6" y2="14" strokeWidth="2" strokeLinecap="round"/></>,
    alert:<><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" strokeWidth="2"/><line x1="12" y1="9" x2="12" y2="13" strokeWidth="2"/><line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="2"/></>,
    x:<><line x1="18" y1="6" x2="6" y2="18" strokeWidth="2" strokeLinecap="round"/><line x1="6" y1="6" x2="18" y2="18" strokeWidth="2" strokeLinecap="round"/></>,
    edit:<><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" strokeWidth="2"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" strokeWidth="2"/></>,
    trash:<><polyline points="3 6 5 6 21 6" strokeWidth="2"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" strokeWidth="2"/></>,
    heart:<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" strokeWidth="2"/>,
    eye:<><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeWidth="2"/><circle cx="12" cy="12" r="3" strokeWidth="2"/></>,
    cal:<><rect x="3" y="4" width="18" height="18" rx="2" strokeWidth="2"/><line x1="16" y1="2" x2="16" y2="6" strokeWidth="2"/><line x1="8" y1="2" x2="8" y2="6" strokeWidth="2"/><line x1="3" y1="10" x2="21" y2="10" strokeWidth="2"/></>,
    up:<><line x1="12" y1="19" x2="12" y2="5" strokeWidth="2" strokeLinecap="round"/><polyline points="5 12 12 5 19 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></>,
    down:<><line x1="12" y1="5" x2="12" y2="19" strokeWidth="2" strokeLinecap="round"/><polyline points="19 12 12 19 5 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></>,
    star:<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" strokeWidth="2" strokeLinejoin="round"/>,
  };
  return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} style={{flexShrink:0}}>{p[n]}</svg>;
};

// ── Sub-components ──
const Stars = ({v,onChange,sz=16}) => (
  <div style={{display:"flex",gap:2,cursor:onChange?"pointer":"default"}}>
    {[1,2,3,4,5].map(i=>(
      <svg key={i} width={sz} height={sz} viewBox="0 0 24 24" fill={i<=v?T.gold:"none"} stroke={i<=v?T.gold:T.light} strokeWidth="2" onClick={()=>onChange&&onChange(i)} style={{cursor:onChange?"pointer":"default"}}>
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ))}
  </div>
);

const OTag = ({o}) => {
  const m={Win:{c:T.brand,b:T.brandLight},Loss:{c:T.red,b:T.redBg},Push:{c:T.sub,b:T.bg},Pending:{c:T.gold,b:T.goldBg}};
  const x=m[o]||m.Pending;
  return <span style={S.tag(x.c,x.b)}>{o}</span>;
};

const Ring = ({score,size=140}) => {
  const r=(size-12)/2,circ=2*Math.PI*r,off=circ-(score/100)*circ;
  const c=score>=75?T.brand:score>=50?T.orange:T.red;
  return (
    <svg width={size} height={size} style={{transform:"rotate(-90deg)"}}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={T.bg} strokeWidth={8}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={c} strokeWidth={8} strokeDasharray={circ} strokeDashoffset={off} strokeLinecap="round" style={{transition:"stroke-dashoffset 0.8s ease"}}/>
      <text x={size/2} y={size/2} textAnchor="middle" dominantBaseline="central" style={{transform:"rotate(90deg)",transformOrigin:"center",fontFamily:T.display,fontSize:size*0.3,fontWeight:400,fill:c,fontStyle:"italic"}}>{score}</text>
    </svg>
  );
};

// ── Time helpers ──
function getCutoff(id) {
  const now=new Date(2026,2,1);
  const d=new Date(now.getFullYear(),now.getMonth(),now.getDate());
  switch(id){
    case "7d":return new Date(d.getTime()-7*864e5);
    case "30d":return new Date(d.getTime()-30*864e5);
    case "month":return new Date(d.getFullYear(),d.getMonth(),1);
    case "quarter":{const q=Math.floor(d.getMonth()/3)*3;return new Date(d.getFullYear(),q,1);}
    case "year":return new Date(d.getFullYear(),0,1);
    default:return new Date(2000,0,1);
  }
}
function getPrev(id) {
  const now=new Date(2026,2,1);
  const d=new Date(now.getFullYear(),now.getMonth(),now.getDate());
  switch(id){
    case "7d":{const e=new Date(d.getTime()-7*864e5);return{s:new Date(e.getTime()-7*864e5),e};}
    case "30d":{const e=new Date(d.getTime()-30*864e5);return{s:new Date(e.getTime()-30*864e5),e};}
    case "month":{const e=new Date(d.getFullYear(),d.getMonth(),1);return{s:new Date(e.getFullYear(),e.getMonth()-1,1),e};}
    case "quarter":{const q=Math.floor(d.getMonth()/3)*3;const e=new Date(d.getFullYear(),q,1);return{s:new Date(d.getFullYear(),q-3,1),e};}
    case "year":{const e=new Date(d.getFullYear(),0,1);return{s:new Date(d.getFullYear()-1,0,1),e};}
    default:return null;
  }
}

// ═══ MAIN ═══
export default function Stakebook() {
  const [tab,setTab]=useState("dashboard");
  const [bets,setBets]=useState(SAMPLE_BETS);
  const [showAdd,setShowAdd]=useState(false);
  const [editing,setEditing]=useState(null);
  const [viewing,setViewing]=useState(null);
  const [tp,setTp]=useState("30d");
  const [settings,setSettings]=useState({bankroll:1000,dailyLimit:200,weeklyLimit:800,monthlyLimit:2000,maxStake:100,lossStreakAlert:3});

  const filtered=useMemo(()=>{const c=getCutoff(tp);return bets.filter(b=>new Date(b.date)>=c);},[bets,tp]);
  const prevBets=useMemo(()=>{const p=getPrev(tp);if(!p)return[];return bets.filter(b=>{const d=new Date(b.date);return d>=p.s&&d<p.e;});},[bets,tp]);

  const A=useMemo(()=>{
    const set=filtered.filter(b=>b.outcome!=="Pending");
    const w=set.filter(b=>b.outcome==="Win"),l=set.filter(b=>b.outcome==="Loss");
    const stk=set.reduce((a,b)=>a+b.stake,0),pay=set.reduce((a,b)=>a+(b.payout||0),0);
    const net=pay-stk,roi=stk>0?net/stk:0,wr=set.length>0?w.length/set.length:0;

    const ps=prevBets.filter(b=>b.outcome!=="Pending");
    const pStk=ps.reduce((a,b)=>a+b.stake,0),pPay=ps.reduce((a,b)=>a+(b.payout||0),0);
    const pNet=pPay-pStk,pRoi=pStk>0?pNet/pStk:0,pWr=ps.length>0?ps.filter(b=>b.outcome==="Win").length/ps.length:0;

    const bySport={},byType={},byBook={};
    set.forEach(b=>{
      [[bySport,b.sport],[byType,b.betType],[byBook,b.sportsbook]].forEach(([o,k])=>{
        if(!o[k])o[k]={w:0,l:0,p:0,stk:0,pnl:0,n:0};
        o[k].n++;o[k].stk+=b.stake;o[k].pnl+=(b.payout||0)-b.stake;
        if(b.outcome==="Win")o[k].w++;else if(b.outcome==="Loss")o[k].l++;else o[k].p++;
      });
    });

    const sorted=[...set].sort((a,b)=>new Date(a.date)-new Date(b.date));
    let cum=0;
    const timeline=sorted.map(b=>{cum+=(b.payout||0)-b.stake;return{date:b.date,profit:Math.round(cum*100)/100};});

    const recent=[...set].sort((a,b)=>new Date(b.date)-new Date(a.date));
    let cs=0;
    for(let i=0;i<recent.length;i++){if(i===0){cs=recent[i].outcome==="Win"?1:-1;continue;}if(recent[i].outcome==="Win"&&cs>0)cs++;else if(recent[i].outcome==="Loss"&&cs<0)cs--;else break;}
    let mw=0,ml=0,ts=0;
    sorted.forEach(b=>{if(b.outcome==="Win"){ts=ts>0?ts+1:1;mw=Math.max(mw,ts);}else{ts=ts<0?ts-1:-1;ml=Math.max(ml,Math.abs(ts));}});

    const acw=w.length>0?w.reduce((a,b)=>a+(b.confidence||3),0)/w.length:0;
    const acl=l.length>0?l.reduce((a,b)=>a+(b.confidence||3),0)/l.length:0;

    const today="2026-03-01";
    const tStk=bets.filter(b=>b.date===today).reduce((a,b)=>a+b.stake,0);
    const now=new Date(2026,2,1);const wa=new Date(now.getTime()-7*864e5);
    const wStk=bets.filter(b=>new Date(b.date)>=wa).reduce((a,b)=>a+b.stake,0);
    const ms=new Date(now.getFullYear(),now.getMonth(),1);
    const mStk=bets.filter(b=>new Date(b.date)>=ms).reduce((a,b)=>a+b.stake,0);

    let hp=100;
    if(tStk>settings.dailyLimit)hp-=20;if(wStk>settings.weeklyLimit)hp-=15;
    if(cs<-2)hp-=(Math.abs(cs)-2)*10;if(roi<-0.1)hp-=15;if(wr<0.4&&set.length>5)hp-=10;
    const avg=stk/(set.length||1);if(avg>settings.bankroll*0.1)hp-=10;
    hp=Math.max(0,Math.min(100,hp));

    return{total:filtered.length,setN:set.length,w:w.length,l:l.length,push:set.filter(b=>b.outcome==="Push").length,pend:filtered.filter(b=>b.outcome==="Pending").length,stk,pay,net,roi,wr,pNet,pRoi,pWr,pStk,bySport,byType,byBook,timeline,cs,mw,ml,acw,acl,tStk,wStk,mStk,hp,avg};
  },[filtered,prevBets,bets,settings]);

  const emptyBet={date:new Date().toISOString().slice(0,10),sport:"NBA",betType:"Moneyline",team:"",odds:"",stake:"",outcome:"Pending",payout:"",sportsbook:"FanDuel",notes:"",confidence:3};

  const saveBet=bet=>{
    const pay=bet.outcome==="Win"?calcPayout(bet.stake,bet.odds):bet.outcome==="Push"?parseFloat(bet.stake):0;
    const fb={...bet,stake:parseFloat(bet.stake)||0,odds:parseInt(bet.odds)||0,payout:bet.outcome==="Pending"?0:pay};
    if(editing){setBets(p=>p.map(b=>b.id===editing.id?{...fb,id:editing.id}:b));setEditing(null);}
    else setBets(p=>[{...fb,id:uid()},...p]);
    setShowAdd(false);
  };
  const delBet=id=>{setBets(p=>p.filter(b=>b.id!==id));setViewing(null);};

  const alerts=useMemo(()=>{
    const a=[];
    if(A.tStk>=settings.dailyLimit*0.8)a.push({t:A.tStk>=settings.dailyLimit?"d":"w",m:`Daily limit: ${fmt(A.tStk)} of ${fmt(settings.dailyLimit)} used`});
    if(A.wStk>=settings.weeklyLimit*0.8)a.push({t:A.wStk>=settings.weeklyLimit?"d":"w",m:`Weekly limit: ${fmt(A.wStk)} of ${fmt(settings.weeklyLimit)} used`});
    if(A.cs<=-settings.lossStreakAlert)a.push({t:"d",m:`${Math.abs(A.cs)}-bet losing streak. Consider taking a break.`});
    return a;
  },[A,settings]);

  const Delta=({cur,prev,f="$"})=>{
    if(!prev&&!cur)return null;const d=cur-prev;if(Math.abs(d)<0.001)return null;
    const up=d>0,good=up;
    const txt=f==="$"?(up?"+":"")+fmt(d):(up?"+":"")+(d*100).toFixed(1)+"%";
    return <span style={{display:"inline-flex",alignItems:"center",gap:3,fontSize:10,fontWeight:700,color:good?T.brand:T.red,background:good?T.brandLight:T.redBg,padding:"2px 7px",borderRadius:5}}><I n={up?"up":"down"} s={9} c={good?T.brand:T.red}/>{txt}</span>;
  };

  const TPBar=()=>(
    <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
      <I n="cal" s={14} c={T.sub}/>
      {TIME_PERIODS.map(p=><button key={p.id} style={S.pill(tp===p.id)} onClick={()=>setTp(p.id)}>{p.label}</button>)}
    </div>
  );

  // ═══ LOGO ═══
  const Logo = () => (
    <div style={S.logo}>
      <svg width="30" height="30" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="8" fill={T.brand}/>
        <path d="M7 24V8l4.5 3.5L16 6l4.5 5.5L25 8v16" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="7" y1="20" x2="25" y2="20" stroke="#fff" strokeWidth="1.5" opacity="0.3"/>
        <line x1="7" y1="16" x2="25" y2="16" stroke="#fff" strokeWidth="1.5" opacity="0.15"/>
      </svg>
      Stakebook
    </div>
  );

  return (
    <div style={S.app}>
      <Fonts/>
      <header style={S.header}>
        <div style={S.hInner}>
          <Logo/>
          <div style={{display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
            <nav style={S.nav}>
              {[{id:"dashboard",l:"Dashboard",i:"chart"},{id:"bets",l:"My Bets",i:"book"},{id:"analytics",l:"Analytics",i:"trend"},{id:"health",l:"Health",i:"shield"}].map(t=>(
                <button key={t.id} style={S.navBtn(tab===t.id)} onClick={()=>setTab(t.id)}>
                  <span style={{display:"flex",alignItems:"center",gap:6}}><I n={t.i} s={14}/>{t.l}</span>
                </button>
              ))}
            </nav>
            <button style={{...S.btn("primary"),display:"flex",alignItems:"center",gap:6,padding:"8px 16px"}} onClick={()=>{setEditing(null);setShowAdd(true);}}>
              <I n="plus" s={16} c="#fff"/> Log Bet
            </button>
          </div>
        </div>
      </header>

      {alerts.length>0&&<div style={{...S.maxW,paddingTop:16}}>{alerts.map((a,i)=>(
        <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"11px 16px",borderRadius:T.rs,marginBottom:8,background:a.t==="d"?T.redBg:T.orangeBg,color:a.t==="d"?T.red:T.orange,border:`1px solid ${a.t==="d"?T.red+"18":T.orange+"18"}`,fontSize:13,fontWeight:500}}>
          <I n="alert" s={15} c={a.t==="d"?T.red:T.orange}/>{a.m}
        </div>
      ))}</div>}

      <main style={S.maxW}>
        {/* ═══ DASHBOARD ═══ */}
        {tab==="dashboard"&&(
          <div style={S.sec}>
            <div style={{...S.fb,marginBottom:16,flexWrap:"wrap",gap:12}}>
              <h2 style={{fontFamily:T.display,fontSize:24,fontWeight:400,margin:0,fontStyle:"italic"}}>Dashboard</h2>
              <TPBar/>
            </div>
            <div style={S.g4}>
              <div style={S.stat()}><span style={S.sLabel}>Net Profit</span><span style={S.sVal(A.net>=0?T.brand:T.red)}>{fmt(A.net)}</span><div style={{display:"flex",alignItems:"center",gap:6}}><span style={S.sSub}>{fmtPct(A.roi)} ROI</span><Delta cur={A.net} prev={A.pNet}/></div></div>
              <div style={S.stat()}><span style={S.sLabel}>Win Rate</span><span style={S.sVal(T.brand)}>{fmtPct(A.wr)}</span><div style={{display:"flex",alignItems:"center",gap:6}}><span style={S.sSub}>{A.w}W – {A.l}L – {A.push}P</span><Delta cur={A.wr} prev={A.pWr} f="%"/></div></div>
              <div style={S.stat()}><span style={S.sLabel}>Total Wagered</span><span style={S.sVal()}>{fmt(A.stk)}</span><div style={{display:"flex",alignItems:"center",gap:6}}><span style={S.sSub}>{A.setN} settled bets</span><Delta cur={A.stk} prev={A.pStk}/></div></div>
              <div style={S.stat()}><span style={S.sLabel}>Health Score</span><span style={S.sVal(A.hp>=75?T.brand:A.hp>=50?T.orange:T.red)}>{A.hp}/100</span><span style={S.sSub}>{A.hp>=75?"Looking sharp":A.hp>=50?"Watch your limits":"Take a break"}</span></div>
            </div>

            <div style={{...S.g2,marginTop:16}}>
              <div style={S.card}>
                <div style={S.cTitle}>Profit Over Time</div>
                {A.timeline.length>0?(<ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={A.timeline}><defs><linearGradient id="pg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={T.brand} stopOpacity={0.12}/><stop offset="95%" stopColor={T.brand} stopOpacity={0}/></linearGradient></defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={T.border} vertical={false}/><XAxis dataKey="date" tick={{fontSize:11,fill:T.sub}} tickFormatter={v=>v.slice(5)} axisLine={false} tickLine={false}/><YAxis tick={{fontSize:11,fill:T.sub}} tickFormatter={v=>`$${v}`} axisLine={false} tickLine={false} width={50}/>
                  <Tooltip formatter={v=>[fmt(v),"Profit"]} contentStyle={{borderRadius:10,border:`1px solid ${T.border}`,fontSize:13,fontFamily:T.body}}/><Area type="monotone" dataKey="profit" stroke={T.brand} fill="url(#pg)" strokeWidth={2.5} dot={false}/></AreaChart>
                </ResponsiveContainer>):<div style={{height:220,display:"flex",alignItems:"center",justifyContent:"center",color:T.light}}>No settled bets in this period</div>}
              </div>
              <div style={S.card}>
                <div style={S.cTitle}>Profit by Sport</div>
                {Object.keys(A.bySport).length>0?(<div style={{display:"flex",alignItems:"center",gap:16}}>
                  <ResponsiveContainer width="50%" height={220}><PieChart><Pie data={Object.entries(A.bySport).map(([k,v])=>({name:k,value:Math.abs(v.pnl)||0.01,actual:v.pnl}))} cx="50%" cy="50%" outerRadius={80} innerRadius={40} dataKey="value" paddingAngle={2}>
                    {Object.keys(A.bySport).map((_,i)=><Cell key={i} fill={T.chart[i%T.chart.length]}/>)}</Pie>
                    <Tooltip formatter={(_,__,p)=>[fmt(p.payload.actual),p.payload.name]} contentStyle={{borderRadius:10,border:`1px solid ${T.border}`,fontSize:13}}/></PieChart></ResponsiveContainer>
                  <div style={{display:"flex",flexDirection:"column",gap:5}}>
                    {Object.entries(A.bySport).sort((a,b)=>b[1].pnl-a[1].pnl).map(([sp,d])=>(
                      <div key={sp} style={{display:"flex",alignItems:"center",gap:8,fontSize:12}}>
                        <div style={{width:10,height:10,borderRadius:3,background:T.chart[Object.keys(A.bySport).indexOf(sp)%T.chart.length]}}/>
                        <span style={{color:T.sub,minWidth:55}}>{sp}</span>
                        <span style={{fontWeight:600,color:d.pnl>=0?T.brand:T.red}}>{fmt(d.pnl)}</span>
                      </div>))}
                  </div>
                </div>):<div style={{height:220,display:"flex",alignItems:"center",justifyContent:"center",color:T.light}}>No data</div>}
              </div>
            </div>

            <div style={{...S.card,marginTop:16}}>
              <div style={S.fb}><div style={S.cTitle}>Recent Bets <span style={{fontFamily:T.body,fontSize:12,fontWeight:400,color:T.light,fontStyle:"normal"}}>({filtered.length})</span></div><button style={{...S.btn("ghost"),fontSize:12,padding:"6px 12px"}} onClick={()=>setTab("bets")}>View All →</button></div>
              <div style={{overflowX:"auto"}}><table style={S.table}><thead><tr>{["Date","Bet","Sport","Type","Odds","Stake","Result","P/L",""].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead><tbody>
                {filtered.slice(0,7).map(b=>{const pl=b.outcome==="Pending"?null:(b.payout||0)-b.stake;return(
                  <tr key={b.id} style={{cursor:"pointer"}} onClick={()=>setViewing(b)}>
                    <td style={S.td}>{b.date.slice(5)}</td><td style={{...S.td,fontWeight:500,maxWidth:180,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{b.team}</td>
                    <td style={S.td}><span style={S.tag(T.blue,T.blueBg)}>{b.sport}</span></td><td style={{...S.td,color:T.sub}}>{b.betType}</td>
                    <td style={S.td}>{b.odds>0?`+${b.odds}`:b.odds}</td><td style={S.td}>{fmt(b.stake)}</td><td style={S.td}><OTag o={b.outcome}/></td>
                    <td style={{...S.td,fontWeight:600,color:pl===null?T.light:pl>=0?T.brand:T.red}}>{pl===null?"—":fmt(pl)}</td><td style={S.td}><Stars v={b.confidence} sz={11}/></td>
                  </tr>);})}
              </tbody></table></div>
            </div>
          </div>
        )}

        {/* ═══ MY BETS ═══ */}
        {tab==="bets"&&(
          <div style={S.sec}>
            <div style={{...S.fb,marginBottom:16,flexWrap:"wrap",gap:12}}>
              <h2 style={{fontFamily:T.display,fontSize:24,fontWeight:400,margin:0,fontStyle:"italic"}}>My Bets</h2>
              <TPBar/>
            </div>
            <div style={{marginBottom:12,display:"flex",gap:16,fontSize:13,color:T.sub}}>
              <span><strong style={{color:T.text}}>{filtered.length}</strong> bets</span>
              <span><strong style={{color:T.brand}}>{filtered.filter(b=>b.outcome==="Win").length}</strong> wins</span>
              <span><strong style={{color:T.red}}>{filtered.filter(b=>b.outcome==="Loss").length}</strong> losses</span>
              <span><strong style={{color:T.gold}}>{filtered.filter(b=>b.outcome==="Pending").length}</strong> pending</span>
            </div>
            <div style={S.card}><div style={{overflowX:"auto"}}><table style={S.table}><thead><tr>{["Date","Bet","Sport","Type","Book","Odds","Stake","Result","P/L","Conf.",""].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead><tbody>
              {filtered.map(b=>{const pl=b.outcome==="Pending"?null:(b.payout||0)-b.stake;return(
                <tr key={b.id}>
                  <td style={S.td}>{b.date}</td><td style={{...S.td,fontWeight:500,maxWidth:200,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{b.team}</td>
                  <td style={S.td}><span style={S.tag(T.blue,T.blueBg)}>{b.sport}</span></td><td style={{...S.td,color:T.sub}}>{b.betType}</td><td style={{...S.td,fontSize:12}}>{b.sportsbook}</td>
                  <td style={S.td}>{b.odds>0?`+${b.odds}`:b.odds}</td><td style={S.td}>{fmt(b.stake)}</td><td style={S.td}><OTag o={b.outcome}/></td>
                  <td style={{...S.td,fontWeight:600,color:pl===null?T.light:pl>=0?T.brand:T.red}}>{pl===null?"—":fmt(pl)}</td><td style={S.td}><Stars v={b.confidence} sz={11}/></td>
                  <td style={{...S.td,whiteSpace:"nowrap"}}>
                    <button style={{background:"none",border:"none",cursor:"pointer",padding:4}} onClick={()=>setViewing(b)}><I n="eye" s={14} c={T.sub}/></button>
                    <button style={{background:"none",border:"none",cursor:"pointer",padding:4}} onClick={()=>{setEditing(b);setShowAdd(true);}}><I n="edit" s={14} c={T.sub}/></button>
                    <button style={{background:"none",border:"none",cursor:"pointer",padding:4}} onClick={()=>delBet(b.id)}><I n="trash" s={14} c={T.red}/></button>
                  </td>
                </tr>);})}
              {filtered.length===0&&<tr><td colSpan={11} style={{...S.td,textAlign:"center",padding:40,color:T.light}}>No bets in this period</td></tr>}
            </tbody></table></div></div>
          </div>
        )}

        {/* ═══ ANALYTICS ═══ */}
        {tab==="analytics"&&(
          <div style={S.sec}>
            <div style={{...S.fb,marginBottom:16,flexWrap:"wrap",gap:12}}>
              <h2 style={{fontFamily:T.display,fontSize:24,fontWeight:400,margin:0,fontStyle:"italic"}}>Analytics</h2>
              <TPBar/>
            </div>
            <div style={S.g4}>
              <div style={S.stat()}><span style={S.sLabel}>Avg. Stake</span><span style={{...S.sVal(),fontSize:24}}>{fmt(A.avg)}</span></div>
              <div style={S.stat()}><span style={S.sLabel}>Current Streak</span><span style={{...S.sVal(A.cs>=0?T.brand:T.red),fontSize:24}}>{A.cs>0?`${A.cs}W 🔥`:A.cs<0?`${Math.abs(A.cs)}L`:"—"}</span></div>
              <div style={S.stat()}><span style={S.sLabel}>Best Win Streak</span><span style={{...S.sVal(T.brand),fontSize:24}}>{A.mw}</span></div>
              <div style={S.stat()}><span style={S.sLabel}>Worst Loss Streak</span><span style={{...S.sVal(T.red),fontSize:24}}>{A.ml}</span></div>
            </div>
            <div style={{...S.g2,marginTop:16}}>
              <div style={S.card}>
                <div style={S.cTitle}>Confidence vs. Results</div>
                <div style={{display:"flex",gap:24,padding:"12px 0"}}>
                  <div style={{textAlign:"center",flex:1}}><div style={{fontSize:11,color:T.sub,marginBottom:8,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.06em"}}>Wins</div><Stars v={Math.round(A.acw)} sz={20}/><div style={{fontFamily:T.display,fontSize:22,fontWeight:400,color:T.brand,marginTop:4,fontStyle:"italic"}}>{A.acw.toFixed(1)}</div></div>
                  <div style={{width:1,background:T.border}}/>
                  <div style={{textAlign:"center",flex:1}}><div style={{fontSize:11,color:T.sub,marginBottom:8,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.06em"}}>Losses</div><Stars v={Math.round(A.acl)} sz={20}/><div style={{fontFamily:T.display,fontSize:22,fontWeight:400,color:T.red,marginTop:4,fontStyle:"italic"}}>{A.acl.toFixed(1)}</div></div>
                </div>
                <div style={{fontSize:12,color:T.sub,marginTop:8,padding:"10px 12px",background:T.bg,borderRadius:T.rs}}>
                  {A.acw>A.acl+0.5?"✦ Your confidence calibration is solid — high confidence bets win more often.":"🔍 Confidence doesn't strongly predict outcomes yet. Keep journaling your reasoning."}
                </div>
              </div>
              <div style={S.card}>
                <div style={S.cTitle}>ROI by Bet Type</div>
                {Object.keys(A.byType).length>0?(<ResponsiveContainer width="100%" height={220}>
                  <BarChart data={Object.entries(A.byType).map(([k,v])=>({name:k,roi:v.stk>0?((v.pnl/v.stk)*100):0,pnl:v.pnl}))}>
                  <CartesianGrid strokeDasharray="3 3" stroke={T.border} vertical={false}/><XAxis dataKey="name" tick={{fontSize:10,fill:T.sub}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fontSize:11,fill:T.sub}} tickFormatter={v=>`${v}%`} axisLine={false} tickLine={false} width={45}/>
                  <Tooltip formatter={v=>[`${v.toFixed(1)}%`,"ROI"]} contentStyle={{borderRadius:10,border:`1px solid ${T.border}`,fontSize:13}}/>
                  <Bar dataKey="roi" radius={[4,4,0,0]}>{Object.entries(A.byType).map(([_,v],i)=><Cell key={i} fill={v.pnl>=0?T.brand:T.red} opacity={0.85}/>)}</Bar>
                  </BarChart></ResponsiveContainer>):<div style={{height:220,display:"flex",alignItems:"center",justifyContent:"center",color:T.light}}>No data</div>}
              </div>
            </div>
            <div style={{...S.card,marginTop:16}}>
              <div style={S.cTitle}>Performance by Sport</div>
              <table style={S.table}><thead><tr>{["Sport","Bets","W/L","Win%","Staked","P/L","ROI"].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead><tbody>
                {Object.entries(A.bySport).sort((a,b)=>b[1].pnl-a[1].pnl).map(([sp,d])=>(
                  <tr key={sp}><td style={{...S.td,fontWeight:600}}>{sp}</td><td style={S.td}>{d.n}</td><td style={S.td}>{d.w}–{d.l}</td>
                  <td style={S.td}>{d.n>0?fmtPct(d.w/d.n):"—"}</td><td style={S.td}>{fmt(d.stk)}</td>
                  <td style={{...S.td,fontWeight:600,color:d.pnl>=0?T.brand:T.red}}>{fmt(d.pnl)}</td>
                  <td style={{...S.td,color:d.pnl/d.stk>=0?T.brand:T.red}}>{d.stk>0?fmtPct(d.pnl/d.stk):"—"}</td></tr>
                ))}
                {Object.keys(A.bySport).length===0&&<tr><td colSpan={7} style={{...S.td,textAlign:"center",padding:32,color:T.light}}>No data</td></tr>}
              </tbody></table>
            </div>
            <div style={{...S.card,marginTop:16}}>
              <div style={S.cTitle}>Performance by Sportsbook</div>
              <table style={S.table}><thead><tr>{["Book","Bets","Win%","Staked","P/L","ROI"].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead><tbody>
                {Object.entries(A.byBook).sort((a,b)=>b[1].pnl-a[1].pnl).map(([bk,d])=>(
                  <tr key={bk}><td style={{...S.td,fontWeight:600}}>{bk}</td><td style={S.td}>{d.n}</td>
                  <td style={S.td}>{d.n>0?fmtPct(d.w/d.n):"—"}</td><td style={S.td}>{fmt(d.stk)}</td>
                  <td style={{...S.td,fontWeight:600,color:d.pnl>=0?T.brand:T.red}}>{fmt(d.pnl)}</td>
                  <td style={{...S.td,color:d.pnl/d.stk>=0?T.brand:T.red}}>{d.stk>0?fmtPct(d.pnl/d.stk):"—"}</td></tr>
                ))}
              </tbody></table>
            </div>
          </div>
        )}

        {/* ═══ HEALTH ═══ */}
        {tab==="health"&&(
          <div style={S.sec}>
            <h2 style={{fontFamily:T.display,fontSize:24,fontWeight:400,marginBottom:16,fontStyle:"italic"}}>Betting Health</h2>
            <div style={S.g2}>
              <div style={{...S.card,display:"flex",flexDirection:"column",alignItems:"center",padding:32}}>
                <div style={S.cTitle}>Your Health Score</div>
                <Ring score={A.hp} size={160}/>
                <p style={{fontSize:14,color:T.sub,textAlign:"center",marginTop:16,maxWidth:300,lineHeight:1.6}}>
                  {A.hp>=80?"You're betting responsibly. Keep it up!":A.hp>=60?"Mostly good, but watch a few areas.":A.hp>=40?"Some warning signs. Consider reducing stakes.":"Your patterns are concerning. Step back and reassess."}
                </p>
              </div>
              <div style={S.card}>
                <div style={S.cTitle}>Spending Limits</div>
                {[{l:"Today",sp:A.tStk,lm:settings.dailyLimit,k:"dailyLimit"},{l:"This Week",sp:A.wStk,lm:settings.weeklyLimit,k:"weeklyLimit"},{l:"This Month",sp:A.mStk,lm:settings.monthlyLimit,k:"monthlyLimit"}].map(it=>{
                  const pct=Math.min(1,it.sp/it.lm),c=pct>=1?T.red:pct>=0.8?T.orange:T.brand;
                  return(<div key={it.k} style={{marginBottom:20}}>
                    <div style={{...S.fb,marginBottom:6}}><span style={{fontSize:13,fontWeight:500}}>{it.l}</span><span style={{fontSize:13,color:c}}>{fmt(it.sp)} / {fmt(it.lm)}</span></div>
                    <div style={{height:6,background:T.bg,borderRadius:4,overflow:"hidden"}}><div style={{height:"100%",width:`${pct*100}%`,background:c,borderRadius:4,transition:"width 0.5s"}}/></div>
                  </div>);
                })}
                <div style={{borderTop:`1px solid ${T.border}`,paddingTop:16,marginTop:8}}>
                  <div style={S.cTitle}>Adjust Limits</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                    {[{l:"Daily Limit",k:"dailyLimit"},{l:"Weekly Limit",k:"weeklyLimit"},{l:"Monthly Limit",k:"monthlyLimit"},{l:"Max Stake",k:"maxStake"},{l:"Bankroll",k:"bankroll"},{l:"Loss Streak Alert",k:"lossStreakAlert"}].map(f=>(
                      <div key={f.k}><label style={S.label}>{f.l}</label><input type="number" style={S.input} value={settings[f.k]} onChange={e=>setSettings(p=>({...p,[f.k]:parseFloat(e.target.value)||0}))}/></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div style={{...S.card,marginTop:16}}>
              <div style={S.cTitle}>Behavioral Insights</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:16}}>
                {[
                  {i:"trend",t:"Bankroll Usage",m:A.avg>settings.bankroll*0.05?`Avg. stake: ${fmt(A.avg)} (${fmtPct(A.avg/settings.bankroll)} of bankroll). Pros recommend 1–5%.`:`Avg. stake: ${fmt(A.avg)} (${fmtPct(A.avg/settings.bankroll)} of bankroll). Within range.`,c:A.avg>settings.bankroll*0.05?T.orange:T.brand},
                  {i:"chart",t:"Streak Awareness",m:A.cs<-2?`${Math.abs(A.cs)}-bet losing streak. Take a break.`:A.cs>3?`${A.cs}-bet win streak! Don't increase stakes.`:"No significant streaks. Stay disciplined.",c:A.cs<-2?T.red:A.cs>3?T.brand:T.blue},
                  {i:"star",t:"Confidence Calibration",m:A.acw>A.acl+0.5?"Your gut is well-calibrated. Trust your research.":"Confidence doesn't predict outcomes yet. Keep journaling.",c:A.acw>A.acl+0.5?T.brand:T.orange},
                ].map((ins,i)=>(
                  <div key={i} style={{padding:16,background:T.bg,borderRadius:T.rs,borderLeft:`3px solid ${ins.c}`}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}><I n={ins.i} s={15} c={ins.c}/><span style={{fontWeight:600,fontSize:14}}>{ins.t}</span></div>
                    <p style={{fontSize:13,color:T.sub,lineHeight:1.6,margin:0}}>{ins.m}</p>
                  </div>
                ))}
              </div>
            </div>
            <div style={{...S.card,marginTop:16,background:T.brandLight,border:`1px solid ${T.brand}18`}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}><I n="heart" s={18} c={T.brand}/><span style={{fontFamily:T.display,fontSize:17,fontWeight:400,color:T.brand,fontStyle:"italic"}}>Responsible Gambling Resources</span></div>
              <p style={{fontSize:13,color:T.sub,lineHeight:1.7,margin:0}}>If you or someone you know is struggling with gambling, help is available. National Council on Problem Gambling: <strong>1-800-522-4700</strong> (24/7). Gamblers Anonymous: <strong>gamblersanonymous.org</strong>. If betting stops being fun, take a step back.</p>
            </div>
          </div>
        )}
      </main>

      {/* ═══ ADD/EDIT MODAL ═══ */}
      {showAdd&&<BetModal bet={editing||emptyBet} isEdit={!!editing} settings={settings} onSave={saveBet} onClose={()=>{setShowAdd(false);setEditing(null);}}/>}

      {/* ═══ VIEW MODAL ═══ */}
      {viewing&&(
        <div style={S.overlay} onClick={()=>setViewing(null)}><div style={S.modal} onClick={e=>e.stopPropagation()}>
          <div style={S.fb}><h3 style={{fontFamily:T.display,fontSize:20,fontWeight:400,margin:0,fontStyle:"italic"}}>Bet Details</h3><button onClick={()=>setViewing(null)} style={{background:"none",border:"none",cursor:"pointer"}}><I n="x" s={20}/></button></div>
          <div style={{marginTop:20,display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            {[{l:"Date",v:viewing.date},{l:"Sport",v:viewing.sport},{l:"Bet Type",v:viewing.betType},{l:"Sportsbook",v:viewing.sportsbook},{l:"Odds",v:viewing.odds>0?`+${viewing.odds}`:viewing.odds},{l:"Stake",v:fmt(viewing.stake)}].map(x=>(
              <div key={x.l}><div style={S.label}>{x.l}</div><div style={{fontSize:15,fontWeight:500}}>{x.v}</div></div>
            ))}
          </div>
          <div style={{marginTop:16}}><div style={S.label}>Selection</div><div style={{fontSize:16,fontWeight:600}}>{viewing.team}</div></div>
          <div style={{marginTop:16,display:"flex",gap:24}}>
            <div><div style={S.label}>Result</div><OTag o={viewing.outcome}/></div>
            <div><div style={S.label}>P/L</div>{viewing.outcome!=="Pending"?<span style={{fontSize:18,fontWeight:700,fontFamily:T.display,fontStyle:"italic",color:(viewing.payout-viewing.stake)>=0?T.brand:T.red}}>{fmt((viewing.payout||0)-viewing.stake)}</span>:<span style={{color:T.light}}>Pending</span>}</div>
            <div><div style={S.label}>Confidence</div><Stars v={viewing.confidence} sz={16}/></div>
          </div>
          {viewing.notes&&<div style={{marginTop:16}}><div style={S.label}>Journal Notes</div><div style={{padding:14,background:T.bg,borderRadius:T.rs,fontSize:14,color:T.sub,lineHeight:1.6,fontStyle:"italic",borderLeft:`3px solid ${T.brand}`}}>"{viewing.notes}"</div></div>}
          <div style={{display:"flex",gap:8,marginTop:20}}>
            <button style={S.btn("ghost")} onClick={()=>{setEditing(viewing);setShowAdd(true);setViewing(null);}}><span style={{display:"flex",alignItems:"center",gap:6}}><I n="edit" s={14}/> Edit</span></button>
            <button style={S.btn("danger")} onClick={()=>delBet(viewing.id)}><span style={{display:"flex",alignItems:"center",gap:6}}><I n="trash" s={14}/> Delete</span></button>
          </div>
        </div></div>
      )}
    </div>
  );
}

function BetModal({bet,isEdit,settings,onSave,onClose}){
  const [f,setF]=useState({...bet,odds:String(bet.odds||""),stake:String(bet.stake||"")});
  const [sw,setSw]=useState("");
  const up=(k,v)=>{setF(p=>({...p,[k]:v}));if(k==="stake"){const s=parseFloat(v);setSw(s>settings.maxStake?`Exceeds max stake of ${fmt(settings.maxStake)}`:"");}};
  const pp=calcPayout(f.stake,f.odds);
  return(
    <div style={S.overlay} onClick={onClose}><div style={S.modal} onClick={e=>e.stopPropagation()}>
      <div style={S.fb}><h3 style={{fontFamily:T.display,fontSize:20,fontWeight:400,margin:0,fontStyle:"italic"}}>{isEdit?"Edit Bet":"Log New Bet"}</h3><button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer"}}><I n="x" s={20}/></button></div>
      <div style={{marginTop:20,display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        <div><label style={S.label}>Date</label><input type="date" style={S.input} value={f.date} onChange={e=>up("date",e.target.value)}/></div>
        <div><label style={S.label}>Sport</label><select style={S.select} value={f.sport} onChange={e=>up("sport",e.target.value)}>{SPORTS.map(s=><option key={s}>{s}</option>)}</select></div>
        <div><label style={S.label}>Bet Type</label><select style={S.select} value={f.betType} onChange={e=>up("betType",e.target.value)}>{BET_TYPES.map(t=><option key={t}>{t}</option>)}</select></div>
        <div><label style={S.label}>Sportsbook</label><select style={S.select} value={f.sportsbook} onChange={e=>up("sportsbook",e.target.value)}>{SPORTSBOOKS.map(b=><option key={b}>{b}</option>)}</select></div>
        <div style={{gridColumn:"1/-1"}}><label style={S.label}>Selection / Team(s)</label><input type="text" style={S.input} placeholder="e.g. Celtics -4.5" value={f.team} onChange={e=>up("team",e.target.value)}/></div>
        <div><label style={S.label}>Odds (American)</label><input type="text" style={S.input} placeholder="-110 or +150" value={f.odds} onChange={e=>up("odds",e.target.value)}/></div>
        <div><label style={S.label}>Stake ($)</label><input type="number" style={{...S.input,borderColor:sw?T.orange:T.border}} placeholder="0.00" value={f.stake} onChange={e=>up("stake",e.target.value)}/>{sw&&<div style={{fontSize:11,color:T.orange,marginTop:4}}>⚠️ {sw}</div>}</div>
        <div><label style={S.label}>Outcome</label><select style={S.select} value={f.outcome} onChange={e=>up("outcome",e.target.value)}>{OUTCOMES.map(o=><option key={o}>{o}</option>)}</select></div>
        <div><label style={S.label}>Potential Payout</label><div style={{padding:"10px 12px",background:T.bg,borderRadius:T.rs,fontSize:16,fontWeight:600,fontFamily:T.display,color:T.brand,fontStyle:"italic"}}>{f.stake&&f.odds?fmt(pp):"—"}</div></div>
        <div style={{gridColumn:"1/-1"}}><label style={S.label}>Confidence</label>
          <div style={{display:"flex",alignItems:"center",gap:12}}><Stars v={f.confidence} onChange={v=>up("confidence",v)} sz={24}/>
          <span style={{fontSize:12,color:T.sub}}>{f.confidence<=1?"Flyer":f.confidence<=2?"Gut feel":f.confidence<=3?"Decent edge":f.confidence<=4?"Strong conviction":"Lock"}</span></div>
        </div>
        <div style={{gridColumn:"1/-1"}}><label style={S.label}>Journal Notes</label><textarea style={{...S.input,minHeight:80,resize:"vertical"}} placeholder="Why are you making this bet? What's your reasoning?" value={f.notes} onChange={e=>up("notes",e.target.value)}/></div>
      </div>
      <div style={{display:"flex",gap:10,marginTop:20,justifyContent:"flex-end"}}>
        <button style={S.btn("ghost")} onClick={onClose}>Cancel</button>
        <button style={{...S.btn("primary"),opacity:!f.team||!f.stake?0.5:1}} disabled={!f.team||!f.stake} onClick={()=>onSave(f)}>{isEdit?"Save Changes":"Log Bet"}</button>
      </div>
    </div></div>
  );
}
