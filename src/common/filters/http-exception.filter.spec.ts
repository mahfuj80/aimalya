import { ArgumentsHost, HttpStatus, NotFoundException } from '@nestjs/common';
import { HttpExceptionFilter } from './http-exception.filter';

describe('HttpExceptionFilter', () => {
  let filter: HttpExceptionFilter;

  beforeEach(() => {
    filter = new HttpExceptionFilter();
  });

  type MockResponse = {
    status: jest.MockedFunction<(statusCode: number) => MockResponse>;
    json: jest.MockedFunction<(body: unknown) => void>;
  };

  const createHost = (
    method: string,
    url: string,
  ): { host: ArgumentsHost; response: MockResponse } => {
    const response = {
      status: jest.fn<(statusCode: number) => MockResponse>(),
      json: jest.fn<(body: unknown) => void>(),
    } as MockResponse;
    response.status.mockImplementation(() => response);

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
    const { host, response } = createHost('GET', '/missing');
    const exception = new NotFoundException('Cannot GET /missing');

    filter.catch(exception, host);
    expect(response.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    const [firstPayload] = response.json.mock.calls[0] ?? [];
    expect(firstPayload).toMatchObject({
      statusCode: HttpStatus.NOT_FOUND,
      message: 'Cannot GET /missing',
      path: '/missing',
    });
    expect((firstPayload as { timestamp: unknown }).timestamp).toEqual(
      expect.any(String),
    );
  });

  it('logs 5xx as error and returns internal server error payload', () => {
    const { host, response } = createHost('POST', '/api/v1/users');
    const exception = new Error('Database down');

    filter.catch(exception, host);
    expect(response.status).toHaveBeenCalledWith(
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    const [secondPayload] = response.json.mock.calls[0] ?? [];
    expect(secondPayload).toMatchObject({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
      path: '/api/v1/users',
    });
    expect((secondPayload as { timestamp: unknown }).timestamp).toEqual(
      expect.any(String),
    );
  });
});
