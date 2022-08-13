import '../src';
import { IPromiseData, rejectPromise, resolvePromise } from './utils';

describe('Promises External API: Promise.some', () => {
    it('Main promise should be fulfilled with the single promise result (a plain promise)', async () => {
        const data: IPromiseData<string> = { value: 'hello', timeout: 700 };
        const result = await Promise.timeout(
            resolvePromise(data.value, data.timeout),
            1000
        );

        expect(result).toBe(data.value);
    });

    it('Main promise should be rejected with the single promise timeout (a plain promise)', async () => {
        const data: IPromiseData<string> = { value: 'hello', timeout: 700 };
        const result = Promise.timeout(
            resolvePromise(data.value, data.timeout),
            300
        );

        try {
            await result;
            throw new Error('Should not be here!');
        } catch (err) {
            expect(err).toBe('Error: timeout!');
        }
    });

    it('Main promise should be fulfilled with the single promise result (Promise.last)', async () => {
        const promiseLast = Promise.last([
            resolvePromise(1, 500),
            resolvePromise(2, 800),
            resolvePromise(3, 100),
            resolvePromise(4, 900),
            resolvePromise(5, 300)
        ]);

        const result = await Promise.timeout(promiseLast, 1000);

        expect(result).toBe(4);
    });

    it('Main promise should be rejected with the single promise timeout (Promise.last)', async () => {
        const promiseLast = Promise.last([
            resolvePromise(1, 500),
            resolvePromise(2, 800),
            resolvePromise(3, 100),
            resolvePromise(4, 900),
            resolvePromise(5, 300)
        ]);

        const result = Promise.timeout(promiseLast, 600);

        try {
            await result;
            throw new Error('Should not be here!');
        } catch (err) {
            expect(err).toBe('Error: timeout!');
        }
    });

    it('Main promise should be fulfilled with the single promise result (Promise.map)', async () => {
        const mappedPromises = Promise.map([
            resolvePromise(1, 500),
            resolvePromise(2, 800),
            resolvePromise(3, 100),
            resolvePromise(4, 900),
            resolvePromise(5, 300)
        ], (value: number) => value * 2);

        const result = await Promise.timeout(mappedPromises, 1000);

        expect(result).toEqual([2, 4, 6, 8, 10]);
    });

    it('Main promise should be rejected with the single promise timeout (Promise.map)', async () => {
        const mappedPromises = Promise.map([
            resolvePromise(1, 500),
            resolvePromise(2, 800),
            resolvePromise(3, 100),
            resolvePromise(4, 900),
            resolvePromise(5, 300)
        ], (value: number) => value * 2);

        const result = Promise.timeout(mappedPromises, 500);

        try {
            await result;
            throw new Error('Should not be here!');
        } catch (err) {
            expect(err).toBe('Error: timeout!');
        }
    });

    it('Main promise should be fulfilled with the array promise result (plain promises)', async () => {
        const promises = [
            resolvePromise(1, 500),
            rejectPromise(2, 800),
            resolvePromise(3, 100),
            rejectPromise(4, 900),
            resolvePromise(5, 300)
        ];

        const result = await Promise.timeout(promises, 1000);

        expect(result).toEqual([1, null, 3, null, 5]);
    });

    it('Main promise should be rejected with the array promise timeout (plain promises)', async () => {
        const promises = [
            resolvePromise(1, 500),
            rejectPromise(2, 800),
            resolvePromise(3, 100),
            rejectPromise(4, 900),
            resolvePromise(5, 300)
        ];

        const result = Promise.timeout(promises, 500);

        try {
            await result;
            throw new Error('Should not be here!');
        } catch (err) {
            expect(err).toBe('Error: timeout!');
        }
    });

    it('Main promise should be fulfilled with the rejection reason as result (plain promises, all are rejected)', async () => {
        const promises = [
            rejectPromise(1, 500),
            rejectPromise(2, 800),
            rejectPromise(3, 100),
            rejectPromise(4, 900),
            rejectPromise(5, 300)
        ];

        const result = await Promise.timeout(promises, 1000);

        // Promise.timeout uses the Promise.some method. So if none of the promises is fulfilled,
        // it returns null as result
        expect(result).toBe(null);
    });

    it('Main promise should be fulfilled with the timeout (plain promises, all are rejected)', async () => {
        const promises = [
            rejectPromise(1, 500),
            rejectPromise(2, 800),
            rejectPromise(3, 100),
            rejectPromise(4, 900),
            rejectPromise(5, 300)
        ];

        const result = Promise.timeout(promises, 500);

        try {
            await result;
            throw new Error('Should not be here!');
        } catch (err) {
            expect(err).toBe('Error: timeout!');
        }
    });
})