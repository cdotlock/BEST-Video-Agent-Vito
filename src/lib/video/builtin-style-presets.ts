export interface BuiltinStylePreset {
  id: string;
  name: string;
  description: string;
  styleTokens: string[];
  positivePrompt: string;
  negativePrompt: string;
}

const PRESETS: ReadonlyArray<BuiltinStylePreset> = [
  {
    id: "animated-short-cinematic",
    name: "动画短片电影感",
    description: "面向动画短片的默认导演级基线，强调镜头设计、角色一致性与背景层次。",
    styleTokens: [
      "animated short film",
      "cinematic composition",
      "readable silhouette",
      "layered background",
      "controlled lighting",
      "story-driven frame",
    ],
    positivePrompt:
      "animated short film frame, cinematic staging, readable silhouette, layered foreground midground background, consistent character design, controlled lighting, story-driven composition",
    negativePrompt:
      "product ad minimalism, noisy clutter, broken anatomy, inconsistent character model, extra limbs, chaotic background detail",
  },
  {
    id: "product-white-minimal",
    name: "产品白色极简",
    description: "高端产品展示，留白充足，软光影。",
    styleTokens: ["white background", "minimalism", "soft shadow", "product hero", "clean studio"],
    positivePrompt: "pure white studio, premium product hero shot, soft gradient lighting, clean composition",
    negativePrompt: "busy background, cluttered props, noisy texture, low contrast",
  },
  {
    id: "cinematic-realism",
    name: "电影写实",
    description: "电影级光影与真实材质，适合剧情和叙事。",
    styleTokens: ["cinematic", "realistic", "dramatic light", "film grain subtle", "depth of field"],
    positivePrompt: "cinematic realism, natural skin texture, layered lighting, subtle depth and atmosphere",
    negativePrompt: "cartoon shading, over-saturated colors, plastic texture",
  },
  {
    id: "anime-cel",
    name: "日系赛璐璐",
    description: "二次元赛璐璐风格，线条干净。",
    styleTokens: ["anime", "cel shading", "clean lineart", "flat color blocks", "expressive pose"],
    positivePrompt: "anime cel shading, clean lineart, vivid yet balanced palette, dynamic composition",
    negativePrompt: "photoreal face, muddy color, over-rendered skin",
  },
  {
    id: "ink-wash",
    name: "水墨国风",
    description: "留白和墨色层次，东方笔触。",
    styleTokens: ["ink wash", "chinese painting", "brush texture", "negative space", "poetic"],
    positivePrompt: "traditional ink wash painting, layered brush strokes, elegant negative space",
    negativePrompt: "hard digital edges, neon palette, modern UI elements",
  },
  {
    id: "watercolor-soft",
    name: "水彩柔和",
    description: "柔和笔触与颗粒纸感，氛围温润。",
    styleTokens: ["watercolor", "soft edge", "paper grain", "pastel tone", "illustrative"],
    positivePrompt: "soft watercolor wash, natural paper texture, gentle pastel palette",
    negativePrompt: "harsh outlines, metallic gloss, over-sharp details",
  },
  {
    id: "cyberpunk-neon",
    name: "赛博霓虹",
    description: "高对比霓虹灯和未来都市质感。",
    styleTokens: ["cyberpunk", "neon", "night city", "high contrast", "wet reflection"],
    positivePrompt: "cyberpunk night city, neon reflections, futuristic haze, dynamic camera angle",
    negativePrompt: "flat daylight scene, low contrast, rustic village mood",
  },
  {
    id: "noir-monochrome",
    name: "黑白黑色电影",
    description: "高反差黑白、强烈明暗结构。",
    styleTokens: ["film noir", "monochrome", "high contrast", "hard shadow", "mysterious"],
    positivePrompt: "film noir monochrome, dramatic hard light, rich shadow geometry",
    negativePrompt: "vivid rainbow colors, soft pastel wash, low contrast",
  },
  {
    id: "fashion-editorial",
    name: "时尚大片",
    description: "时尚杂志风，高级灯光与构图。",
    styleTokens: ["fashion editorial", "premium lighting", "high-end", "clean backdrop", "stylized pose"],
    positivePrompt: "luxury fashion editorial look, controlled studio lighting, polished visual language",
    negativePrompt: "casual snapshot, random framing, poor wardrobe focus",
  },
  {
    id: "documentary-natural",
    name: "纪实自然",
    description: "自然光优先，真实观察视角。",
    styleTokens: ["documentary", "natural light", "observational", "authentic", "handheld subtle"],
    positivePrompt: "documentary realism, natural light, authentic moment capture, grounded color grading",
    negativePrompt: "over-stylized look, synthetic lighting, polished ad aesthetic",
  },
  {
    id: "fantasy-epic",
    name: "奇幻史诗",
    description: "宏大场景与史诗氛围。",
    styleTokens: ["fantasy", "epic", "volumetric light", "grand scale", "mythic"],
    positivePrompt: "epic fantasy scene, volumetric god rays, majestic atmosphere, cinematic scale",
    negativePrompt: "flat composition, mundane office setting, minimal mood",
  },
  {
    id: "sci-fi-sterile",
    name: "科幻洁净",
    description: "冷白科技空间，线条克制。",
    styleTokens: ["sci-fi", "sterile", "clean lines", "cool white", "high-tech lab"],
    positivePrompt: "sterile sci-fi lab, clean geometry, cool white key light, advanced technology mood",
    negativePrompt: "rustic textures, warm vintage filter, chaotic props",
  },
  {
    id: "luxury-gold-black",
    name: "奢华金黑",
    description: "黑金配色与高端广告质感。",
    styleTokens: ["luxury", "gold accents", "black backdrop", "premium", "specular highlights"],
    positivePrompt: "premium black and gold aesthetic, glossy highlights, luxury advertising composition",
    negativePrompt: "flat matte look, playful cartoon palette, cluttered scene",
  },
  {
    id: "retro-vhs",
    name: "复古 VHS",
    description: "80/90 年代录像带质感和偏色。",
    styleTokens: ["retro", "vhs", "chromatic aberration", "scan lines", "nostalgic"],
    positivePrompt: "retro VHS look, analog scanline texture, nostalgic color drift, subtle glitch",
    negativePrompt: "ultra clean digital look, modern pristine sharpness",
  },
  {
    id: "pixel-art",
    name: "像素风",
    description: "低分辨率像素图形，游戏感。",
    styleTokens: ["pixel art", "8-bit", "16-bit", "limited palette", "game sprite mood"],
    positivePrompt: "pixel art style, crisp blocky silhouette, limited palette game aesthetics",
    negativePrompt: "smooth gradients, photoreal rendering, anti-aliased blur",
  },
  {
    id: "lowpoly-3d",
    name: "Low Poly 3D",
    description: "低多边形风格，几何简洁。",
    styleTokens: ["low poly", "geometric", "stylized 3d", "clean edges", "simple shading"],
    positivePrompt: "low poly 3D style, geometric forms, clean stylized shading",
    negativePrompt: "high-frequency noise, hyper-real micro-detail",
  },
  {
    id: "clay-stopmotion",
    name: "黏土定格",
    description: "手工黏土质感，温暖可爱。",
    styleTokens: ["clay", "stop motion", "handcrafted", "soft texture", "miniature"],
    positivePrompt: "clay stop-motion texture, handcrafted miniature scene, warm charming light",
    negativePrompt: "hard polished metal texture, sterile realism",
  },
  {
    id: "isometric-ui",
    name: "等距信息图",
    description: "等距视角，适合流程演示。",
    styleTokens: ["isometric", "clean infographic", "ui style", "vector-like", "structured layout"],
    positivePrompt: "isometric clean infographic style, structured composition, clear object hierarchy",
    negativePrompt: "messy perspective, random camera angle, painterly blur",
  },
  {
    id: "architectural-modern",
    name: "现代建筑",
    description: "现代空间、材质和构造细节。",
    styleTokens: ["architecture", "modern", "clean concrete", "glass", "structural lines"],
    positivePrompt: "modern architectural visualization, precise lines, premium materials, balanced daylight",
    negativePrompt: "fantasy ornaments, chaotic urban clutter",
  },
  {
    id: "sketch-line",
    name: "线稿草图",
    description: "线条表达为主，适合前期概念。",
    styleTokens: ["line sketch", "concept draft", "monochrome line", "design process", "rough ideation"],
    positivePrompt: "clean concept line sketch, expressive draft quality, structural clarity",
    negativePrompt: "full realistic rendering, heavy texture fill",
  },
  {
    id: "game-concept",
    name: "游戏概念设定",
    description: "游戏概念图气质，层次丰富。",
    styleTokens: ["concept art", "game art", "atmospheric", "world building", "cinematic paint"],
    positivePrompt: "game concept art, cinematic atmosphere, strong world-building cues",
    negativePrompt: "flat design poster, simplistic icon style",
  },
  {
    id: "paper-cut",
    name: "剪纸拼贴",
    description: "纸张层叠与手工拼贴。",
    styleTokens: ["paper cut", "collage", "layered shapes", "craft texture", "graphic"],
    positivePrompt: "paper cut collage style, layered handcrafted shapes, tactile paper edges",
    negativePrompt: "photoreal depth, smooth CGI gloss",
  },
  {
    id: "ukiyoe-modern",
    name: "浮世绘现代化",
    description: "传统浮世绘与现代构图融合。",
    styleTokens: ["ukiyoe", "woodblock print", "flat perspective", "decorative wave", "graphic contrast"],
    positivePrompt: "modern ukiyo-e interpretation, woodblock texture, stylized pattern rhythm",
    negativePrompt: "photoreal lens effects, glossy CGI reflections",
  },
  {
    id: "kids-book-soft",
    name: "童书插画",
    description: "亲和柔软，适合教育与亲子内容。",
    styleTokens: ["children illustration", "soft", "friendly", "simple forms", "warm tone"],
    positivePrompt: "children's book illustration style, soft warm palette, approachable character design",
    negativePrompt: "violent mood, harsh contrast, dark horror tone",
  },
  {
    id: "industrial-tech",
    name: "工业科技",
    description: "机械结构和工艺细节突出。",
    styleTokens: ["industrial", "mechanical", "technical", "precision", "metal structure"],
    positivePrompt: "industrial technical visualization, precision mechanics, engineered composition",
    negativePrompt: "whimsical cartoon props, messy handcrafted look",
  },
  {
    id: "nature-lifestyle",
    name: "自然生活方式",
    description: "自然光与生活感，适合品牌内容。",
    styleTokens: ["lifestyle", "natural", "organic", "soft daylight", "calm"],
    positivePrompt: "natural lifestyle aesthetic, organic textures, soft daylight, calm brand mood",
    negativePrompt: "neon cyber style, hard synthetic lighting",
  },
];

const PRESET_BY_ID = new Map<string, BuiltinStylePreset>(PRESETS.map((preset) => [preset.id, preset]));
const DEFAULT_PRESET_ID = "animated-short-cinematic";

const KEYWORD_RULES: ReadonlyArray<{ presetId: string; keywords: string[] }> = [
  { presetId: "product-white-minimal", keywords: ["产品", "product", "极简", "minimal", "白色", "white"] },
  { presetId: "animated-short-cinematic", keywords: ["动画", "animated", "短片", "short film", "叙事", "剧情", "分镜", "storyboard"] },
  { presetId: "anime-cel", keywords: ["二次元", "anime", "漫画", "cel"] },
  { presetId: "ink-wash", keywords: ["水墨", "国风", "ink"] },
  { presetId: "watercolor-soft", keywords: ["水彩", "watercolor"] },
  { presetId: "cyberpunk-neon", keywords: ["赛博", "cyberpunk", "霓虹", "neon"] },
  { presetId: "noir-monochrome", keywords: ["黑白", "noir", "侦探"] },
  { presetId: "fashion-editorial", keywords: ["时尚", "fashion", "杂志", "editorial"] },
  { presetId: "documentary-natural", keywords: ["纪录", "纪实", "documentary"] },
  { presetId: "fantasy-epic", keywords: ["奇幻", "fantasy", "史诗"] },
  { presetId: "sci-fi-sterile", keywords: ["科幻", "sci-fi", "太空", "实验室"] },
  { presetId: "luxury-gold-black", keywords: ["奢华", "luxury", "黑金"] },
  { presetId: "retro-vhs", keywords: ["复古", "vhs", "怀旧"] },
  { presetId: "pixel-art", keywords: ["像素", "pixel", "8-bit", "16-bit"] },
  { presetId: "lowpoly-3d", keywords: ["low poly", "低模", "低多边形"] },
  { presetId: "clay-stopmotion", keywords: ["黏土", "定格", "clay"] },
  { presetId: "isometric-ui", keywords: ["等距", "isometric", "信息图"] },
  { presetId: "architectural-modern", keywords: ["建筑", "architecture"] },
  { presetId: "sketch-line", keywords: ["线稿", "草图", "sketch"] },
  { presetId: "game-concept", keywords: ["概念", "concept art", "游戏设定"] },
  { presetId: "paper-cut", keywords: ["剪纸", "拼贴", "collage"] },
  { presetId: "ukiyoe-modern", keywords: ["浮世绘", "ukiyoe"] },
  { presetId: "kids-book-soft", keywords: ["童书", "儿童", "kids"] },
  { presetId: "industrial-tech", keywords: ["工业", "机械", "industrial"] },
  { presetId: "nature-lifestyle", keywords: ["生活方式", "lifestyle", "自然"] },
];

export function listBuiltinStylePresets(): ReadonlyArray<BuiltinStylePreset> {
  return PRESETS;
}

export function getDefaultBuiltinStylePreset(): BuiltinStylePreset {
  const preset = PRESET_BY_ID.get(DEFAULT_PRESET_ID);
  if (!preset) {
    throw new Error(`Missing default preset: ${DEFAULT_PRESET_ID}`);
  }
  return preset;
}

export function pickBuiltinStylePreset(goal: string | null): BuiltinStylePreset {
  if (!goal) return getDefaultBuiltinStylePreset();
  const normalizedGoal = goal.toLowerCase();

  for (const rule of KEYWORD_RULES) {
    if (rule.keywords.some((keyword) => normalizedGoal.includes(keyword.toLowerCase()))) {
      const preset = PRESET_BY_ID.get(rule.presetId);
      if (preset) return preset;
    }
  }

  return getDefaultBuiltinStylePreset();
}
