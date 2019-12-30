import * as ts from 'typescript';
import { px2rem } from './px2rem';
import { IPluginConfiguration } from './IPluginConfiguration';

type State = 'px' | ';' | ':';

function isWhitespace(ch: string): boolean {
  return ch == ' ' || ch == '\n' || ch == '\r';
}

function isNumeric(ch: string): boolean {
  return /\d/.test(ch);
}

// function isSymbol(ch: string): boolean {
//   return ch == '$' || ch == '{' || ch == '}';
// }

function replace(cssText: string, options: IPluginConfiguration): string {
  let state: State = ':';
  let replaced: string = '';
  const len = cssText.length;
  let pos = 0;
  let raw = '';
  let numeric = '';
  while (pos < len) {
    const ch = cssText[pos++];
    switch (state) {
      case ':':
        if (ch == ':') {
          numeric = '';
          raw = '';
          state = 'px';
        }
        break;
      case 'px':
        if (isNumeric(ch)) {
          numeric += ch;
        } else if (isWhitespace(ch)) {
          if (raw) {
            replaced += raw;
          }
          raw = '';
          numeric = '';
          break;
        } else if (ch == 'x') {
          if (numeric) {
            replaced += px2rem(numeric, options);
            raw = '';
            numeric = '';
          }
          continue;
        }
        raw += ch;
        continue;
    }
    replaced += ch;
  }
  return replaced;
}

export function transform(template: ts.TemplateLiteral, options: IPluginConfiguration): ts.TemplateLiteral {
  if (ts.isNoSubstitutionTemplateLiteral(template)) {
    return ts.createNoSubstitutionTemplateLiteral(replace(template.text, options));
  }
  return template;
}
