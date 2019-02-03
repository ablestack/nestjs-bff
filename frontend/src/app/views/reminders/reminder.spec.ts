import { Reminder } from './reminder';

describe('Reminder', () => {
  it('should create an instance', () => {
    expect(new Reminder()).toBeTruthy();
  });

  it('should accept values in the constructor', () => {
    let reminder = new Reminder({
      title: 'hello',
      complete: true,
    });
    expect(reminder.title).toEqual('hello');
    expect(reminder.complete).toEqual(true);
  });
});
