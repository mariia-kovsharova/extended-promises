export { };

declare global {
    interface PromiseConstructor {
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
    }
}

if (!Promise.map) {
    Promise.map = function <T, R>(
        promises: ReadonlyArray<Promise<T> | PromiseLike<T>>,
        transformFunction: (value: T) => R
    ): Promise<ReadonlyArray<R>> {
        return Promise.all(promises)
            .then((values: ReadonlyArray<T>): ReadonlyArray<R> => {
                return values.map((value: T): R => transformFunction(value))
            });
    }
}
