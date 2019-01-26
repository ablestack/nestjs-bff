import { ReminderEntity } from '@yourapp/global/lib/domain/reminder/reminder.entity';

describe('ReminderEntity', () => {
  it('should create an instance', () => {
    expect(new ReminderEntity()).toBeTruthy();
  });

  it('should accept values in the constructor', () => {
    const todo = new ReminderEntity({
      title: 'hello',
      complete: true,
    });
    expect(todo.title).toEqual('hello');
    expect(todo.complete).toEqual(true);
  });
});
