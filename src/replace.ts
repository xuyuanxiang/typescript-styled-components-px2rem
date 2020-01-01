import postcss from 'postcss';
import memoize from 'memoizerific';
import px2rem from 'postcss-plugin-px2rem';
import scss from 'postcss-scss';
import configuration from './configuration';

const FAKE_OPENING_WRAPPER = 'styled-fake-wrapper/* start of styled-fake-wrapper */{';
const FAKE_CLOSING_WRAPPER = '}/* end of styled-fake-wrapper */';
const PAIR_REG = /[\s\w-]+:[\s\w-]+/;

function replaceWithRetry(cssText: string, retry = 1): string {
  const { tags, multiplier, rootValue, ...others } = configuration.config;
  try {
    const replaced = postcss([px2rem({ ...others, rootValue: rootValue / multiplier })]).process(
      `${FAKE_OPENING_WRAPPER}${cssText}${FAKE_CLOSING_WRAPPER}`,
      {
        syntax: scss,
      },
    ).css;
    return replaced.replace(FAKE_OPENING_WRAPPER, '').replace(FAKE_CLOSING_WRAPPER, '');
  } catch (ignored) {
    if (retry > 0) {
      const results: string[] = [];
      const tokens = cssText.split(';');
      for (let token of tokens) {
        if (PAIR_REG.test(token)) {
          results.push(replaceWithRetry(token, retry - 1));
        } else {
          results.push(token);
        }
      }
      return results.join(';');
    } else {
      return cssText;
    }
  }
}

export const replace = memoize(10)(function(cssText: string): string {
  return replaceWithRetry(cssText);
});
