import { IsString } from 'class-validator';

export class SendReminderToArchiveCommand {
  @IsString()
  public readonly reminderId: string = '';
}
