import { readFileSync, writeFileSync } from 'fs';
const path = 'src/components/public/Footer.tsx';
const content = readFileSync(path, 'utf8');
const fixed = content.replace(/Â©/g, '©').replace(/Â /g, '');
if (fixed !== content) {
  writeFileSync(path, fixed, 'utf8');
  console.log('Fixed encoding issue in Footer.tsx');
} else {
  console.log('No encoding issue found, raw chars near copyright:');
  const idx = content.indexOf('©') || content.indexOf('\u00a9');
  console.log(JSON.stringify(content.slice(Math.max(0,idx-10), idx+30)));
  // find any copyright-ish area
  const idx2 = content.indexOf('Full Stack');
  console.log('Near "Full Stack":', JSON.stringify(content.slice(idx2-5, idx2+60)));
  const idx3 = content.indexOf('{new Date');
  console.log('Near date:', JSON.stringify(content.slice(idx3-30, idx3+80)));
}
