import '../src';
import { IPromiseData, rejectPromise, resolvePromise } from './utils';

describe('Promises External API: Promise.some', () => {
    test('Main promise should be fulfilled with the list of fulfilled promises', async () => {
        const promises: ReadonlyArray<IPromiseData<string>> = [
            { value: 'foo', timeout: 2000 },
            { value: 'bar', timeout: 100 },
            { value: 'baz', timeout: 400 },
            { value: 'foobar', timeout: 1300 },
            { value: 'bazbar', timeout: 600 },
        ];

        const expectedResult = promises.map(({ value }) => value);

        const mapped = promises.map(({ value, timeout }) => resolvePromise(value, timeout));

        const result = await Promise.some(mapped);

        expect(result).toEqual(expectedResult);

        const result2 = await Promise.some([
            rejectPromise(1000, 300),
            resolvePromise(9999, 50),
            rejectPromise(22, 200)
        ]);

        expect(result2).toEqual([null, 9999, null]);

        const result3 = await Promise.some([
            resolvePromise('foo', 1000),
            resolvePromise('bar', 300),
            rejectPromise('baz', 230),
            resolvePromise('foo-bar', 200),
            rejectPromise('nope', 1010),
        ]);

        expect(result3).toEqual(['foo', 'bar', null, 'foo-bar', null])
    });

    test('Main promise should be rejected with the value of first fulfilled promise', async () => {
        const promises = Promise.none<number | string | boolean>([
            rejectPromise(12345, 100),
            rejectPromise(1, 200),
            resolvePromise('baz', 500),
            rejectPromise('foo', 300),
            rejectPromise(true, 400),
            resolvePromise('BOOM', 200)
        ]);

        try {
            await promises;
            throw new Error('Should not being here!');
        } catch (e) {
            expect(e).toBe('BOOM');
        }
    });
});