import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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
            <div className="flex flex-col items-center gap-2">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all",
                  isComplete
                    ? "bg-soft-purple text-white"
                    : isCurrent
                    ? "bg-soft-purple/20 border-2 border-soft-purple text-soft-purple"
                    : "bg-muted-blue/10 border-2 border-muted-blue/30 text-muted-blue",
                )}
              >
                {isComplete ? "\u2713" : step}
              </div>
              <Badge variant={isCurrent ? "default" : "outline"} className="text-[10px] px-2">
                {labels[i]}
              </Badge>
            </div>

            {step < totalSteps && (
              <div
                className={cn(
                  "w-8 sm:w-16 h-0.5 mb-5 mx-1 transition-all",
                  step < currentStep ? "bg-soft-purple" : "bg-muted-blue/20",
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
