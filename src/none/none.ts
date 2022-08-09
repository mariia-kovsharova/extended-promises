if (!Promise.none) {
    Promise.none = function <T>(promises: Array<Promise<T> | PromiseLike<T>>) {
        // Top-level promise
        return new Promise((resolve, reject) => {
            const len = promises.length;

            const reducePromise = promises.reduce(
                (
                    reasons: Promise<Array<unknown>>,
                    promise: Promise<T> | PromiseLike<T>,
                    index: number,
                ): Promise<Array<unknown>> => {
                    const trustedPromise = Promise.resolve(promise);
                    return trustedPromise
                        .then((value: T) => {
                            reject(value);
                            /**
                            * Whatever the main promise is rejected,
                            * here we have to return the accumulator without any modification
                            * to avoid the "undefined" return as accumulator
                            */
                            return reasons;
                        })
                        .catch((reason: unknown) => {
                            return reasons.then((previousReasons: Array<unknown>) => {
                                previousReasons[index] = reason;
                                return previousReasons;
                            });
                        });
                },
                Promise.resolve<Array<unknown>>(new Array(len)),
            );

            reducePromise.then((reasons: Array<unknown>) => {
                resolve(reasons);
            });
        });
    };
}

export { };
