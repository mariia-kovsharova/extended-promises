if (!Promise.first) {
    Promise.first = function <T>(promises: ReadonlyArray<Promise<T> | PromiseLike<T>>): Promise<T | ReadonlyArray<unknown>> {
        // Top-level main promise
        return new Promise<T>((resolve, reject) => {
            const len = promises.length;
            const reducedPromise = promises.reduce(
                (
                    reasons: Promise<Array<unknown>>,
                    currentPromise: Promise<T> | PromiseLike<T>,
                    index: number,
                ): Promise<Array<unknown>> => {
                    const trustedPromise = Promise.resolve(currentPromise);
                    return trustedPromise
                        /**
                         * If the promise successfully fulfilled, resolve the main promise with
                         * its value
                         */
                        .then((value: T) => {
                            resolve(value);
                            /**
                             * Whatever we resolve the top-level promise,
                             * here we have to return the accumulator without any modification
                             * to avoid typing error
                             */
                            return reasons;
                        })
                        /**
                         * Or add the rejection reason to the array of reasons in main promise
                         * by modifying the reason array
                         */
                        .catch((reason: unknown) => {
                            return reasons.then((previousReasons: Array<unknown>) => {
                                previousReasons[index] = reason;
                                return previousReasons;
                            });
                        });
                },
                Promise.resolve<Array<unknown>>(new Array(len)),
            );

            reducedPromise.then((reasons: ReadonlyArray<unknown>) => {
                /**
                 * If we are here that means all the promises have been rejected
                 * and here we get the accumulated array of reasons
                 */
                reject(reasons);
            });
        });
    };
}

export { };

