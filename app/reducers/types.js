import type {Dispatch as ReduxDispatch, Store as ReduxStore} from 'redux';

export type productStateType = {
    +products: array
};

export type Action = {
    +type: string,
    +product: object,
    +productId: object,
    +stockId: object,
    +providerId: object,
    +id: number,
    +row: object,
    +updates: object,
};

export type GetState = () => productStateType;

export type Dispatch = ReduxDispatch<Action>;

export type Store = ReduxStore<GetState, Action>;
