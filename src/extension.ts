'use strict';
import * as vscode from 'vscode';

function padZero(len, c){
    var s = c;
    while(s.length < len) s = '0' + s;
    return s;
}
export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.bitbit.replace', () => {
        let editor = vscode.window.activeTextEditor;
        let doc = editor.document;
        let sel = editor.selection.end;

        let selectedRange = new vscode.Range(
                editor.selection.start, editor.selection.end);
        let selectedText = 
            doc.getText(selectedRange);

        // 이미 존재하는 숫자를 signed 로 재해석
        if (/^\d+$/.test(selectedText)){
            editor.edit(builder => {
                let num = parseInt(selectedText);
                
                if (num > 127) { num = num - 256 }
                
                builder.replace(selectedRange, num.toString());
            });

            return;
        }
        // 바이너리 리터럴을 unsigned 로 해석
        else {
            let text = doc.offsetAt(sel.translate(0, -10));
            let b8 = doc.getText(null).substr(text, 10);
            
            if (b8.startsWith("0b") == false)
                return;

            b8 = b8.substr(2);

            var len = 0;
            editor.edit(builder => {
                let r = new vscode.Selection(sel.line, sel.character, sel.line, sel.character-10);
                let replaceTo = parseInt(b8, 2).toString(); 
                len = replaceTo.length;

                builder.replace(r, replaceTo);
            }).then(() => {
                sel = editor.selection.end;

                editor.selection = new vscode.Selection(
                    sel.line, sel.character, sel.line, sel.character-len);
            });
        }
    });

    context.subscriptions.push(disposable);
}
export function deactivate() {
}
