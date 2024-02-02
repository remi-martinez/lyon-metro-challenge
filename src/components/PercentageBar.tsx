function PercentageBar(props: { percent: number }) {

  const {percent} = props;

  return (
    <>
      <div className="flex justify-between mb-1 float-right right-0 -translate-y-full">
        <span className="text-sm font-medium text-blue-700 dark:text-white">{percent}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700 my-2">
        <div className="bg-blue-600 h-1.5 rounded-full transition-all duration-150 ease-in-out"
             style={{width: `${percent}%`}}></div>
      </div>
    </>
  );
}

export default PercentageBar;
