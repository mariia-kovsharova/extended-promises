declare global {
    interface PromiseConstructor {
        /**
         * 
         * @param promises the array of promises to process
         * @returns the array of promises filtered by predicate (if all promises have been fulfilled)
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
