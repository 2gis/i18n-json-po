"use strict";
exports.__esModule = true;
function makeDate(date) {
    var timezoneShift = date.getTimezoneOffset() / -60;
    var tz = 'Z';
    if (timezoneShift !== 0) {
        tz = (timezoneShift > 0 ? '+' : '-') +
            (timezoneShift > 9 ? '' : '0')
            + timezoneShift + '00';
    }
    return date.getFullYear() + '-' +
        (date.getMonth() > 9 ? '' : '0') + date.getMonth() + '-' +
        (date.getDay() > 9 ? '' : '0') + date.getDay() + ' ' +
        (date.getHours() > 9 ? '' : '0') + date.getHours() + ':' +
        (date.getMinutes() > 9 ? '' : '0') + date.getMinutes() +
        tz;
}
exports.makeDate = makeDate;
function makePoHeader(meta) {
    return "# Translations template for PROJECT.\n# Copyright (C) " + meta.year + " " + meta.copyrightSubject + "\n# This file is distributed under the same license as the PROJECT project.\n# FIRST AUTHOR <EMAIL@ADDRESS>, " + meta.year + ".\n# \n#, fuzzy\nmsgid \"\"\nmsgstr \"\"\n\"Project-Id-Version: PROJECT VERSION\\n\"\n\"Report-Msgid-Bugs-To: " + meta.bugsEmail + "\\n\"\n\"POT-Creation-Date: " + makeDate(new Date()) + "\\n\"\n\"PO-Revision-Date: YEAR-MO-DA HO:MI+ZONE\\n\"\n\"Last-Translator: FULL NAME <EMAIL@ADDRESS>\\n\"\n\"Language-Team: LANGUAGE <LL@li.org>\\n\"\n\"MIME-Version: 1.0\\n\"\n\"Content-Type: text/plain; charset=utf-8\\n\"\n\"Content-Transfer-Encoding: 8bit\\n\"\n\"Generated-By: i18n-json2po\\n\"\n\n";
}
exports.makePoHeader = makePoHeader;
function convert(json, meta, printOccurences) {
    var document = JSON.parse(json);
    var poEntries = [];
    for (var _i = 0, document_1 = document; _i < document_1.length; _i++) {
        var item = document_1[_i];
        var potEntry = new PotEntry();
        if (item.type === 'single') {
            potEntry.parseSingleEntry(item, printOccurences);
        }
        if (item.type === 'plural') {
            potEntry.parsePluralEntry(item, printOccurences);
        }
        poEntries.push(potEntry);
    }
    return makePoHeader(meta) + poEntries
        .map(function (entry) { return entry.asString(); })
        .join("\n\n");
}
exports.convert = convert;
var PotEntry = (function () {
    function PotEntry() {
        var _this = this;
        this.items = [];
        this.addComment = function (comment) { return _this.items.push('#. ' + comment); };
        this.addOccurence = function (occ) { return _this.items.push('#: ' + occ); };
        this.addContext = function (context) { return _this.items.push('msgctxt ' + JSON.stringify(context)); };
        this.addMsgid = function (id) { return _this.items.push('msgid ' + JSON.stringify(id)); };
        this.addMsgidPlural = function (id) { return _this.items.push('msgid_plural ' + JSON.stringify(id)); };
        this.addMsgstr = function () { return _this.items.push('msgstr ""'); };
        this.addMsgstrPlural = function (count) {
            for (var i = 0; i < count; i++) {
                _this.items.push('msgstr[' + i + '] ""');
            }
        };
        this.asString = function () { return _this.items.join("\n"); };
    }
    PotEntry.prototype.parseSingleEntry = function (_a, printOccurences) {
        var entry = _a.entry, comments = _a.comments, occurences = _a.occurences, context = _a.context, type = _a.type;
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
    };
    PotEntry.prototype.parsePluralEntry = function (_a, printOccurences) {
        var entry = _a.entry, comments = _a.comments, occurences = _a.occurences, context = _a.context, type = _a.type;
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
            this.addMsgidPlural(entry[entry.length - 1]);
            this.addMsgstrPlural(entry.length);
        }
    };
    return PotEntry;
}());
exports.PotEntry = PotEntry;
