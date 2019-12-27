import { foo } from '../index';

it('should work', function() {
  expect(foo()).toBe('body {\n' + '  margin: 0.32rem;\n' + '}');
});
