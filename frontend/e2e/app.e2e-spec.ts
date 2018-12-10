import { NestJSBFFPage } from './app.po';

describe('NestJS-BFF App', function() {
  let page: NestJSBFFPage;

  beforeEach(() => {
    page = new NestJSBFFPage();
  });

  it('should display footer containing NestJS-BFF', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toContain('NestJS-BFF');
  });
});
