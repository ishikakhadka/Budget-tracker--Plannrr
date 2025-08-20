export interface IBudget {
  currentSavings: number;
  savingPlan?: number;
}

export const getProgressMessage = (budgets: IBudget[]) => {
  if (!budgets.length) return "No budget created yet.";

  // Calculate progress for each budget
  const progresses = budgets.map((b) =>
    b.savingPlan ? Math.min((b.currentSavings / b.savingPlan) * 100, 100) : 0
  );

  // Average progress
  const avgProgress =
    progresses.reduce((acc, val) => acc + val, 0) / progresses.length;

  if (avgProgress === 100) return "All goals achieved! Great job!";
  if (avgProgress > 80) return "Almost at your goals, stay motivated!";
  if (avgProgress > 50) return "More than halfway there!";
  if (avgProgress > 20) return "Making good progress, keep it up!";
  return "Just getting started, keep saving!";
};
