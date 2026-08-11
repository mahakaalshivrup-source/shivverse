const fs = require('fs');
const content = fs.readFileSync('public/captions/newbooks .md', 'utf8');

// The file structure based on visual inspection:
// 1. Hindi - Samudra Manthan
// 2. English - Samudra Manthan
// 3. Hindi - Ganga Avataran
// 4. English - Ganga Avataran
// 5. Hindi - Nataraja
// 6. English - Nataraja

const h1_start = content.indexOf('शिव समुद्र मंथन कथा:');
const e1_start = content.indexOf('Lord Shiva and the Samudra Manthan:');
const h2_start = content.indexOf('शिव की जटा पर गंगा:');
const e2_start = content.indexOf('Ganga on Lord Shiva\'s Matted Hair:');
const h3_start = content.indexOf('नटराज: शिव के लौकिक नृत्य का अर्थ');
const e3_start = content.indexOf('Nataraja: The Meaning, Symbolism, and Story');

const h1 = content.substring(h1_start, e1_start).trim();
const e1 = content.substring(e1_start, h2_start).trim();

const h2 = content.substring(h2_start, e2_start).trim();
const e2 = content.substring(e2_start, h3_start).trim();

const h3 = content.substring(h3_start, e3_start).trim();
const e3 = content.substring(e3_start).trim();

const stories = JSON.parse(fs.readFileSync('src/data/stories.json', 'utf8'));

// Update 21
stories[20].hindi = h1;
stories[20].english = e1;

// Update 22
stories[21].hindi = h2;
stories[21].english = e2;

// Update 23
stories[22].hindi = h3;
stories[22].english = e3;

fs.writeFileSync('src/data/stories.json', JSON.stringify(stories, null, 2), 'utf8');
console.log('Successfully fixed stories.json');
