import { R2rqClientPage } from './app.po';

describe('r2rq-client App', function() {
  let page: R2rqClientPage;

  beforeEach(() => {
    page = new R2rqClientPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
