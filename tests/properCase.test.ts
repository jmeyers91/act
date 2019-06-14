import capitalizeStart from '../src/utils/capitalizeStart';

describe('capitalizeStart', () => {
  test('Should capitalize the first letter of a string', () => {
    expect(capitalizeStart('hello world')).toEqual('Hello world');
  });

  test('Should do nothing to blank strings', () => {
    expect(capitalizeStart('')).toEqual('');
  });
});