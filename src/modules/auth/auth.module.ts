import { Module } from '@nestjs/common';
import { AuthController } from './presentation/auth.controller';
import { SessionGuard } from '../../shared/infrastructure/auth/guards/session.guard';
import { HandleAuthUseCase } from './application/handle-auth.use-case';
import { IAuthHandler } from './domain/ports/auth-handler.interface';
import { AuthHandlerAdapter } from './infrastructure/auth-handler.adapter';

@Module({
  controllers: [AuthController],
  providers: [
    SessionGuard,
    HandleAuthUseCase,
    {
      provide: IAuthHandler,
      useClass: AuthHandlerAdapter,
    },
  ],
  exports: [SessionGuard],
})
export class AuthModule {}
