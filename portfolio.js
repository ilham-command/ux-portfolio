const sketch = document.querySelector('.sketch');
const sketchControls = sketch.querySelector('.sketch-content');
const sketchButton = sketch.querySelector('.sketch-toggle');
const sketchLabel = sketch.querySelector('.sketch-label');

sketchControls.hidden = false;
sketch.querySelector('.sketch-fallback').hidden = true;

sketchButton.addEventListener('click', () => {
  const isClear = sketch.classList.toggle('is-clear');
  sketchButton.setAttribute('aria-pressed', String(isClear));
  sketchLabel.textContent = isClear
    ? 'Turn it into an idea worth testing.'
    : 'Start with a messy question.';
});

const timeline = document.querySelector('.timeline');
const milestones = [...timeline.querySelectorAll('li')];
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
let frame = 0;

function drawTimeline() {
  frame = 0;
  const bounds = timeline.getBoundingClientRect();
  const readingLine = window.innerHeight * 0.73;
  const progress = Math.min(100, Math.max(0, (readingLine - bounds.top) / bounds.height * 100));
  timeline.style.setProperty('--progress', progress + '%');

  for (const milestone of milestones) {
    milestone.classList.toggle('is-reached', milestone.getBoundingClientRect().top <= readingLine);
  }
}

function scheduleTimeline() {
  if (!frame) frame = window.requestAnimationFrame(drawTimeline);
}

function applyMotionPreference() {
  const track = !motionPreference.matches;
  timeline.classList.toggle('is-tracked', track);
  if (track) {
    window.addEventListener('scroll', scheduleTimeline, { passive: true });
    window.addEventListener('resize', scheduleTimeline);
    drawTimeline();
  } else {
    window.removeEventListener('scroll', scheduleTimeline);
    window.removeEventListener('resize', scheduleTimeline);
    window.cancelAnimationFrame(frame);
    frame = 0;
    for (const milestone of milestones) milestone.classList.remove('is-reached');
  }
}

motionPreference.addEventListener('change', applyMotionPreference);
applyMotionPreference();
