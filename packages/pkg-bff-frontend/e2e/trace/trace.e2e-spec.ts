import 'jest-extended';

describe('Trace', () => {

  beforeAll(async () => {
    console.trace('-- beforeAll --', Date.now().toLocaleString());
  }, 5 * 60 * 1000);

  it('adds 1 + 2 to equal 3 in TScript', async () => {
    console.trace('-- during test --', Date.now().toLocaleString());
    expect(1 + 2).toBe(3);
  });

  afterAll(async () => {
    console.trace('-- afterAll --', Date.now().toLocaleString());
  });
});
