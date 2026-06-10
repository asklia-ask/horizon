const palettes = {
  cozy: ['#201326', '#6b3f5f', '#e16f7c', '#f6b17a', '#ffe6a7', '#7fc8a9'],
  dark: ['#0b1020', '#1f2947', '#5b315f', '#8f4362', '#d0835f', '#f2d3ab'],
  arcade: ['#101018', '#2634a8', '#2ce8f5', '#3cff73', '#f9f871', '#ff3d81'],
  fantasy: ['#16172d', '#414bb2', '#8d6adf', '#f0a6ca', '#ffd6a5', '#b8f2c2'],
};

const typeLabels = {
  hero: '主角角色',
  enemy: '敌人怪物',
  item: '道具图标',
  tile: '地图地块',
  effect: '技能特效',
};

const form = document.querySelector('#assetForm');
const generateBtn = document.querySelector('#generateBtn');
const copyBtn = document.querySelector('#copyBtn');
const promptOutput = document.querySelector('#promptOutput');
const fileName = document.querySelector('#fileName');
const paletteNode = document.querySelector('#palette');
const pixelPreview = document.querySelector('#pixelPreview');

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[\u4e00-\u9fa5]+/g, 'pixel')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 28) || 'pixel_asset';
}

function buildPrompt(data) {
  const colors = palettes[data.style];
  return [
    `创建一张 ${data.size}×${data.size} 像素风 ${typeLabels[data.assetType]} 素材。`,
    `主题：${data.theme}。`,
    `关键词：${data.keywords}。`,
    `风格：${document.querySelector(`#style option[value="${data.style}"]`).textContent}，清晰轮廓，低分辨率像素块，无抗锯齿。`,
    `限制：使用 6-12 色，主色板包含 ${colors.join(', ')}，透明背景，居中构图。`,
    '输出：单个 sprite，适合导入 2D 游戏引擎，避免文字、水印、复杂渐变和摄影质感。',
  ].join('\n');
}

function paintPalette(style) {
  paletteNode.innerHTML = '';
  palettes[style].forEach((color) => {
    const chip = document.createElement('span');
    chip.style.background = color;
    chip.title = color;
    paletteNode.appendChild(chip);
  });
}

function paintPreview(style, assetType) {
  const colors = palettes[style];
  pixelPreview.style.setProperty('--c1', colors[1]);
  pixelPreview.style.setProperty('--c2', colors[2]);
  pixelPreview.style.setProperty('--c3', colors[4]);
  pixelPreview.style.setProperty('--c4', colors[5]);
  pixelPreview.dataset.asset = assetType;
}

function generateAsset() {
  const data = Object.fromEntries(new FormData(form).entries());
  promptOutput.textContent = buildPrompt(data);
  fileName.textContent = `${data.assetType}_${slugify(data.theme)}_${data.size}.png`;
  paintPalette(data.style);
  paintPreview(data.style, data.assetType);
}

generateBtn.addEventListener('click', generateAsset);
form.addEventListener('input', generateAsset);

copyBtn.addEventListener('click', async () => {
  await navigator.clipboard.writeText(promptOutput.textContent);
  copyBtn.textContent = '已复制';
  setTimeout(() => {
    copyBtn.textContent = '复制';
  }, 1400);
});

generateAsset();
