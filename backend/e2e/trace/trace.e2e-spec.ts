import { getLogger } from '@nestjs-bff/backend/lib/shared/logging/logging.shared.module';

describe('Trace', () => {
  const logger = getLogger();

  beforeAll(async () => {
    logger.trace('-- beforeAll --', Date.now().toLocaleString());
  }, 5 * 60 * 1000);

  it('adds 1 + 2 to equal 3 in TScript', async () => {
    logger.trace('-- during test --', Date.now().toLocaleString());
    expect(1 + 2).toBe(3);
  });

  afterAll(async () => {
    logger.trace('-- afterAll --', Date.now().toLocaleString());
  });
});
