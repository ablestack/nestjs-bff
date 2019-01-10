//
// Testing Jest capabilities
//

describe('GIVEN a suite of Jest Tests', () => {
  it(`WHEN using objectContaining, comparing full props/values
    THEN should pass`, async () => {
    expect({ x: 0, y: 0 }).toEqual(
      expect.objectContaining({
        x: expect.any(Number),
        y: expect.any(Number),
      }),
    );
  });

  it(`WHEN using objectContaining, comparing partial props/values
    THEN should pass`, async () => {
    expect({ x: 0, y: 0 }).toEqual(
      expect.objectContaining({
        x: expect.any(Number),
      }),
    );
  });

  it(`WHEN using toMatchObject, comparing full props/values
    THEN should pass`, async () => {
    expect({ x: 0, y: 0 }).toMatchObject({
      x: expect.any(Number),
      y: expect.any(Number),
    });
  });

  it(`WHEN using toMatchObject, comparing partial props/values
    THEN should pass`, async () => {
    expect({ x: 0, y: 0 }).toMatchObject({
      x: expect.any(Number),
    });
  });
});
