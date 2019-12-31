import * as ts from 'typescript';
import memoize from 'memoizerific';
import { px2rem } from './px2rem';

type State = 'px' | ';' | ':';

function isWhitespace(ch: string): boolean {
  return ch == ' ' || ch == '\n' || ch == '\r';
}

function isNumeric(ch: string): boolean {
  return /\d/.test(ch);
}

const replace = memoize(10)(function(cssText: string): string {
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
            replaced += px2rem(numeric);
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
});

export function transform(template: ts.TemplateLiteral): ts.TemplateLiteral {
  if (ts.isNoSubstitutionTemplateLiteral(template)) {
    return ts.createNoSubstitutionTemplateLiteral(replace(template.text));
  } else if (ts.isTemplateExpression(template)) {
    return ts.createTemplateExpression(
      ts.createTemplateHead(replace(template.head.text)),
      template.templateSpans.map(span => {
        if (ts.isTemplateTail(span.literal)) {
          return ts.createTemplateSpan(span.expression, ts.createTemplateTail(replace(span.literal.text)));
        } else if (ts.isTemplateMiddle(span.literal)) {
          return ts.createTemplateSpan(span.expression, ts.createTemplateMiddle(replace(span.literal.text)));
        }
        return span;
      }),
    );
  }
  return template;
}
