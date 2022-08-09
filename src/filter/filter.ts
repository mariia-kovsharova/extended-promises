if (!Promise.filter) {
    Promise.filter = function <T>(
        promises: ReadonlyArray<Promise<T> | PromiseLike<T>>,
        predicateFunction: (value: T) => boolean,
    ): Promise<ReadonlyArray<T>> {
        return Promise.all(promises)
            .then((values: ReadonlyArray<T>): ReadonlyArray<T> => {
                return values.filter((value: T): boolean => predicateFunction(value));
            });
    };
}

export { };

