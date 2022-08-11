export { };

declare global {
    interface Promise<T> {
        /**
          * @description an equivalent of Promise.all
          * @param promises an array of promises to process
          * @returns 
          * * a fulfilled promise with a result array of the promises in the same order, if every promise was fulfilled
          * * a rejected promise with the reason for the first rejected promise
          */
        every<T>(promises: ReadonlyArray<Promise<T> | PromiseLike<T>>): Promise<ReadonlyArray<T> | unknown>;

        /**
         * 
         * @param promises an array of promises to process
         * @param predicateFunction a predicate function
         * @returns 
         *  * a fulfilled promise with an array of filtered promises, if all the promises were fulfilled
         *  * a rejected promise with the reason for the first rejected promise
         */
        filter<T>(
            promises: ReadonlyArray<Promise<T> | PromiseLike<T>>,
            predicateFunction: (value: T) => boolean
        ): Promise<ReadonlyArray<T>>;

        /**
         * 
         * @param promises an array of promises to process
         * @returns 
         * * a fulfilled promise with the result of the first fulfilled promise
         * * a rejected promise with an array of reasons, if all the promises were rejected
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
         * @param promises an array of promises to process
         * @param transformFunction a transformation function
         * @returns 
         *  * a fulfilled promise with an array of transformed promises, if all the promises have been fulfilled
         *  * a rejected promise with the reason for the first rejected promise
         */
        map<T, R>(
            promises: ReadonlyArray<Promise<T> | PromiseLike<T>>,
            transformFunction: (value: T) => R
        ): Promise<ReadonlyArray<R>>;

        /**
         * 
         * @param promises the array of promises to process
         * @returns 
         * * a fulfilled promise with an array that contains reasons in the same order, if all the promises were rejected
         * * a rejected promise, if at least one of the promises was fulfilled
         */
        none<T>(promises: ReadonlyArray<Promise<T> | PromiseLike<T>>): Promise<ReadonlyArray<unknown> | T>;

        /**
        * 
        * @param promises the array of promises to process
        * @returns 
        * * a fulfilled promise with an array that contains the result or null value of the promises in the same order, if at least one of the promises was fulfilled
        * * a rejected promise, if all the promises were rejected
        */
        some<T>(promises: ReadonlyArray<Promise<T> | PromiseLike<T>>): Promise<ReadonlyArray<T | null> | unknown>;
    }

    var Promise: PromiseConstructor;
}

