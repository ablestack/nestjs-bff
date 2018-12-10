import { browser, element, by } from 'protractor';

export class NestJSBFFPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.tagName('footer')).getText();
  }
}
