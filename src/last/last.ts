if (!Promise.last) {
    Promise.last = function <T>(promises: ReadonlyArray<Promise<T> | PromiseLike<T>>): Promise<T | ReadonlyArray<unknown>> {
        // Top-level main promise
        return new Promise<T>((resolve, reject) => {
            const len = promises.length;
            let rejectedCount = 0;

            let lastFulfilledValue: T;

            const reducedPromise = promises.reduce(
                (
                    reasons: Promise<Array<unknown>>,
                    currentPromise: Promise<T> | PromiseLike<T>,
                    index: number,
                ): Promise<Array<unknown>> => {
                    const trustedPromise = Promise.resolve(currentPromise);
                    return trustedPromise
                        /**
                         * If current promise is fulfilled, we update the last fulfilled value
                         * and increase the counter for fulfilled promises
                         */
                        .then((value: T) => {
                            lastFulfilledValue = value;

                            /**
                             * Whatever the promise is fulfilled,
                             * here we have to return the accumulator without any modification
                             * to avoid the "undefined" promise return as accumulator instead list of reasons
                             */
                            return reasons;
                        })
                        /**
                         * Or we just update the reason array with the reject reason
                         */
                        .catch((reason: unknown) => {
                            rejectedCount += 1;

                            return reasons.then((previousReasons: Array<unknown>) => {
                                previousReasons[index] = reason;
                                return previousReasons;
                            });
                        });
                },
                Promise.resolve<Array<unknown>>(new Array(len)),
            );

            reducedPromise.then((reasons: ReadonlyArray<unknown>) => {
                if (rejectedCount === len) {
                    reject(reasons);
                } else {
                    resolve(lastFulfilledValue);
                }
            });
        });
    };
}

export { };
