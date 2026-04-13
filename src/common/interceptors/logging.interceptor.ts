import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Logger,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const now = Date.now();
    const request = context.switchToHttp().getRequest<{
      method: string;
      url: string;
    }>();

    return next.handle().pipe(
      tap(() => {
        const elapsedMs = Date.now() - now;
        this.logger.log(`${request.method} ${request.url} ${elapsedMs}ms`);
      }),
    );
  }
}
