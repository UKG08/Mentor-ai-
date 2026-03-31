export async function analyzeIdea(idea, onStageUpdate) {
  onStageUpdate(0);
  const stages = [
    "Expanding your idea",
    "Mapping your user",
    "Market intelligence",
    "Devil's advocate",
    "Stress testing",
    "Moat analysis",
    "Go-to-market strategy",
    "Defining MVP",
    "Architecting tech stack",
    "Planning execution",
    "Expert panel review",
    "Final synthesis",
  ];

  let current = 0;
  const interval = setInterval(() => {
    if (current < stages.length - 1) {
      current++;
      onStageUpdate(current);
    }
  }, 4000);

  try {
    const res = await fetch("http://localhost:8000/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idea }),
    });
    clearInterval(interval);
    onStageUpdate(stages.length);
    return await res.json();
  } catch (err) {
    clearInterval(interval);
    throw err;
  }
}

export const stages = [
  "Expanding your idea",
  "Mapping your user",
  "Market intelligence",
  "Devil's advocate",
  "Stress testing",
  "Moat analysis",
  "Go-to-market strategy",
  "Defining MVP",
  "Architecting tech stack",
  "Planning execution",
  "Expert panel review",
  "Final synthesis",
];