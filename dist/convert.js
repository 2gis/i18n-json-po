"use strict";
exports.__esModule = true;
function getTzOffset(date) {
    var timezoneShift = date.getTimezoneOffset() / -60;
    var tz = 'Z';
    if (timezoneShift !== 0) {
        tz = (timezoneShift > 0 ? '+' : '-') +
            (timezoneShift > 9 ? '' : '0')
            + timezoneShift + '00';
    }
    return tz;
}
exports.getTzOffset = getTzOffset;
function makeDate(date) {
    return date.getFullYear() + '-' +
        ((date.getMonth() + 1) > 9 ? '' : '0') + (date.getMonth() + 1) + '-' +
        (date.getDate() > 9 ? '' : '0') + date.getDate() + ' ' +
        (date.getHours() > 9 ? '' : '0') + date.getHours() + ':' +
        (date.getMinutes() > 9 ? '' : '0') + date.getMinutes() +
        getTzOffset(date);
}
exports.makeDate = makeDate;
function makePoHeader(_a) {
    var meta = _a.meta, initialMeta = _a.initialMeta, genDate = _a.genDate, hasPluralForms = _a.hasPluralForms;
    if (!meta) {
        // make POT, use initial meta
        return "# Translations template for PROJECT.\n# Copyright (C) " + initialMeta.year + " " + initialMeta.copyrightSubject + "\n# This file is distributed under the same license as the PROJECT project.\n# FIRST AUTHOR <EMAIL@ADDRESS>, " + initialMeta.year + ".\n# \n#, fuzzy\nmsgid \"\"\nmsgstr \"\"\n\"Project-Id-Version: PROJECT VERSION\\n\"\n\"Report-Msgid-Bugs-To: " + initialMeta.bugsEmail + "\\n\"\n\"POT-Creation-Date: " + genDate + "\\n\"\n\"PO-Revision-Date: YEAR-MO-DA HO:MI+ZONE\\n\"\n\"Last-Translator: FULL NAME <EMAIL@ADDRESS>\\n\"\n\"Language-Team: LANGUAGE <LL@li.org>\\n\"\n\"MIME-Version: 1.0\\n\"\n\"Content-Type: text/plain; charset=utf-8\\n\"\n\"Content-Transfer-Encoding: 8bit\\n\"\n\"Generated-By: i18n-json2po\\n\"\n\n";
    }
    else {
        // have meta - make po!
        var headers = {
            projectIdVersion: function (v) { return "Project-Id-Version: " + v + "\n"; },
            reportMsgidBugsTo: function (v) { return "Report-Msgid-Bugs-To: " + v + "\n"; },
            potCreationDate: function (v) { return "POT-Creation-Date: " + v + "\n"; },
            poRevisionDate: function (v) { return "PO-Revision-Date: " + v + "\n"; },
            lastTranslator: function (v) { return "Last-Translator: " + v.name + " <" + v.email + ">\n"; },
            languageTeam: function (v) { return "Language-Team: " + v + "\n"; },
            mimeVersion: function (v) { return "MIME-Version: " + v + "\n"; },
            contentType: function (v) { return "Content-Type: " + v + "\n"; },
            contentTransferEncoding: function (v) { return "Content-Transfer-Encoding: " + v + "\n"; },
            generatedBy: function (v) { return "Generated-By: " + v + "\n"; },
            language: function (v) { return "Language: " + v + "\n"; },
            pluralForms: function (v) { return "Plural-Forms: " + v + "\n"; }
        };
        var items = [
            'msgid ""',
            'msgstr ""',
        ];
        var pluralFormsHeaderFound = false;
        for (var name_1 in meta) {
            if (name_1 === 'pluralForms') {
                pluralFormsHeaderFound = true;
            }
            items.push(JSON.stringify(headers[name_1](meta[name_1])));
        }
        if (hasPluralForms && !pluralFormsHeaderFound) {
            throw new Error('Translation has some plural forms, but Plural-Forms header was not found');
        }
        return items.join("\n") + "\n\n"; // additional CRLFs to separated header
    }
}
exports.makePoHeader = makePoHeader;
function convert(json, initialMeta, printOccurences) {
    var document = JSON.parse(json);
    var poEntries = [];
    var hasPluralForms = false;
    for (var _i = 0, _a = document.items; _i < _a.length; _i++) {
        var item = _a[_i];
        var potEntry = new PotEntry();
        if (item.type === 'single') {
            potEntry.parseSingleEntry(item, printOccurences, !!document.meta);
        }
        if (item.type === 'plural') {
            potEntry.parsePluralEntry(item, printOccurences, !!document.meta);
            hasPluralForms = true;
        }
        poEntries.push(potEntry);
    }
    return makePoHeader({
        meta: document.meta,
        initialMeta: initialMeta,
        genDate: makeDate(new Date()),
        hasPluralForms: hasPluralForms
    }) + poEntries.map(function (entry) { return entry.asString(); }).join("\n\n");
}
exports.convert = convert;
var PotEntry = (function () {
    function PotEntry() {
        var _this = this;
        this.addComment = function (comment) { return _this.items.push('#. ' + comment); };
        this.addOccurence = function (occ) { return _this.items.push('#: ' + occ); };
        this.addContext = function (context) { return _this.items.push('msgctxt ' + JSON.stringify(context)); };
        this.addMsgid = function (id) { return _this.items.push('msgid ' + JSON.stringify(id)); };
        this.addMsgidPlural = function (id) { return _this.items.push('msgid_plural ' + JSON.stringify(id)); };
        this.addMsgstr = function (translation) {
            if (translation === void 0) { translation = ''; }
            return _this.items.push('msgstr ' + JSON.stringify(translation));
        };
        this.addMsgstrPlural = function (translations) {
            if (!translations.length) {
                _this.items.push('msgstr[0] ""');
                _this.items.push('msgstr[1] ""');
            }
            else {
                translations.forEach(function (val, index) { return _this.items.push('msgstr[' + index + '] ' + JSON.stringify(val)); });
            }
        };
        this.asString = function () { return _this.items.join("\n"); };
    }
    PotEntry.prototype.parseSingleEntry = function (_a, printOccurences, includeTranslations) {
        var entry = _a.entry, comments = _a.comments, occurences = _a.occurences, context = _a.context, type = _a.type, translation = _a.translation;
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
        this.addMsgid(entry);
        this.addMsgstr(includeTranslations ? translation : '');
        return this;
    };
    PotEntry.prototype.parsePluralEntry = function (_a, printOccurences, includeTranslations) {
        var entry = _a.entry, comments = _a.comments, occurences = _a.occurences, context = _a.context, type = _a.type, translations = _a.translations;
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
        this.addMsgid(entry[0]);
        // extracted original entries contain only first and
        // last plurals forms, which identify the entry
        this.addMsgidPlural(entry[1]);
        this.addMsgstrPlural(includeTranslations ? translations : []);
        return this;
    };
    return PotEntry;
}());
exports.PotEntry = PotEntry;
