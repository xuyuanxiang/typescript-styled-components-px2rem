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
  [key: string]: any;
}
type State = keyof StateMachine;

function isWhitespace(ch: string): boolean {
  return ch == ' ' || ch == '\n' || ch == '\r';
}

function isNumeric(ch: string): boolean {
  return /\d/.test(ch);
}

class StateMachine {
  private numeric: string = '';
  private raw: string = '';

  px: IStateMachineHandler = {
    next: (ch: string) => {
      if (isNumeric(ch)) {
        this.numeric += ch;
      } else if (isWhitespace(ch)) {
        if (!this.numeric) {
          if (this.raw) {
            const emit = this.raw;
            this.raw = '';
            return { emit, skipEmit: true };
          }
        } else {
          const emit = replace(this.numeric);
          this.numeric = '';
          this.raw = '';
          return { emit: replace(this.numeric), skipEmit: true };
        }
      }
      this.raw += ch;
    },
  };
  [':']: IStateMachineHandler = {
    next: (ch: string) => {
      if (ch === ':') {
        this.raw = '';
        this.numeric = '';
        return { state: 'px' };
      }
    },
  };
}

export const replace = memoize(10)(function(cssText: string, last?: boolean): string {
  const stateMachine = new StateMachine();
  let state: State = ':';
  let replaced: string = '';
  const len = cssText.length;
  let pos = 0;

  function apply(reducerResult?: IResultReducer, ch?: string): void {
    if (!reducerResult) {
      if (ch) replaced += ch;
    } else {
      if (reducerResult.state) state = reducerResult.state;
      if (reducerResult.emit) replaced += reducerResult.emit;
      else if (reducerResult.skipEmit !== true && ch !== undefined) replaced += ch;
    }
  }

  while (pos < len) {
    const ch = cssText[pos++];
    const prevState = state;
    const handler = stateMachine[state];
    const reducerResult = handler.next && handler?.next(ch);
    if (reducerResult) {
      console.log('before apply(', { ch, state: prevState, replaced }, ')');
      apply(reducerResult, ch);
      console.log('after apply(', { reducerResult, state, replaced }, ')');
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
    const reducerResult = handler.flush(last);
    if (reducerResult) {
      apply(reducerResult);
    }
  }
  return replaced;
});
