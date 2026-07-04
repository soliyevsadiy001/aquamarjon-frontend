import React from "react";
import { COLORS } from "../../theme";
import { Pd } from "../../lib/doctor-styles";

/* ---- hoisted static styles (perf: avoid re-allocating on every render) ---- */
const __style1 = {position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none"} as const;


export function BubblesDoc() {
  return (
    <div style={__style1}>
      {[...Array(8)].map((_,i)=>(
        <span key={i} style={{
          position:"absolute",left:`${10+i*12}%`,bottom:-10,
          width:4+(i%3)*4,height:4+(i%3)*4,borderRadius:"50%",
          background:"rgba(0,201,177,0.12)",border:"1px solid rgba(0,201,177,0.25)",
          animation:`bubbleUpDoc ${10+i*2}s linear ${i*1.5}s infinite`,
        }}/>
      ))}
      <style>{`
        @keyframes bubbleUpDoc{0%{transform:translateY(0);opacity:0}10%{opacity:1}100%{transform:translateY(-100vh);opacity:0}}
        @keyframes pulseDoc{0%,100%{opacity:1}50%{opacity:0.5}}
        @keyframes slideUpDoc{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}
      `}</style>
    </div>
  );
}


export interface DBtnProps {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  variant?: "primary" | "ghost" | "danger";
  style?: React.CSSProperties;
}

export function DBtn({ children, onClick, disabled, variant = "primary", style: s }: DBtnProps) {
  const base={width:"100%",border:"none",borderRadius:12,padding:"13px",fontSize:15,fontWeight:700,cursor:disabled?"default":"pointer",transition:"opacity 0.15s"};
  const styles={
    primary:{background:disabled?Pd.border:Pd.teal,color:disabled?Pd.muted:COLORS.bg},
    ghost:{background:"none",border:`1px solid ${Pd.border}`,color:Pd.soft,fontSize:14,padding:"11px"},
    danger:{background:Pd.dangerBg,border:`1px solid ${Pd.red}66`,color:Pd.red},
  };
  return <button onClick={disabled?null:onClick} style={{...base,...styles[variant],...s}}>{children}</button>;
}

