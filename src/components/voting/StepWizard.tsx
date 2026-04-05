interface StepWizardProps {
  currentStep: number;
  totalSteps: number;
  labels: string[];
}

export default function StepWizard({ currentStep, totalSteps, labels }: StepWizardProps) {
  return (
    <div className="flex items-center justify-center gap-0 py-4">
      {Array.from({ length: totalSteps }).map((_, i) => {
        const step = i + 1;
        const isComplete = step < currentStep;
        const isCurrent = step === currentStep;

        return (
          <div key={step} className="flex items-center">
            {/* Step circle */}
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition ${
                  isComplete
                    ? "bg-soft-purple text-white"
                    : isCurrent
                    ? "bg-soft-purple/20 border-2 border-soft-purple text-soft-purple"
                    : "bg-muted-blue/10 border-2 border-muted-blue/30 text-muted-blue"
                }`}
              >
                {isComplete ? "\u2713" : step}
              </div>
              <span className="text-xs text-muted-blue max-w-[80px] text-center leading-tight">
                {labels[i]}
              </span>
            </div>

            {/* Connector line */}
            {step < totalSteps && (
              <div
                className={`w-8 sm:w-16 h-0.5 mx-1 mb-6 transition ${
                  step < currentStep ? "bg-soft-purple" : "bg-muted-blue/20"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
