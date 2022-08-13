declare global {
    interface PromiseConstructor {
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
        some<T>(promises: ReadonlyArray<Promise<T> | PromiseLike<T>>): Promise<ReadonlyArray<T | null> | null>;
        /**
        * 
        * @param promise the single promise or the array of promises to process
        * @returns 
        * * a fulfilled promise with the result OR the rejection reason of the promise (promises)
        * * a rejected promise, if the timeout completes first
        */
        timeout<T>(promise: Promise<T> | PromiseLike<T> | ReadonlyArray<Promise<T> | PromiseLike<T>>, timeout: number): Promise<T | ReadonlyArray<T | null> | null | unknown | string>;
    }
}

if (!Promise.every) {
    Promise.every = function <T>(promises: ReadonlyArray<Promise<T> | PromiseLike<T>>): Promise<ReadonlyArray<T> | unknown> {
        // Top-level main promise
        return new Promise<ReadonlyArray<T>>((resolve, reject) => {
            const len = promises.length;
            const reducedPromise = promises.reduce(
                (
                    fulfilledPromises: Promise<Array<T>>,
                    currentPromise: Promise<T> | PromiseLike<T>,
                    index: number,
                ): Promise<Array<T>> => {
                    const trustedPromise = Promise.resolve(currentPromise);
                    return trustedPromise
                        /**
                         * If the promise successfully fulfilled, add its result to fulfilled array
                         */
                        .then((value: T) => {
                            return fulfilledPromises.then((previousFulfilledArray: Array<T>) => {
                                previousFulfilledArray[index] = value;
                                return previousFulfilledArray;
                            });
                        })
                        /**
                         * Or reject main promise with the reason
                         */
                        .catch((reason: unknown) => {
                            reject(reason);
                            /**
                             * Nevertheless we have to return fulfilled array not modified
                             * to avoid reduce error
                             */
                            return fulfilledPromises;
                        });
                },
                Promise.resolve<Array<T>>(new Array(len)),
            );

            reducedPromise.then((resultArray: ReadonlyArray<T>) => {
                /**
                 * If we are here that means all the promises have been fulfilled
                 * and here we get the accumulated array of values
                 */
                resolve(resultArray);
            });
        });
    };
}

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

if (!Promise.some) {
    Promise.some = function <T>(promises: Array<Promise<T> | PromiseLike<T>>): Promise<ReadonlyArray<T | null> | null> {
        // Top-level promise
        return new Promise((resolve, reject) => {
            const len = promises.length;
            let fulfilledCount = 0;

            const reducedPromise = promises.reduce(
                (
                    processedPromises: Promise<Array<T | null>>,
                    currentPromise: Promise<T> | PromiseLike<T>,
                    index: number,
                ): Promise<Array<T | null>> => {
                    const trustedPromise = Promise.resolve(currentPromise);

                    return trustedPromise
                        .then((value: T) => {
                            fulfilledCount += 1;

                            return processedPromises.then((previousProcessed: Array<T | null>) => {
                                previousProcessed[index] = value;
                                return previousProcessed;
                            });
                        })
                        .catch((_reason: unknown) => {
                            return processedPromises.then((previousProcessed: Array<T | null>) => {
                                previousProcessed[index] = null;
                                return previousProcessed;
                            });
                        });
                },
                Promise.resolve<Array<T | null>>(new Array(len)),
            );

            reducedPromise.then((values: Array<T | null>) => {
                if (!fulfilledCount) {
                    reject(null);
                } else {
                    resolve(values);
                }
            });
        });
    };
}

if (!Promise.timeout) {
    Promise.timeout = function <T>(
        promise: Promise<T> | PromiseLike<T> | ReadonlyArray<Promise<T> | PromiseLike<T>>,
        timeout: number,
    ): Promise<T | ReadonlyArray<T | null> | null | unknown | string> {
        // Top-level promise
        return new Promise((resolve, reject) => {
            let trustedPromise: Promise<T | ReadonlyArray<T | null> | null>;

            if (Array.isArray(promise)) {
                trustedPromise = Promise.some<T>(promise);
            } else {
                trustedPromise = Promise.resolve<T>(promise as Promise<T> | PromiseLike<T>);
            }

            Promise.race([
                trustedPromise
                    .catch((reason: unknown) => {
                        return reason;
                    }),
                new Promise<string>((_tResolve, tReject) => {
                    setTimeout(() => {
                        tReject('Error: timeout!');
                    }, timeout);
                }),
            ]).then((value: T | ReadonlyArray<T | null> | null | unknown) => {
                resolve(value);
            }).catch((timeoutResult: string) => {
                reject(timeoutResult);
            });
        });
    };
}

export default {};

