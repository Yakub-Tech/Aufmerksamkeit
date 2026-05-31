type ProgressIndicatorProps = {
  currentStep: number;
  totalSteps: number;
};

export default function ProgressIndicator({ currentStep, totalSteps }: ProgressIndicatorProps) {
  const percent = Math.min(100, (currentStep / totalSteps) * 100);

  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between font-mono text-[11px] uppercase tracking-widest text-[#2A2A28]">
        <span>Fortschritt</span>
        <span>
          {currentStep} / {totalSteps} beantwortet
        </span>
      </div>
      <div className="h-1 overflow-hidden rounded-full bg-[#D7DAE4]">
        <div
          className="h-full rounded-full bg-[#3F4A78] transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
