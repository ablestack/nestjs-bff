import { Reminder } from './reminder';

describe('Reminder', () => {
  it('should create an instance', () => {
    expect(new Reminder()).toBeTruthy();
  });

  it('should accept values in the constructor', () => {
    const todo = new Reminder({
      title: 'hello',
      complete: true,
    });
    expect(todo.title).toEqual('hello');
    expect(todo.complete).toEqual(true);
  });
});
