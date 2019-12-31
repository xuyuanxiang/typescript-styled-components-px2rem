import { replace } from '../replace';

describe('replace()', () => {
  it('should work', function() {
    expect(
      replace(
        '\n display: block;\n  margin: 0 16px;\n  width: 200px;\n  height: 44px;\n  line-height: 44px;\n  border: 1px solid red;\n  border-radius:8px;\n  padding: 8px 16px 32px 40px;\n  font-size: 14px;\n  transform: translate(100px, 200px);\n',
      ),
    ).toBe(
      '\n display: block;\n  margin: 0 0.32rem;\n  width: 4rem;\n  height: 0.88rem;\n  line-height: 0.88rem;\n  border: 1px solid red;\n  border-radius:0.16rem;\n  padding: 0.16rem 0.32rem 0.64rem 0.8rem;\n  font-size: 0.28rem;\n  transform: translate(2rem, 4rem);\n',
    );
  });
});
