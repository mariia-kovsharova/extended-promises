import '../src';
import { rejectPromise, resolvePromise } from './utils';

describe('Promises External API: Promise.first', () => {
    test('Resolve the main promise with the first fulfilled value from input promises',
        async () => {
            const numericPromises = await Promise.first([
                resolvePromise(1, 500),
                resolvePromise(2, 1000),
                resolvePromise(3, 100),
                resolvePromise(4, 2000),
                resolvePromise(5, 300)
            ]);

            expect(numericPromises).toBe(3);

            const stringPromises = await Promise.first([
                resolvePromise('foo', 1000),
                resolvePromise('baz', 50),
                resolvePromise('bar', 200)
            ]);

            expect(stringPromises).toBe('baz');

            const mixedPromises = await Promise.first<string | number | boolean>([
                resolvePromise('foo', 1000),
                resolvePromise(10, 400),
                resolvePromise(true, 100)
            ]);

            expect(mixedPromises).toBe(true);

            const result4 = await Promise.first([
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
            const singlePromise = Promise.first([
                rejectPromise(12345, 50)
            ]);

            try {
                await singlePromise;
                throw new Error('Should not being here!');
            } catch (e) {
                expect(e).toEqual([12345]);
            }

            const mixedTypesPromises = Promise.first<number | string | boolean>([
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