if (!Promise.map) {
    Promise.map = function <T, R>(
        promises: ReadonlyArray<Promise<T> | PromiseLike<T>>,
        transformFunction: (value: T) => R,
    ): Promise<ReadonlyArray<R>> {
        return Promise.all(promises)
            .then((values: ReadonlyArray<T>): ReadonlyArray<R> => {
                return values.map((value: T): R => transformFunction(value));
            });
    };
}

export { };
