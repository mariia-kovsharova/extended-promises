import '../src/none/none';
import { IPromiseData, rejectPromise, resolvePromise } from './utils';

describe('Promise None', () => {
    test('Main promise should be fulfilled with the list of rejection reasons', async () => {
        const reasons: ReadonlyArray<IPromiseData<string>> = [
            { value: 'foo', timeout: 2000 },
            { value: 'bar', timeout: 100 },
            { value: 'baz', timeout: 400 },
            { value: 'foobar', timeout: 1300 },
            { value: 'bazbar', timeout: 600 },
        ];

        const expectedResult = reasons.map(({ value }) => value);

        const promises = reasons.map(({ value, timeout }) => rejectPromise(value, timeout));

        const result = await Promise.none(promises);

        expect(result).toEqual(expectedResult);

        const result2 = await Promise.none([
            rejectPromise(1000, 300),
            rejectPromise(9999, 50),
            rejectPromise(22, 200)
        ]);

        expect(result2).toEqual([1000, 9999, 22]);
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