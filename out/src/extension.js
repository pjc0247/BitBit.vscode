'use strict';
var vscode = require('vscode');
function padZero(len, c) {
    var s = c;
    while (s.length < len)
        s = '0' + s;
    return s;
}
function activate(context) {
    var disposable = vscode.commands.registerCommand('extension.bitbit.replace', function () {
        var editor = vscode.window.activeTextEditor;
        var doc = editor.document;
        var sel = editor.selection.end;
        var selectedRange = new vscode.Range(editor.selection.start, editor.selection.end);
        var selectedText = doc.getText(selectedRange);
        // 이미 존재하는 숫자를 signed 로 재해석
        if (/^\d+$/.test(selectedText)) {
            editor.edit(function (builder) {
                var num = parseInt(selectedText);
                if (num > 127) {
                    num = num - 256;
                }
                builder.replace(selectedRange, num.toString());
            });
            return;
        }
        else {
            var text = doc.offsetAt(sel.translate(0, -10));
            var b8_1 = doc.getText(null).substr(text, 10);
            if (b8_1.startsWith("0b") == false)
                return;
            b8_1 = b8_1.substr(2);
            var len = 0;
            editor.edit(function (builder) {
                var r = new vscode.Selection(sel.line, sel.character, sel.line, sel.character - 10);
                var replaceTo = parseInt(b8_1, 2).toString();
                len = replaceTo.length;
                builder.replace(r, replaceTo);
            }).then(function () {
                sel = editor.selection.end;
                editor.selection = new vscode.Selection(sel.line, sel.character, sel.line, sel.character - len);
            });
        }
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function deactivate() {
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map