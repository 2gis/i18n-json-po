import * as assert from 'assert';
import { PluralI18NEntry, SingleI18NEntry } from 'i18n-proto';
import { Metadata, PotEntry, makeDate, getTzOffset, makePoHeader } from '../convert';
const xor = require('array-xor');

describe('JSON to PO converter', () => {
  it('Makes valid POT creation date', () => {
    let date1 = new Date('Fri Apr 01 2016 05:03:00');
    let date2 = new Date('Mon Nov 14 2016 15:13:00');
    // Here we depend on local timezone, as of js's dates are not that pure things :(
    assert.equal(makeDate(date1), '2016-04-01 05:03' + getTzOffset(date1));
    assert.equal(makeDate(date2), '2016-11-14 15:13' + getTzOffset(date2));
  });

  it('Makes valid POT header', () => {
    let m: Metadata = {
      copyrightSubject: 'cool team',
      bugsEmail: 'bugs@team.com',
      year: 2044
    };

    let expected = `# Translations template for PROJECT.
# Copyright (C) 2044 cool team
# This file is distributed under the same license as the PROJECT project.
# FIRST AUTHOR <EMAIL@ADDRESS>, 2044.
# 
#, fuzzy
msgid ""
msgstr ""
"Project-Id-Version: PROJECT VERSION\\n"
"Report-Msgid-Bugs-To: bugs@team.com\\n"
"POT-Creation-Date: SOMEDATE\\n"
"PO-Revision-Date: YEAR-MO-DA HO:MI+ZONE\\n"
"Last-Translator: FULL NAME <EMAIL@ADDRESS>\\n"
"Language-Team: LANGUAGE <LL@li.org>\\n"
"MIME-Version: 1.0\\n"
"Content-Type: text/plain; charset=utf-8\\n"
"Content-Transfer-Encoding: 8bit\\n"
"Generated-By: i18n-json2po\\n"
`;
    assert.deepEqual(
      xor(
        makePoHeader(m, 'SOMEDATE').split("\n"),
        expected.split("\n")
      ),
      []
    );
  });

  it('Parses single i18n entry', () => {
    let entry = new PotEntry();
    let i18nEntry: SingleI18NEntry = {
      type: 'single',
      entry: 'entry "quoted" text',
      context: 'entry "quoted" context',
      occurences: ['occ1', 'occ2'],
      comments: ['cmt1', 'cmt2'],
      translations: []
    };

    let expected = `#. cmt1
#. cmt2
#: occ1
#: occ2
msgctxt "entry \\"quoted\\" context"
msgid "entry \\"quoted\\" text"
msgstr ""`;

    let expectedWithoutOccurences = `#. cmt1
#. cmt2
msgctxt "entry \\"quoted\\" context"
msgid "entry \\"quoted\\" text"
msgstr ""`;

    let xor1 = xor(
      entry.parseSingleEntry(i18nEntry, true).asString().split("\n"),
      expected.split("\n")
    );
    assert.deepEqual(xor1, [], "Parsing with occurences failed. Xordiff: " + JSON.stringify(xor1));

    let xor2 = xor(
      entry.parseSingleEntry(i18nEntry, false).asString().split("\n"),
      expectedWithoutOccurences.split("\n")
    );
    assert.deepEqual(xor2, [], "Parsing without occurences failed. Xordiff: " + JSON.stringify(xor2));
  });

  it('Parses plural i18n entry', () => {
    let entry = new PotEntry();
    let i18nEntry: PluralI18NEntry = {
      type: 'plural',
      entry: ['entry "quoted" text', 'entry "quoted" plural'],
      context: 'entry "quoted" context',
      occurences: ['occ1', 'occ2'],
      comments: ['cmt1', 'cmt2'],
      translations: []
    };

    let expected = `#. cmt1
#. cmt2
#: occ1
#: occ2
msgctxt "entry \\"quoted\\" context"
msgid "entry \\"quoted\\" text"
msgid_plural "entry \\"quoted\\" plural"
msgstr[0] ""
msgstr[1] ""`;

    let expectedWithoutOccurences = `#. cmt1
#. cmt2
msgctxt "entry \\"quoted\\" context"
msgid "entry \\"quoted\\" text"
msgid_plural "entry \\"quoted\\" plural"
msgstr[0] ""
msgstr[1] ""`;

    let xor1 = xor(
      entry.parsePluralEntry(i18nEntry, true).asString().split("\n"),
      expected.split("\n")
    );
    assert.deepEqual(xor1, [], "Parsing with occurences failed. Xordiff: " + JSON.stringify(xor1));

    let xor2 = xor(
      entry.parsePluralEntry(i18nEntry, false).asString().split("\n"),
      expectedWithoutOccurences.split("\n")
    );
    assert.deepEqual(xor2, [], "Parsing without occurences failed. Xordiff: " + JSON.stringify(xor2));
  });
});
