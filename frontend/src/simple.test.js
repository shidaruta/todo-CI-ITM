// Very simple tests that don't require any complex setup
describe('Simple Frontend Tests', () => {
  test('basic math works', () => {
    expect(2 + 2).toBe(4);
  });

  test('strings work', () => {
    expect('hello').toBe('hello');
  });

  test('arrays work', () => {
    const arr = [1, 2, 3];
    expect(arr).toHaveLength(3);
    expect(arr[0]).toBe(1);
  });

  test('objects work', () => {
    const obj = { name: 'test', value: 42 };
    expect(obj.name).toBe('test');
    expect(obj.value).toBe(42);
  });

  test('functions work', () => {
    const add = (a, b) => a + b;
    expect(add(1, 2)).toBe(3);
  });
});
