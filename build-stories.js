const fs = require('fs');

// Read page.tsx
const pageContent = fs.readFileSync('src/app/stories/page.tsx', 'utf8');
const startIndex = pageContent.indexOf('const storiesData = [');
const endIndex = pageContent.indexOf('];', startIndex) + 2;
const arrayText = pageContent.substring(startIndex, endIndex).replace('const storiesData = ', '');

// Evaluate array
const existingStories = eval(arrayText);

// Read newbooks.md
const newbooksContent = fs.readFileSync('public/captions/newbooks .md', 'utf8');

// Use string splitting because it's safer than huge regexes for this document structure.
// The document has these exact sections.
const hindi1_start = newbooksContent.indexOf('शिव समुद्र मंथन कथा: नीलकंठ महादेव बनने की पूरी कहानी');
const english1_start = newbooksContent.indexOf('Lord Shiva and the Samudra Manthan: The Story of Neelkanth');
const hindi2_start = newbooksContent.indexOf('शिव की जटा पर गंगा: गंगा अवतरण की पूरी कहानी');
const english2_start = newbooksContent.indexOf('Ganga on Lord Shiva\'s Matted Hair: The Complete Story of Ganga Avataran');
const hindi3_start = newbooksContent.indexOf('नटराज: शिव के लौकिक नृत्य का अर्थ');
const english3_start = newbooksContent.indexOf('Nataraja: The Cosmic Dance of Creation and Destruction');

const hindi1 = newbooksContent.substring(hindi1_start, english1_start).trim();
const english1 = newbooksContent.substring(english1_start, hindi2_start).trim();

const hindi2 = newbooksContent.substring(hindi2_start, english2_start).trim();
const english2 = newbooksContent.substring(english2_start, hindi3_start).trim();

const hindi3 = newbooksContent.substring(hindi3_start, english3_start).trim();
const english3 = newbooksContent.substring(english3_start).trim(); // to end of file

const story21 = {
  id: 21,
  title: "Lord Shiva and the Samudra Manthan: The Story of Neelkanth",
  source: "Source: Bhagavata Purana, Vishnu Purana",
  sloka: "ॐ नमः शिवाय ॥\n(Om Namah Shivaya ||)",
  english: english1,
  hindi: hindi1,
  image: "/images/lord-shiva-8918728_1280.png"
};

const story22 = {
  id: 22,
  title: "Ganga on Lord Shiva's Matted Hair: The Complete Story of Ganga Avataran",
  source: "Source: Ramayana (Bala Kanda), Shiva Purana",
  sloka: "ॐ नमः शिवाय ॥\n(Om Namah Shivaya ||)",
  english: english2,
  hindi: hindi2,
  image: "/images/ai-generated-8161581_1280.jpg"
};

const story23 = {
  id: 23,
  title: "Nataraja: The Cosmic Dance of Creation and Destruction",
  source: "Source: Kurma Purana, Chidambaram Mahatmyam",
  sloka: "ॐ नमः शिवाय ॥\n(Om Namah Shivaya ||)",
  english: english3,
  hindi: hindi3,
  image: "/images/pexels-photo-26099902.avif"
};

existingStories.push(story21, story22, story23);

fs.mkdirSync('src/data', { recursive: true });
fs.writeFileSync('src/data/stories.json', JSON.stringify(existingStories, null, 2), 'utf8');
console.log('Successfully wrote ' + existingStories.length + ' stories to src/data/stories.json');
