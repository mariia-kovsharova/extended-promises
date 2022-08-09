import '../src';
import { rejectPromise, resolvePromise } from './utils';

describe('Promises External API: Promise.last', () => {
    test('Resolve the main promise with the last fulfilled value from input promises',
        async () => {
            const numericPromises = await Promise.last([
                resolvePromise(1, 500),
                resolvePromise(2, 1000),
                resolvePromise(3, 100),
                resolvePromise(4, 2000),
                resolvePromise(5, 300)
            ]);

            expect(numericPromises).toBe(4);

            const stringPromises = await Promise.last([
                resolvePromise('foo', 1000),
                resolvePromise('baz', 50),
                resolvePromise('bar', 200)
            ]);

            expect(stringPromises).toBe('foo');

            const mixedPromises = await Promise.last<string | number | boolean>([
                resolvePromise('foobar', 1000),
                resolvePromise(10, 400),
                resolvePromise(true, 100)
            ]);

            expect(mixedPromises).toBe('foobar');

            const result4 = await Promise.last([
                rejectPromise(1, 100),
                rejectPromise(2, 200),
                rejectPromise(3, 300),
                resolvePromise(4, 400),
                rejectPromise(5, 500)
            ]);

            expect(result4).toBe(4);
        });

    test('Reject the main promise with the array of rejection reasons from input promises',
        async () => {
            const singlePromise = Promise.last([
                rejectPromise(12345, 50)
            ]);

            try {
                await singlePromise;
                throw new Error('Should not being here!');
            } catch (e) {
                expect(e).toEqual([12345]);
            }

            const mixedTypesPromises = Promise.last<number | string | boolean>([
                rejectPromise(12345, 2000),
                rejectPromise(1, 200),
                rejectPromise('foo', 300),
                rejectPromise(true, 800)
            ]);

            try {
                await mixedTypesPromises;
                throw new Error('Should not being here!');
            } catch (e) {
                expect(e).toEqual([12345, 1, 'foo', true]);
            }
        });
});