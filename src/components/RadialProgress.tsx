function RadialProgress(props: { percent: number }) {

  const {percent} = props;

  const mapPercent = (value: number) => {
    return (value * 63) / (100);
  }

  return (
    <div className="relative w-40 h-40">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        <circle className="text-gray-600 stroke-current" strokeWidth="9"
                cx="50" cy="50" r="40" fill="transparent">
        </circle>
        <circle className="text-blue-600 progress-ring__circle stroke-current"
                strokeWidth="10" strokeLinecap="round" cx="50" cy="50" r="40" fill="transparent"
                strokeDashoffset={`calc(400 - (400 * ${mapPercent(percent)}) / 100)`}>
        </circle>
        <text x="50" y="50" className="text-xs font-sans text-white" fill="white"
              textAnchor="middle"
              alignmentBaseline="middle">
          {percent}%
        </text>
      </svg>
    </div>

  );
}

export default RadialProgress;
