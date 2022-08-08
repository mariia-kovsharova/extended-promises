declare global {
    interface PromiseConstructor {
        /**
         * @description equivalent of Promise.all
         * @param promises the array of promises to process
         * @returns 
         * * fulfilled promise with the array of results of promises in the same order, if every promise has been fulfilled
         * * rejected promise with the reason of the first rejected promise
         */
        every<T>(promises: ReadonlyArray<Promise<T> | PromiseLike<T>>): Promise<ReadonlyArray<T> | unknown>;

        /**
         * 
         * @param promises the array of promises to process
         * @returns the array of filtered promises if all promises have been fulfilled
         */
        filter<T>(
            promises: ReadonlyArray<Promise<T> | PromiseLike<T>>,
            predicateFunction: (value: T) => boolean
        ): Promise<ReadonlyArray<T>>;

        /**
         * 
         * @param promises the array of promises to process
         * @returns 
         * * fulfilled promise with the result of the first fulfilled promise
         * * rejected promise with an array of reasons for all rejected promises
         * in the same order, if every promise has been
         */
        first<T>(promises: ReadonlyArray<Promise<T> | PromiseLike<T>>): Promise<T | ReadonlyArray<unknown>>;

        /**
         * 
         * @param promises the array of promises to process
         * @returns 
         * * fulfilled promise with the result of the last fulfilled promise 
         * * rejected promise with an array of reasons for all rejected promises
         * in the same order, if every promise has been rejected
         */
        last<T>(promises: ReadonlyArray<Promise<T> | PromiseLike<T>>): Promise<T | ReadonlyArray<unknown>>;

        /**
         * 
         * @param promises the array of promises to process
         * @returns 
         * * the array of transformed promises if all promises have been fulfilled
         */
        map<T, R>(
            promises: ReadonlyArray<Promise<T> | PromiseLike<T>>,
            transformFunction: (value: T) => R
        ): Promise<ReadonlyArray<R>>;

        /**
         * 
         * @param promises the array of promises to process
         * @returns 
         * * fulfilled promise with the array of reasons of promises in the same order, if every promise has been rejected
         * * rejected promise with the value of the first fulfilled promise
         */
        none<T>(promises: ReadonlyArray<Promise<T> | PromiseLike<T>>): Promise<ReadonlyArray<unknown> | T>;

        /**
        * 
        * @param promises the array of promises to process
        * @returns 
        * * fulfilled promise with the array of result of promise or null (if promise has been rejected) in the same order, if one of promises has been fulfilled
        * * rejected promise if all the promises have been rejected
        */
        some<T>(promises: ReadonlyArray<Promise<T> | PromiseLike<T>>): Promise<ReadonlyArray<T | null> | unknown>;
    }
}

export default global;