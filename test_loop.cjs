const fs = require('fs');
const glob = require('glob'); // Not available? We can just walk.

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    filelist = fs.statSync(dir + '/' + file).isDirectory()
      ? walkSync(dir + '/' + file, filelist)
      : filelist.concat(dir + '/' + file);
  });
  return filelist;
}

const files = walkSync('./src').filter(f => f.endsWith('.tsx'));

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  if (content.includes('Maximum update depth exceeded')) console.log(f);
});

