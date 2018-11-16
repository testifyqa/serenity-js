import 'mocha';

import { expect } from '@integration/testing-tools';
import { Actor, AssertionError, Question } from '@serenity-js/core';
import { given } from 'mocha-testdata';

import { Ensure, equals } from '../src';

describe('Ensure', () => {

    const Enrique = Actor.named('Enrique');
    const p = value => Promise.resolve(value);
    const q = value => Question.about(`answer to some question`, actor => value);

    describe('type safety', () => {

        it('is compatible with all the different permutations of parameters', () => {

            const LastResult = () => Question.about<number>(`the result of the calculation`, (actor: Actor) => {
                return 42;
            });

            const LastPromisedResult = () => Question.about<Promise<number>>(`the result of the calculation`, (actor: Actor) => {
                return Promise.resolve(42);
            });

            return Enrique.attemptsTo(
                Ensure.that(42, equals(42)),
                Ensure.that(Promise.resolve(42), equals(42)),
                Ensure.that(LastResult(), equals(42)),
                Ensure.that(LastPromisedResult(), equals(42)),
                Ensure.that(42, equals(Promise.resolve(42))),
                Ensure.that(Promise.resolve(42), equals(Promise.resolve(42))),
                Ensure.that(LastResult(), equals(Promise.resolve(42))),
                Ensure.that(LastPromisedResult(), equals(Promise.resolve(42))),
                Ensure.that(42, equals(LastResult())),
                Ensure.that(Promise.resolve(42), equals(LastResult())),
                Ensure.that(LastResult(), equals(Promise.resolve(42))),
                Ensure.that(LastPromisedResult(), equals(Promise.resolve(42))),
                Ensure.that(42, equals(LastPromisedResult())),
                Ensure.that(Promise.resolve(42), equals(LastPromisedResult())),
                Ensure.that(LastResult(), equals(LastPromisedResult())),
                Ensure.that(LastPromisedResult(), equals(LastPromisedResult())),

                // todo Gabi's ideas:
                // Ensure.that(WebElement.of('#id'), not(isVisible()))
                // Ensure.that(Text.of('#id'), startsWith())
                // Ensure.that(Attribute.of('#id').called('class'), startsWith())

            );
        });
    });

    given([
        { description: `#actor ensures that 'a value' is equal to 'a value'`,                           expected: 'a value',        actual: 'a value' },
        { description: `#actor ensures that 'a value' is equal to the promised value`,                  expected: p('a value'),     actual: 'a value' },
        { description: `#actor ensures that 'a value' is equal to answer to some question`,             expected: q('a value'),     actual: 'a value' },
        { description: `#actor ensures that 'a value' is equal to answer to some question`,             expected: q(p('a value')),  actual: 'a value' },

        { description: `#actor ensures that the promised value is equal to 'a value'`,                  expected: 'a value',        actual: p('a value') },
        { description: `#actor ensures that the promised value is equal to the promised value`,         expected: p('a value'),     actual: p('a value') },
        { description: `#actor ensures that the promised value is equal to answer to some question`,    expected: q('a value'),     actual: p('a value') },
        { description: `#actor ensures that the promised value is equal to answer to some question`,    expected: q(p('a value')),  actual: p('a value') },

        { description: `#actor ensures that answer to some question is equal to 'a value'`,                 expected: 'a value',        actual: q('a value') },
        { description: `#actor ensures that answer to some question is equal to the promised value`,        expected: p('a value'),     actual: q('a value') },
        { description: `#actor ensures that answer to some question is equal to answer to some question`,   expected: q('a value'),     actual: q('a value') },
        { description: `#actor ensures that answer to some question is equal to answer to some question`,   expected: q(p('a value')),  actual: q('a value') },

        { description: `#actor ensures that answer to some question is equal to 'a value'`,                 expected: 'a value',        actual: q(p('a value')) },
        { description: `#actor ensures that answer to some question is equal to the promised value`,        expected: p('a value'),     actual: q(p('a value')) },
        { description: `#actor ensures that answer to some question is equal to answer to some question`,   expected: q('a value'),     actual: q(p('a value')) },
        { description: `#actor ensures that answer to some question is equal to answer to some question`,   expected: q(p('a value')),  actual: q(p('a value')) },
    ]).
    it('provides a task description based on the assertion given', ({ description, actual, expected }) => {
        const task = Ensure.that(actual, equals(expected));

        expect(task.toString()).to.equal(description);
    });

    given([
        { description: 'string, string',                    expected: 'a value',        actual: 'a value' },
        { description: 'Promise<string>, string',           expected: p('a value'),     actual: 'a value' },
        { description: 'Question<string>, string',          expected: q('a value'),     actual: 'a value' },
        { description: 'Question<Promise<string>>, string', expected: q(p('a value')),  actual: 'a value' },

        { description: 'string, Promise<string>',                       expected: 'a value',        actual: p('a value') },
        { description: 'Promise<string>, Promise<string>',              expected: p('a value'),     actual: p('a value') },
        { description: 'Question<string>, Promise<string>',             expected: q('a value'),     actual: p('a value') },
        { description: 'Question<Promise<string>>, Promise<string>',    expected: q(p('a value')),  actual: p('a value') },

        { description: 'string, Question<string>',                      expected: 'a value',        actual: q('a value') },
        { description: 'Promise<string>, Question<string>',             expected: p('a value'),     actual: q('a value') },
        { description: 'Question<string>, Question<string>',            expected: q('a value'),     actual: q('a value') },
        { description: 'Question<Promise<string>>, Question<string>',   expected: q(p('a value')),  actual: q('a value') },

        { description: 'string, Question<Promise<string>>',                     expected: 'a value',        actual: q(p('a value')) },
        { description: 'Promise<string>, Question<Promise<string>>',            expected: p('a value'),     actual: q(p('a value')) },
        { description: 'Question<string>, Question<Promise<string>>',           expected: q('a value'),     actual: q(p('a value')) },
        { description: 'Question<Promise<string>>, Question<Promise<string>>',  expected: q(p('a value')),  actual: q(p('a value')) },
    ]).
    it('returns a fulfilled promise when the assertion passes', ({ actual, expected }) =>
        expect(Enrique.attemptsTo(
            Ensure.that(actual, equals(expected)),
        )).to.be.fulfilled,  // ts-lint:disable-line:no-unused-expression
    );

    given([
        { description: `'actual' should be equal to 'expected'`,    actual: 'actual', expected: 'expected'       },
        { description: `'actual' should be equal to 'expected'`,    actual: 'actual', expected: p('expected')    },
        { description: `'actual' should be equal to 'expected'`,    actual: 'actual', expected: q('expected')    },
        { description: `'actual' should be equal to 'expected'`,    actual: 'actual', expected: q(p('expected')) },

        { description: `'actual' should be equal to 'expected'`,    actual: p('actual'), expected: 'expected'       },
        { description: `'actual' should be equal to 'expected'`,    actual: p('actual'), expected: p('expected')    },
        { description: `'actual' should be equal to 'expected'`,    actual: p('actual'), expected: q('expected')    },
        { description: `'actual' should be equal to 'expected'`,    actual: p('actual'), expected: q(p('expected')) },

        { description: `'actual' should be equal to 'expected'`,    actual: q('actual'), expected: 'expected'      },
        { description: `'actual' should be equal to 'expected'`,    actual: q('actual'), expected: p('expected')   },
        { description: `'actual' should be equal to 'expected'`,    actual: q('actual'), expected: q('expected')   },
        { description: `'actual' should be equal to 'expected'`,    actual: q('actual'), expected: q(p('expected')) },

        { description: `'actual' should be equal to 'expected'`,    actual: q(p('actual')), expected: 'expected'       },
        { description: `'actual' should be equal to 'expected'`,    actual: q(p('actual')), expected: p('expected')    },
        { description: `'actual' should be equal to 'expected'`,    actual: q(p('actual')), expected: q('expected')    },
        { description: `'actual' should be equal to 'expected'`,    actual: q(p('actual')), expected: q(p('expected')) },
    ]).
    it('rejects a promise when the assertion fails', ({ description, actual, expected }) =>
        expect(Enrique.attemptsTo(
            Ensure.that(actual, equals(expected)),
        ))
        .to.be.rejectedWith(AssertionError, description)
        .then(error => {
            expect(error.expected).to.equal(expected);
            expect(error.actual).to.equal(actual);
        }),
    );
});