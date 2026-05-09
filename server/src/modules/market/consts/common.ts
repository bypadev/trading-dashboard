import { ErrorCode } from '../ts/enum';

export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  [ErrorCode.INVALID_JSON]: 'Invalid JSON',
  [ErrorCode.INVALID_MESSAGE_FORMAT]: 'Invalid message format',
  [ErrorCode.SUBSCRIBE_NOT_SUPPORTED]:
    'SUBSCRIBE not supported — all tickers are streamed automatically',
  [ErrorCode.UNAUTHORIZED]: 'You are not authorized',
  [ErrorCode.UNKNOWN_ERROR]: 'Something went wrong',
};

export const tickerNotFoundMsg = (ticker: string) => `Ticker "${ticker}" not found`;

export const VOLATILITY = 0.002;