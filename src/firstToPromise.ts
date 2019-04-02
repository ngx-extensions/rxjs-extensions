import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

/**
 * Creates a promise which resolves into the first value emitted by the source Observable.
 * @param {Observable<T>} source The source Observable
 * @returns {Promise<T>} A promise that resolves into the first value emitted by the source Observable.
 */
export function firstToPromise<T>(source: Observable<T>): Promise<T> {
  return source.pipe(first()).toPromise();
}
