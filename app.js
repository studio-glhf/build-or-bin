const STORAGE_KEY = 'build-or-bin-state-v1';

const fields = {
  ideaName: document.querySelector('#ideaName'),
  user: document.querySelector('#user'),
  problem: document.querySelector('#problem'),
  statusQuo: document.querySelector('#statusQuo'),
  evidence: document.querySelector('#evidence'),
  wedge: document.querySelector('#wedge'),
  notes: document.querySelector('#notes'),
  painScore: document.querySelector('#painScore'),
  evidenceScore: document.querySelector('#evidenceScore'),
  wedgeScore: document.querySelector('#wedgeScore'),
  distributionScore: document.querySelector('#distributionScore'),
  edgeScore: document.querySelector('#edgeScore'),
  opsScore: document.querySelector('#opsScore'),
  redFlagNoUser: document.querySelector('#redFlagNoUser'),
  redFlagNoEvidence: document.querySelector('#redFlagNoEvidence'),
  redFlagTooBroad: document.querySelector('#redFlagTooBroad'),
  redFlagHeavyOps: document.querySelector('#redFlagHeavyOps'),
  redFlagWeakDistribution: document.querySelector('#redFlagWeakDistribution'),
  redFlagCrowded: document.querySelector('#redFlagCrowded'),
};

const outputs = {
  painScore: document.querySelector('#painScoreValue'),
  evidenceScore: document.querySelector('#evidenceScoreValue'),
  wedgeScore: document.querySelector('#wedgeScoreValue'),
  distributionScore: document.querySelector('#distributionScoreValue'),
  edgeScore: document.querySelector('#edgeScoreValue'),
  opsScore: document.querySelector('#opsScoreValue'),
  totalScore: document.querySelector('#totalScore'),
  verdict: document.querySelector('#verdict'),
  reasoning: document.querySelector('#reasoning'),
  summaryText: document.querySelector('#summaryText'),
};

const buttons = {
  loadSample: document.querySelector('#loadSampleButton'),
  reset: document.querySelector('#resetButton'),
  copySummary: document.querySelector('#copySummaryButton'),
};

const sampleState = {
  ideaName: 'Build or Bin',
  user: 'Indie founders and tiny product teams choosing what to build next',
  problem: 'Founders regularly burn a week or more building vague ideas that never had a sharp wedge or believable distribution path.',
  statusQuo: 'Messy notes, vibes, long chats, and half-remembered heuristics. Decisions are inconsistent and often too optimistic.',
  evidence: 'Founder communities repeatedly ask for better prioritization frameworks, and teams already use ad hoc scorecards and templates to filter ideas.',
  wedge: 'A local-first idea filter that guides one decision at a time and produces a clear build/prototype/monitor/kill verdict with exportable notes.',
  notes: 'Could expand later into portfolio tracking, experiment logs, and shareable reports.',
  painScore: 4,
  evidenceScore: 3,
  wedgeScore: 5,
  distributionScore: 3,
  edgeScore: 4,
  opsScore: 5,
  redFlagNoUser: false,
  redFlagNoEvidence: false,
  redFlagTooBroad: false,
  redFlagHeavyOps: false,
  redFlagWeakDistribution: false,
  redFlagCrowded: true,
};

function collectState() {
  return Object.fromEntries(
    Object.entries(fields).map(([key, el]) => {
      if (el.type === 'checkbox') return [key, el.checked];
      if (el.type === 'range') return [key, Number(el.value)];
      return [key, el.value.trim()];
    })
  );
}

function applyState(state) {
  for (const [key, value] of Object.entries(state)) {
    const el = fields[key];
    if (!el) continue;
    if (el.type === 'checkbox') el.checked = Boolean(value);
    else el.value = value;
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(collectState()));
}

function getRedFlags(state) {
  return [
    ['No specific user', state.redFlagNoUser],
    ['Weak evidence', state.redFlagNoEvidence],
    ['Needs a full platform first', state.redFlagTooBroad],
    ['Ops burden too high', state.redFlagHeavyOps],
    ['Weak distribution', state.redFlagWeakDistribution],
    ['Crowded / weak differentiation', state.redFlagCrowded],
  ].filter(([, active]) => active).map(([label]) => label);
}

function deriveVerdict(score, redFlags) {
  if (redFlags.length >= 3 || score <= 10) return 'KILL';
  if (redFlags.includes('Needs a full platform first') || redFlags.includes('No specific user')) return 'PARK';
  if (score >= 25 && redFlags.length === 0) return 'BUILD NOW';
  if (score >= 18) return 'PROTOTYPE';
  if (score >= 13) return 'MONITOR';
  return 'PARK';
}

function verdictCopy(verdict, score, redFlags) {
  const pressure = {
    'BUILD NOW': 'The idea looks sharp enough to deserve immediate execution. The wedge is clear and the drag is manageable.',
    PROTOTYPE: 'The idea is promising, but it still deserves a fast learning loop before deeper commitment.',
    MONITOR: 'There is signal here, but not enough conviction yet. Keep watching the market or collect stronger evidence first.',
    PARK: 'The concept may have upside later, but it is not sharp enough for focused effort right now.',
    KILL: 'The current shape is too weak or too risky. Better to stop now than spend weeks polishing the wrong thing.',
  };

  const redFlagLine = redFlags.length
    ? `Main drag: ${redFlags.join(', ')}.`
    : 'No major red flags are currently checked.';

  return `${pressure[verdict]} Score: ${score}/30. ${redFlagLine}`;
}

function buildSummary(state, score, verdict, redFlags) {
  return [
    `# ${state.ideaName || 'Untitled idea'}`,
    '',
    `Decision: ${verdict}`,
    `Score: ${score}/30`,
    '',
    `Specific user: ${state.user || '—'}`,
    `Problem: ${state.problem || '—'}`,
    `Status quo: ${state.statusQuo || '—'}`,
    `Evidence: ${state.evidence || '—'}`,
    `Narrowest wedge: ${state.wedge || '—'}`,
    '',
    `Red flags: ${redFlags.length ? redFlags.join(', ') : 'None currently checked'}`,
    `Notes: ${state.notes || '—'}`,
  ].join('\n');
}

function render() {
  const state = collectState();
  const score = state.painScore + state.evidenceScore + state.wedgeScore + state.distributionScore + state.edgeScore + state.opsScore;
  const redFlags = getRedFlags(state);
  const verdict = deriveVerdict(score, redFlags);

  for (const [key, output] of Object.entries(outputs)) {
    if (key.endsWith('Score') && state[key] !== undefined) output.value = state[key];
  }

  outputs.totalScore.textContent = `${score} / 30`;
  outputs.verdict.textContent = verdict;
  outputs.reasoning.textContent = verdictCopy(verdict, score, redFlags);
  outputs.summaryText.textContent = buildSummary(state, score, verdict, redFlags);

  saveState();
}

function reset() {
  localStorage.removeItem(STORAGE_KEY);
  document.querySelectorAll('input, textarea').forEach((el) => {
    if (el.type === 'range') el.value = el.defaultValue;
    else if (el.type === 'checkbox') el.checked = false;
    else el.value = '';
  });
  render();
}

function loadSaved() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return;
  try {
    applyState(JSON.parse(saved));
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }
}

Object.values(fields).forEach((el) => el.addEventListener('input', render));
buttons.loadSample.addEventListener('click', () => {
  applyState(sampleState);
  render();
});
buttons.reset.addEventListener('click', reset);
buttons.copySummary.addEventListener('click', async () => {
  await navigator.clipboard.writeText(outputs.summaryText.textContent);
  buttons.copySummary.textContent = 'Copied';
  setTimeout(() => (buttons.copySummary.textContent = 'Copy summary'), 1200);
});

loadSaved();
render();
