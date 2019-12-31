import memoize from 'memoizerific';
import { px2rem } from './px2rem';

interface IResultReducer {
  emit?: string;
  state?: State;
  skipEmit?: boolean;
}
interface IStateMachineHandler {
  next?: (ch: string) => IResultReducer | void;
  flush?: (last?: boolean) => IResultReducer | void;
}
class StateMachine {
  px: IStateMachineHandler = {};
  [':']: IStateMachineHandler = {};
}
type State = keyof StateMachine;

function isWhitespace(ch: string): boolean {
  return ch == ' ' || ch == '\n' || ch == '\r';
}

function isNumeric(ch: string): boolean {
  return /\d/.test(ch);
}

export const replace = memoize(10)(function(cssText: string): string {
  const stateMachine = new StateMachine();
  let state: State = ':';
  let replaced: string = '';
  const len = cssText.length;
  let pos = 0;

  function apply(reducerResult: IResultReducer, ch?: string): void {
    if (!reducerResult) {
      if (ch) {
        replaced += ch;
      }
    } else {
      if (typeof reducerResult.state !== 'undefined') state = reducerResult.state;
      if (reducerResult.skipEmit) {
      }
    }
  }
  while (pos < len) {
    const ch = cssText[pos++];
    const handler = stateMachine[state];
    const reducerResult = handler.next && handler?.next(ch);
    if (reducerResult) {
      apply(reducerResult, ch);
    }
    // switch (state) {
    //   case ':':
    //     if (ch == ':') {
    //       numeric = '';
    //       raw = '';
    //       state = 'px';
    //     }
    //     break;
    //   case 'px':
    //     if (isNumeric(ch)) {
    //       numeric += ch;
    //     } else if (isWhitespace(ch)) {
    //       if (raw) {
    //         replaced += raw;
    //       }
    //       raw = '';
    //       numeric = '';
    //       break;
    //     } else if (ch == 'x') {
    //       if (numeric) {
    //         replaced += px2rem(numeric);
    //         raw = '';
    //         numeric = '';
    //       }
    //       continue;
    //     }
    //     raw += ch;
    //     continue;
    // }
    // replaced += ch;
  }
  const handler = stateMachine[state];
  if (handler && handler.flush) {
    const reducerResult = handler.flush(true);
    if (reducerResult) {
      apply(reducerResult);
    }
  }
  return replaced;
});
