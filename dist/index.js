"use strict";
exports.__esModule = true;
var cli = require("cli");
var fs_1 = require("fs");
var convert_1 = require("./convert");
var options = cli.parse({
    src: ['s', 'A source JSON file to process', 'string', '__stdin'],
    output: ['o', 'Output JSON file', 'string', '__stdout'],
    copyrightSubject: ['c', 'Copyright for generated POT file', 'string', ''],
    bugsEmail: ['b', 'Email for bugs', 'string', ''],
    printOccurences: ['p', 'Print string occurence comments', 'boolean', false],
    year: ['y', 'Copyright year', 'number', (new Date()).getFullYear()],
    help: ['h', 'Show some help', 'bool', false]
});
if (options.help) {
    console.log("i18n JSON -> POT converter\n\nOptions:\n   -h / --help                   Show this help\n   -s / --src FILE               Define input JSON file name. Defaults \n                                 to stdin.\n   -o / --output FILE            Define output POT file name. If a file \n                                 already exists, it's contents will be\n                                 overwritten. Defaults to stdout.\n   -p / --printOccurences        Print \"#:\" comments which indicate string \n                                 occurences in source code.\n   \n   -c / --copyrightSubject SUBJ  Team name or author name.\n   -b / --bugsEmail EMAIL        Email for sending bugs\n   -y / --year YEAR              Copyright year, defaults to current year.\n");
    process.exit(0);
}
console.warn('Running conversion for file: ', options.src);
var meta = {
    copyrightSubject: options.copyrightSubject,
    bugsEmail: options.bugsEmail,
    year: options.year
};
if (options.src === '__stdin') {
    cli.withStdin(function (data) {
        try {
            makeOutput(convert_1.convert(data, meta, options.printOccurences), options.output);
        }
        catch (e) {
            console.error(e);
            process.exit(1);
        }
    });
}
else {
    fs_1.readFile(options.src, { encoding: 'utf-8' }, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        try {
            makeOutput(convert_1.convert(data, meta, options.printOccurences), options.output);
        }
        catch (e) {
            console.error(e);
            process.exit(1);
        }
    });
}
function makeOutput(data, output) {
    if (output === '__stdout') {
        console.log(data);
    }
    else {
        fs_1.writeFile(output, data, function (e) {
            if (e) {
                console.error(e);
                process.exit(1);
            }
            process.exit(0); // success
        });
    }
}
