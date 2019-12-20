import product from '../../app/reducers/counter';
import {
    INCREMENT_COUNTER,
    DECREMENT_COUNTER
} from '../../app/actions/counter';

describe('reducers', () => {
    describe('counter', () => {
        it('should handle initial state', () => {
            expect(product(undefined, {})).toMatchSnapshot();
        });

        it('should handle INCREMENT_COUNTER', () => {
            expect(product(1, {type: INCREMENT_COUNTER})).toMatchSnapshot();
        });

        it('should handle DECREMENT_COUNTER', () => {
            expect(product(1, {type: DECREMENT_COUNTER})).toMatchSnapshot();
        });

        it('should handle unknown action type', () => {
            expect(product(1, {type: 'unknown'})).toMatchSnapshot();
        });
    });
});
