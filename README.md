# i18n-json-po

`jsonpo` is a CLI tool to convert JSON i18n entry list to gettext's POT file.

## Command-line usage

To install jsonpo system-wide, run:
```
$ sudo npm install -g i18n-json-po
```
Then you can use it like this:
```
$ jsonpo --help

i18n JSON -> POT converter

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
```
Be default jsonpo accepts input JSON file from stdin, so it's possible to combine it with [i18n-stex](https://github.com/2gis/stex) nicely:
```
$ stex -s 'src/**/*.ts' | jsonpo -p > strings.pot
```
Output defaults to stdout, so you can use standard unix stream redirection syntax.

## API usage

Take a look at [CLI entry point - index.ts](https://github.com/2gis/i18n-json-po/blob/master/index.ts). Usage of the one and only `convert` function is pretty straightforward and there you will find all examples you ever need.

## Contributing

i18n-json-po uses github-flow to accept & merge fixes and improvements. Basic process is:
- Fork the repo.
- Create a branch.
- Add or fix some code.
- **Run Karma testing suite with `npm run test` and make sure nothing is broken**
- Add some tests for your new code or fix broken tests.
- Run `npm run build` to build pure-js distribution files.
- Commit & push.
- Create a new pull request to original repo.

Pull requests with failing tests will not be accepted. Also, if you add or modify packages to `package.json`, make sure you use `yarn` and update `yarn.lock`.
