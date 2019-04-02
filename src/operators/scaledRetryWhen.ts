import { timer, throwError, Observable, MonoTypeOperatorFunction } from 'rxjs';
import { mergeMap, retryWhen } from 'rxjs/operators';

/**
 * Defines the possible options that can be passed to scaledRetryWhen
 */
export interface RetryParams {
  /**
   * The maximum number of attempts.
   */
  maxAttempts: number;
  /**
   * The scaling factor in milliseconds to be used when calculating the delay between succesive attempts.
   *
   * @description The delay is calculated as follows:
   * delay = attempt * scalingDuration;
   */
  scalingDuration: number;
  /**
   * Function used to decide if after an error the retries should continue or not.
   */
  shouldContinue: (error: unknown) => boolean;
}

/**
 * Returns an Observable that mirrors the source Observable with the exception of an `error`. If the source Observable
 * calls `error`, this method will resubscribe after a scaled delay to the source Observable, if the conditions
 * for doing so are met. In other cases, the Throwable will be raised.
 *
 * @param options
 */
export function scaledRetryWhen<T>(options?: Partial<RetryParams>): MonoTypeOperatorFunction<T> {
  const mergedOptions = new RetryOptions(options || {});
  return (source: Observable<T>) => source.pipe(retryWhen(errors => errors.pipe(mergeMap(retry(mergedOptions)))));
}

const defaultParams: RetryParams = {
  maxAttempts: 3,
  scalingDuration: 1000,
  shouldContinue: () => true
};

class RetryOptions implements RetryParams {
  readonly maxAttempts: number;
  readonly scalingDuration: number;
  readonly shouldContinue: (error: unknown) => boolean;

  constructor(params: Partial<RetryParams>) {
    const { maxAttempts, scalingDuration, shouldContinue: shouldRetry } = { ...defaultParams, ...params };
    if (maxAttempts < 0) {
      throw new Error(`Expected a number greater or equal than zero as max number of attempts, got '${maxAttempts}'`);
    }
    if (scalingDuration < 0) {
      throw new Error(`Expected a number greater or equal than zero as scaling duration, got '${scalingDuration}'`);
    }
    this.maxAttempts = maxAttempts;
    this.scalingDuration = scalingDuration;
    this.shouldContinue = shouldRetry;
  }
}

function retry(options: RetryParams) {
  const { maxAttempts, scalingDuration, shouldContinue: shouldRetry } = options;
  return (error: any, index: number) => {
    const retryAttempt = index + 1;
    if (retryAttempt > maxAttempts || !shouldRetry(error)) {
      return throwError(error);
    }
    return timer(retryAttempt * scalingDuration);
  };
}
