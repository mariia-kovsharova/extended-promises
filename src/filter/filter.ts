declare global {
    interface PromiseConstructor {
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
    }
}

if (!Promise.filter) {
    Promise.filter = function <T>(
        promises: ReadonlyArray<Promise<T> | PromiseLike<T>>,
        predicateFunction: (value: T) => boolean
    ): Promise<ReadonlyArray<T>> {
        return Promise.all(promises)
            .then((values: ReadonlyArray<T>): ReadonlyArray<T> => {
                return values.filter((value: T): boolean => predicateFunction(value))
            });
    }
}

export default global;
