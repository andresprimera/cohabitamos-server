import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { UserEntity } from 'src/entities/user.entity';
import { AccountEntity } from 'src/entities/account.entity';

@Module({
  imports: [TypegooseModule.forFeature([UserEntity, AccountEntity])],
  controllers: [AccountsController],
  providers: [AccountsService],
  exports: [AccountsService],
})
export class AccountsModule {}
