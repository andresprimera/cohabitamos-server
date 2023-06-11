import { Module } from '@nestjs/common';
import { UsersByUnitService } from './users-by-unit.service';
import { UsersByUnitController } from './users-by-unit.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { UsersByUnitEntity } from 'src/entities/users-by-unit.entity';

@Module({
  imports: [TypegooseModule.forFeature([UsersByUnitEntity])],
  controllers: [UsersByUnitController],
  providers: [UsersByUnitService],
})
export class UsersByUnitModule {}
