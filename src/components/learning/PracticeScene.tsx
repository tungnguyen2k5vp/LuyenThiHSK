export function PracticeScene({ kind }: { kind: string }) {
  return <svg className={'practice-scene scene-' + kind} viewBox="0 0 320 120" aria-hidden="true">
    <rect className="scene-backdrop" x="2" y="3" width="316" height="114" rx="18"/>
    {kind === 'headphones' ? <>
      <path className="scene-outline" d="M40 77V58a27 27 0 0 1 54 0v19M40 61h9v24h-9zM85 61h9v24h-9z"/>
      {[32, 49, 65, 38, 76, 54, 30, 57, 40].map((height, i) => <rect key={i} className={'scene-wave wave-' + i % 3} x={129 + i * 16} y={60 - height / 2} width="6" height={height} rx="3"/>)}
    </> : kind === 'path' ? <>
      <path className="scene-outline scene-connector" d="M59 83h197m-7-5 7 5-7 5"/>
      {['我', '学', '中文'].map((word, i) => <g className={'scene-token token-' + i} key={word}><rect x={43 + i * 81} y={25 + (i % 2) * 8} width="66" height="45" rx="9"/><text x={76 + i * 81} y={55 + (i % 2) * 8} textAnchor="middle" lang="zh">{word}</text></g>)}
    </> : kind === 'pen' ? <>
      <path className="scene-outline" d="M39 69h8l12 13V39L47 52h-8zM69 47q18 13 0 27M77 36q32 24 0 49"/>
      <rect className="scene-paper" x="114" y="23" width="168" height="75" rx="9"/>
      <text x="133" y="56" lang="zh" className="scene-dictation">你好</text><path className="scene-line" d="M132 76h127"/><path className="scene-cursor" d="M187 39v24"/>
    </> : <>
      <rect className="scene-paper scene-page-back" x="91" y="17" width="137" height="86" rx="8"/>
      <rect className="scene-paper" x="78" y="24" width="137" height="79" rx="8"/>
      <text x="94" y="51" lang="zh">{kind === 'passage' ? '今天的故事' : '学中文'}</text>
      <path className="scene-line" d="M95 65h102M95 78h83M95 91h66"/>
      <path className="scene-read-highlight" pathLength="1" d="M94 56h90"/><circle className="scene-read-dot" cx="241" cy="62" r="16"/><path className="scene-outline" d="m234 62 5 5 9-11"/>
    </>}
  </svg>;
}
