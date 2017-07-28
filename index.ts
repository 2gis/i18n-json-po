import * as cli from 'cli';
import { readFile, writeFile } from 'fs';
import { convert } from './convert';

const options = cli.parse({
  src: ['s', 'A source JSON file to process', 'string', '__stdin'],
  output: ['o', 'Output JSON file', 'string', '__stdout'],
  copyrightSubject: ['c', 'Copyright for generated POT file', 'string', ''],
  bugsEmail: ['b', 'Email for bugs', 'string', ''],
  printOccurences: ['p', 'Print string occurence comments', 'boolean', false],
  year: ['y', 'Copyright year', 'number', (new Date()).getFullYear()],
  help: ['h', 'Show some help', 'bool', false]
});

if (options.help) {
  console.log(`i18n JSON -> POT converter

Options:
   -h / --help                   Show this help
   -s / --src FILE               Define input JSON file name. Defaults 
                                 to stdin.
   -o / --output FILE            Define output POT file name. If a file 
                                 already exists, it's contents will be
                                 overwritten. Defaults to stdout.
   -p / --printOccurences        Print "#:" comments which indicate string 
                                 occurences in source code.
   
   -c / --copyrightSubject SUBJ  Team name or author name.
   -b / --bugsEmail EMAIL        Email for sending bugs
   -y / --year YEAR              Copyright year, defaults to current year.
`);
  process.exit(0);
}

console.warn('Running conversion for file: ', options.src);

const meta = {
  copyrightSubject: options.copyrightSubject,
  bugsEmail: options.bugsEmail,
  year: options.year,
};

if (options.src === '__stdin') {
  cli.withStdin((data) => {
    try {
      makeOutput(convert(data, meta, options.printOccurences), options.output);
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
  });
} else {
  readFile(options.src, { encoding: 'utf-8' }, (err, data) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    try {
      makeOutput(convert(data, meta, options.printOccurences), options.output);
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
  });
}

function makeOutput(data: string, output: string) {
  if (output === '__stdout') {
    console.log(data);
  } else {
    writeFile(output, data, (e) => {
      if (e) {
        console.error(e);
        process.exit(1);
      }
      process.exit(0); // success
    });
  }
}
