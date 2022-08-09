import '../src';
import { IPromiseData, rejectPromise, resolvePromise } from './utils';

describe('Promises External API: Promise.map', () => {
    test('Resolve the main promise with the array of fulfilled values of input promises, which have been modified with map fn',
        async () => {
            const numericData: ReadonlyArray<IPromiseData<number>> = [
                { value: 1, timeout: 1000 },
                { value: 2, timeout: 2000 },
                { value: 3, timeout: 100 },
                { value: 4, timeout: 800 },
                { value: 5, timeout: 300 },
            ];

            const stringData: ReadonlyArray<IPromiseData<string>> = [
                { value: 'foo', timeout: 1000 },
                { value: 'bar', timeout: 100 },
                { value: 'baz', timeout: 400 },
                { value: 'foobar', timeout: 1300 },
                { value: 'bazbar', timeout: 600 },
            ];

            const numericMapper = (n: number): number => n * 2;
            const stringMapper = (s: string): number => s.length;

            const expectedNumericResult = numericData.map(({ value }) => value).map(numericMapper);
            const expectedStringResult = stringData.map(({ value }) => value).map(stringMapper);

            const numericPromises = numericData.map(({ value, timeout }) => resolvePromise(value, timeout));
            const numericResult = await Promise.map(numericPromises, numericMapper);

            expect(numericResult).toEqual(expectedNumericResult);

            const stringPromises = stringData.map(({ value, timeout }) => resolvePromise(value, timeout));
            const stringResult = await Promise.map(stringPromises, stringMapper);

            expect(stringResult).toEqual(expectedStringResult);
        });

    test('Reject the main promise with the reason of the first rejected input promise',
        async () => {
            const processed = Promise.map([
                resolvePromise('foo', 300),
                resolvePromise('bar', 400),
                rejectPromise('NOPE', 100),
                resolvePromise('baz', 50)
            ], (str: string): string => str.toUpperCase());

            try {
                await processed;
                throw new Error('Should not being here!');
            } catch (reason) {
                expect(reason).toBe('NOPE');
            }
        });
})