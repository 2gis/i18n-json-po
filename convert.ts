import { I18NEntry, SingleI18NEntry, PluralI18NEntry } from 'i18n-proto';

export type Metadata = {
  copyrightSubject: string,
  bugsEmail: string,
  year: number
};

export function getTzOffset(date: Date) {
  const timezoneShift = date.getTimezoneOffset() / -60;
  let tz = 'Z';
  if (timezoneShift !== 0) {
    tz = (timezoneShift > 0 ? '+' : '-') +
      (timezoneShift > 9 ? '' : '0')
      + timezoneShift + '00';
  }

  return tz;
}

export function makeDate(date: Date) {
  return date.getFullYear() + '-' +
    ((date.getMonth() + 1) > 9 ? '' : '0') + (date.getMonth() + 1) + '-' +
    (date.getDate() > 9 ? '' : '0') + date.getDate() + ' ' +
    (date.getHours() > 9 ? '' : '0') + date.getHours() + ':' +
    (date.getMinutes() > 9 ? '' : '0') + date.getMinutes() +
    getTzOffset(date);
}

export function makePoHeader(meta: Metadata, genDate: string): string {
  return `# Translations template for PROJECT.
# Copyright (C) ${meta.year} ${meta.copyrightSubject}
# This file is distributed under the same license as the PROJECT project.
# FIRST AUTHOR <EMAIL@ADDRESS>, ${meta.year}.
# 
#, fuzzy
msgid ""
msgstr ""
"Project-Id-Version: PROJECT VERSION\\n"
"Report-Msgid-Bugs-To: ${meta.bugsEmail}\\n"
"POT-Creation-Date: ${genDate}\\n"
"PO-Revision-Date: YEAR-MO-DA HO:MI+ZONE\\n"
"Last-Translator: FULL NAME <EMAIL@ADDRESS>\\n"
"Language-Team: LANGUAGE <LL@li.org>\\n"
"MIME-Version: 1.0\\n"
"Content-Type: text/plain; charset=utf-8\\n"
"Content-Transfer-Encoding: 8bit\\n"
"Generated-By: i18n-json2po\\n"

`;
}

export function convert(json: string, meta: Metadata, printOccurences: boolean): string {
  const document: I18NEntry[] = JSON.parse(json);
  let poEntries: PotEntry[] = [];

  for (let item of document) {
    let potEntry = new PotEntry();
    if (item.type === 'single') {
      potEntry.parseSingleEntry(item, printOccurences);
    }
    if (item.type === 'plural') {
      potEntry.parsePluralEntry(item, printOccurences);
    }
    poEntries.push(potEntry);
  }

  return makePoHeader(meta, makeDate(new Date())) + poEntries
    .map((entry) => entry.asString())
    .join("\n\n");
}

export class PotEntry {
  private items: string[];

  protected addComment = (comment: string) => this.items.push('#. ' + comment);
  protected addOccurence = (occ: string) => this.items.push('#: ' + occ);
  protected addContext = (context: string) => this.items.push('msgctxt ' + JSON.stringify(context));
  protected addMsgid = (id: string) => this.items.push('msgid ' + JSON.stringify(id));
  protected addMsgidPlural = (id: string) => this.items.push('msgid_plural ' + JSON.stringify(id));
  protected addMsgstr = () => this.items.push('msgstr ""');
  protected addMsgstrPlural = (count: number) => {
    for (let i = 0; i < count; i++) {
      this.items.push('msgstr[' + i + '] ""');
    }
  };

  public asString = () => this.items.join("\n");

  public parseSingleEntry({ entry, comments, occurences, context, type }: SingleI18NEntry, printOccurences: boolean): PotEntry {
    this.items = [];
    if (comments) {
      comments.forEach(this.addComment);
    }

    if (occurences && printOccurences) {
      occurences.forEach(this.addOccurence);
    }

    if (context) {
      this.addContext(context);
    }

    if (type === 'single') {
      this.addMsgid(entry);
      this.addMsgstr();
    }

    return this;
  }

  public parsePluralEntry({ entry, comments, occurences, context, type }: PluralI18NEntry, printOccurences: boolean): PotEntry {
    this.items = [];
    if (comments) {
      comments.forEach(this.addComment);
    }

    if (occurences && printOccurences) {
      occurences.forEach(this.addOccurence);
    }

    if (context) {
      this.addContext(context);
    }

    if (type === 'plural') {
      this.addMsgid(entry[0]);
      // extracted original entries contain only first and
      // last plurals forms, which identify the entry
      this.addMsgidPlural(entry[1]);
      this.addMsgstrPlural(entry.length);
    }

    return this;
  }
}
