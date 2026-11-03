/* Content module: add new appreciation lines or identity captions here. */
window.SY = window.SY || {};
SY.shuffle = function (a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
SY.lines = [
  "A Mind Full of Possibilities.", "Born to Imagine, Driven to Create.", "Creativity Has No Limits.",
  "Think Beyond the Ordinary.", "A Vision Beyond Boundaries.", "Turning Imagination Into Reality.",
  "A Creative Mind Never Stops Exploring.", "Different Thoughts. Unique Creations.", "Every Creation Tells a Story.",
  "Shiv Yogi – Made to Create Something Different.", "Curiosity Is the First Spark of Genius.",
  "Where Others See Limits, He Sees Canvas.", "Ideas That Refuse to Be Ordinary.", "Innovation Begins With a Fearless Thought.",
  "An Original Mind Leaves Original Footprints.", "Ambition Shapes the Future One Idea at a Time.", "Imagination Is His Native Language.",
  "Building Tomorrow From Today's Dreams.", "Intelligence Meets Imagination.", "A Thinker. A Builder. A Dreamer.",
  "Creating What Has Never Existed.", "Every Idea Is a Doorway.", "Quiet Focus. Boundless Creativity.",
  "Shiv Yogi Designs the Unexpected.", "Originality Is His Signature.", "The Future Belongs to Curious Minds.",
  "Dream Boldly. Create Fearlessly.", "Where Imagination Meets Execution.", "A Spark of Curiosity Lights Endless Worlds.",
  "Vision Turns Thoughts Into Worlds.", "Creativity Is Courage Made Visible.", "Innovation Is Just Imagination With a Plan.",
  "Some Minds Simply Refuse to Fit In.", "Restless Ideas. Relentless Creator.", "Crafting Digital Worlds Beyond the Horizon.",
  "Shiv Yogi – Where Thought Becomes Art.", "A Brilliant Mind in Constant Motion.", "Never Copy. Always Create.",
  "Imagination Without Boundaries, Ambition Without Limits.", "Every Pixel Carries a Piece of His Vision."
];
/* Each caption is a group of stacked items: t = text, cls = size class, off = start delay (ms). */
SY.captions = [
  [{ t: "ABOUT", cls: "lab", style: "beam" }, { t: "SHIV YOGI", cls: "big", off: 500 }],
  [{ t: "THE CREATIVE MIND", cls: "lab", style: "beam" }, { t: "SHIV YOGI", cls: "big", off: 700 }],
  [{ t: "CREATED WITH IMAGINATION", cls: "idc" }],
  [{ t: "SHIV YOGI", cls: "big" }, { t: "AN ORIGINAL VISION", cls: "lab", off: 900, style: "stagger" }]
];
