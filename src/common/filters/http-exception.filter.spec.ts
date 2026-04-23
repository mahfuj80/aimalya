import {
  ArgumentsHost,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { HttpExceptionFilter } from './http-exception.filter';

describe('HttpExceptionFilter', () => {
  let filter: HttpExceptionFilter;

  beforeEach(() => {
    filter = new HttpExceptionFilter();
  });

  const createHost = (method: string, url: string) => {
    const response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const request = { method, url };

    const host = {
      switchToHttp: () => ({
        getResponse: () => response,
        getRequest: () => request,
      }),
    } as unknown as ArgumentsHost;

    return { host, response };
  };

  it('logs 4xx as warn and returns the http exception payload', () => {
    const warnSpy = jest
      .spyOn((filter as { logger: { warn: (...args: unknown[]) => void } }).logger, 'warn')
      .mockImplementation(() => undefined);
    const errorSpy = jest
      .spyOn((filter as { logger: { error: (...args: unknown[]) => void } }).logger, 'error')
      .mockImplementation(() => undefined);

    const { host, response } = createHost('GET', '/missing');
    const exception = new NotFoundException('Cannot GET /missing');

    filter.catch(exception, host);

    expect(warnSpy).toHaveBeenCalledWith(
      'GET /missing -> 404 Cannot GET /missing',
    );
    expect(errorSpy).not.toHaveBeenCalled();
    expect(response.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(response.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.NOT_FOUND,
      message: 'Cannot GET /missing',
      path: '/missing',
      timestamp: expect.any(String),
    });
  });

  it('logs 5xx as error and returns internal server error payload', () => {
    const warnSpy = jest
      .spyOn((filter as { logger: { warn: (...args: unknown[]) => void } }).logger, 'warn')
      .mockImplementation(() => undefined);
    const errorSpy = jest
      .spyOn((filter as { logger: { error: (...args: unknown[]) => void } }).logger, 'error')
      .mockImplementation(() => undefined);

    const { host, response } = createHost('POST', '/api/v1/users');
    const exception = new Error('Database down');

    filter.catch(exception, host);

    expect(errorSpy).toHaveBeenCalledWith(
      'POST /api/v1/users -> 500 Internal server error',
      exception.stack,
    );
    expect(warnSpy).not.toHaveBeenCalled();
    expect(response.status).toHaveBeenCalledWith(
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    expect(response.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
      path: '/api/v1/users',
      timestamp: expect.any(String),
    });
  });
});
