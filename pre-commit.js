const path = require('path');
const fs = require('fs');
const child_process = require('child_process');

const constant_file = 'constants.js';
const constants_path = path.join(__dirname, 'docs', constant_file);
const staged_files = child_process.execSync('git diff --name-only --cached', { encoding: 'utf-8' });

if (!staged_files.includes(constant_file) || !fs.existsSync(constants_path)) {
  process.exit(0);
}

const content = fs.readFileSync(constants_path, 'utf-8');

if (!content.includes('your-personal-token')) {
  console.log('There is a chance constants.js contains your github personal token.');
  console.log('If you still want to commit the file, replace the `pre-commit` hook in the package.json file with `exit 0`');
  console.log('\n\n\n');

  process.exit(1);
}