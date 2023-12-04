import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { Firebase } from 'src/providers/firebase';

@Module({
  providers: [NotificationsService, Firebase],
})
export class NotificationsModule {}
