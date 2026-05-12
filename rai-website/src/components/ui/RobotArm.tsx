'use client';
export function RobotArmLeft() {
  return (
    <div className="absolute left-0 bottom-0 w-64 h-96 pointer-events-none select-none" style={{zIndex:2}}>
      <svg viewBox="0 0 200 380" className="w-full h-full" style={{filter:'drop-shadow(0 0 18px #00E5FF55)'}}>
        {/* Base */}
        <rect x="60" y="340" width="80" height="30" rx="6" fill="#111827" stroke="#00E5FF" strokeWidth="1.5"/>
        <rect x="75" y="325" width="50" height="20" rx="4" fill="#0d1520" stroke="#00E5FF" strokeWidth="1"/>
        {/* LED */}
        <circle cx="95" cy="335" r="4" fill="#00E5FF" style={{animation:'joint-pulse 2s ease-in-out infinite'}}/>
        {/* Arm lower */}
        <g style={{transformOrigin:'100px 320px', animation:'arm-segment-pick 6s ease-in-out infinite'}}>
          <rect x="88" y="220" width="24" height="105" rx="8" fill="#0d1520" stroke="#00E5FF" strokeWidth="1.2"/>
          <circle cx="100" cy="222" r="10" fill="#111827" stroke="#00E5FF" strokeWidth="1.5"/>
          {/* Arm upper */}
          <g style={{transformOrigin:'100px 222px', animation:'arm-segment-place 6s ease-in-out infinite'}}>
            <rect x="88" y="110" width="24" height="118" rx="8" fill="#0d1520" stroke="#00E5FF" strokeWidth="1.2"/>
            <circle cx="100" cy="112" r="10" fill="#111827" stroke="#00E5FF" strokeWidth="1.5"/>
            {/* Forearm */}
            <g style={{transformOrigin:'100px 112px', animation:'robot-idle 5s ease-in-out infinite'}}>
              <rect x="91" y="50" width="18" height="68" rx="6" fill="#0d1520" stroke="#00E5FF" strokeWidth="1"/>
              <circle cx="100" cy="52" r="8" fill="#111827" stroke="#00E5FF" strokeWidth="1.5"/>
              {/* Gripper */}
              <rect x="85" y="20" width="10" height="34" rx="3" fill="#00E5FF" opacity="0.7"/>
              <rect x="105" y="20" width="10" height="34" rx="3" fill="#00E5FF" opacity="0.7"/>
              <rect x="92" y="10" width="16" height="14" rx="4" fill="#111827" stroke="#00E5FF" strokeWidth="1"/>
              {/* Cube being picked */}
              <rect x="90" y="0" width="20" height="20" rx="3" fill="#00E5FF" opacity="0.85" style={{filter:'drop-shadow(0 0 8px #00E5FF)'}}/>
            </g>
          </g>
        </g>
        {/* Glow lines on base */}
        <line x1="60" y1="355" x2="140" y2="355" stroke="#00E5FF" strokeWidth="0.5" opacity="0.4"/>
      </svg>
    </div>
  );
}

export function RobotArmRight() {
  return (
    <div className="absolute right-0 bottom-0 w-64 h-96 pointer-events-none select-none" style={{zIndex:2}}>
      <svg viewBox="0 0 200 380" className="w-full h-full" style={{filter:'drop-shadow(0 0 18px #00E5FF55)', transform:'scaleX(-1)'}}>
        <rect x="60" y="340" width="80" height="30" rx="6" fill="#111827" stroke="#00E5FF" strokeWidth="1.5"/>
        <rect x="75" y="325" width="50" height="20" rx="4" fill="#0d1520" stroke="#00E5FF" strokeWidth="1"/>
        <circle cx="105" cy="335" r="4" fill="#00E5FF" style={{animation:'joint-pulse 2s ease-in-out infinite 1s'}}/>
        <g style={{transformOrigin:'100px 320px', animation:'arm-segment-place 6s ease-in-out infinite 3s'}}>
          <rect x="88" y="220" width="24" height="105" rx="8" fill="#0d1520" stroke="#00E5FF" strokeWidth="1.2"/>
          <circle cx="100" cy="222" r="10" fill="#111827" stroke="#00E5FF" strokeWidth="1.5"/>
          <g style={{transformOrigin:'100px 222px', animation:'arm-segment-pick 6s ease-in-out infinite 3s'}}>
            <rect x="88" y="110" width="24" height="118" rx="8" fill="#0d1520" stroke="#00E5FF" strokeWidth="1.2"/>
            <circle cx="100" cy="112" r="10" fill="#111827" stroke="#00E5FF" strokeWidth="1.5"/>
            <g style={{transformOrigin:'100px 112px', animation:'robot-idle 5s ease-in-out infinite 2s'}}>
              <rect x="91" y="50" width="18" height="68" rx="6" fill="#0d1520" stroke="#00E5FF" strokeWidth="1"/>
              <circle cx="100" cy="52" r="8" fill="#111827" stroke="#00E5FF" strokeWidth="1.5"/>
              <rect x="85" y="20" width="10" height="34" rx="3" fill="#00E5FF" opacity="0.7"/>
              <rect x="105" y="20" width="10" height="34" rx="3" fill="#00E5FF" opacity="0.7"/>
              <rect x="92" y="10" width="16" height="14" rx="4" fill="#111827" stroke="#00E5FF" strokeWidth="1"/>
            </g>
          </g>
        </g>
        <line x1="60" y1="355" x2="140" y2="355" stroke="#00E5FF" strokeWidth="0.5" opacity="0.4"/>
      </svg>
    </div>
  );
}
