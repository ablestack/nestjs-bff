import { Angular2MaterialDashboardProPage } from './app.po';

describe('angular2-material-dashboard-pro App', () => {
  let page: Angular2MaterialDashboardProPage;

  beforeEach(() => {
    page = new Angular2MaterialDashboardProPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
