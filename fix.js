const fs = require('fs');
const path = require('path');

const files = [
  'src/app/master/jurusan/page.tsx',
  'src/app/master/prodi/page.tsx',
  'src/app/curriculum/profiles/page.tsx',
  'src/app/curriculum/mapping/page.tsx',
  'src/app/academic/rps/page.tsx',
  'src/app/curriculum/viewer/page.tsx',
  'src/app/academic/assessment/page.tsx'
];

files.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/@\//g, '../../../');
    content = content.replace(/variant="outline"/g, 'variant="secondary"');
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated', file);
  } else {
    console.log('Not found', file);
  }
});
