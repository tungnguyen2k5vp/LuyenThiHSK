export function CompletionMark() {
  return <svg className="completion-mark" viewBox="0 0 100 100" aria-hidden="true">
    <circle className="completion-disc" cx="50" cy="50" r="32"/>
    <path className="completion-check" pathLength="1" d="m34 50 11 11 23-24"/>
    <g className="completion-sparks"><path d="M50 4v7M50 89v7M4 50h7M89 50h7M16 16l5 5M79 79l5 5M16 84l5-5M79 21l5-5"/></g>
  </svg>;
}
