import oStore from "./oStore";
import { JSDOM } from "jsdom"

const dom = new JSDOM()
global.document = dom.window.document

describe("General testing", () => {
    test('oStore is defined', () => {
        expect(oStore).toBeDefined();
    })

    test('oStore is a function', () => {
        expect(typeof oStore).toEqual('function');
    })

    test('oStore returns an object', () => {
        // when
        const store = oStore({}, {rerender: jest.fn()})

        // then
        expect(store).toBeInstanceOf(Object)
        expect(oStore()).toEqual(expect.any(Object));
    })

    test('oStore works without second argument', () => {
        // when
        const store = oStore({});

        // then
        expect(store).toBeInstanceOf(Object);
    })

    test('oStore works without arguments', () => {
        // when
        const store = oStore();

        // then
        expect(store).toBeInstanceOf(Object);
    })
})

describe("Proxy events with default oStore config", () => {
    let rerender = jest.fn();

    beforeEach(()=> {
        rerender = jest.fn();
    })

    test('oStore should call rerender function on set event', () => {
        // given
        const store = oStore({test: ''}, {rerender})

        // when
        store.test = 'test';

        // then
        expect(rerender).toHaveBeenCalled()
    })

    test('oStore should call rerender function on delete event', () => {
        // given
        const store = oStore({test1: '', test2: ''}, {rerender})

        // when
        delete store.test1;

        // then
        expect(rerender).toHaveBeenCalled()
    })

    test('oStore should not call rerender function without events', () => {
        // when
        oStore({test: ''}, {rerender})

        // then
        expect(rerender).not.toHaveBeenCalled()
    })

    test('oStore should call rerender function from instance when event is fired', () => {
        // given
        const instance = new class{rerender() {rerender()}};
        const store = oStore({test: ''}, instance);

        // when
        store.test = 'test'

        // then
        expect(rerender).toHaveBeenCalled()
    })
})

describe("Proxy events with user oStore config", () => {
    let rerender = jest.fn();

    const storeObject = {
        firstValue: 'first',
        secondValue: 'second',
    }

    beforeEach(() => {
        rerender = jest.fn();
        storeObject.firstValue = 'first';
        storeObject.secondValue = 'second';
    });

    test('oStore should debounce 1000ms rerender function when changed value is included in debounceFields', () => {
        // given
        jest.useFakeTimers();
        const store = oStore(storeObject, rerender, {debounceFields: ['firstValue']});

        // when
        store.firstValue = 'test'

        // then
        jest.advanceTimersByTime(999);
        expect(rerender).not.toHaveBeenCalled();
        jest.advanceTimersByTime(1);
        expect(rerender).toHaveBeenCalled();
    });

    test('oStore should debounce 500ms rerender function when changed value is included in debounceFields and debounceTime is 500', () => {
        // given
        jest.useFakeTimers();
        const store = oStore(storeObject, rerender, {debounceFields: ['firstValue'], debounceTime: 500});

        // when
        store.firstValue = 'test'

        // then
        jest.advanceTimersByTime(499);
        expect(rerender).not.toHaveBeenCalled();
        jest.advanceTimersByTime(1);
        expect(rerender).toHaveBeenCalled();
    });

    test('oStore should not debounce rerender function when changed value is not included in debounceFields but another is', () => {
        // given
        jest.useFakeTimers();
        const store = oStore(storeObject, rerender, {debounceFields: ['firstValue']});

        // when
        store.secondValue = 'test'

        // then
        expect(rerender).toHaveBeenCalledTimes(1);
        jest.advanceTimersByTime(1000);
        expect(rerender).toHaveBeenCalledTimes(1);
    })

    test('oStore should debounce 1000ms rerender function when {debounce: true} in config',()=> {
        // given
        jest.useFakeTimers();
        const store = oStore(storeObject, rerender, {debounce: true});

        // when
        store.firstValue = 'test'
        store.secondValue = 'also test'

        // then
        jest.advanceTimersByTime(999);
        expect(rerender).not.toHaveBeenCalled();
        jest.advanceTimersByTime(1);
        expect(rerender).toHaveBeenCalledTimes(1);
    })

    test('oStore should debounce 500ms rerender function when {debounce: true, debounceTime: 500} in config',()=> {
        // given
        jest.useFakeTimers();
        const store = oStore(storeObject, rerender, {debounce: true, debounceTime:  500});

        // when
        store.firstValue = 'test'
        store.secondValue = 'also test'

        // then
        jest.advanceTimersByTime(499);
        expect(rerender).not.toHaveBeenCalled();
        jest.advanceTimersByTime(1);
        expect(rerender).toHaveBeenCalledTimes(1);
    })

    test('oStore should not rerender function when changed value is included in unobservedFields',()=> {
        // given
        const store = oStore(storeObject, rerender, {unobservedFields: ['firstValue']});

        // when
        store.firstValue = 'test'

        // then
        expect(rerender).not.toHaveBeenCalled();
    })
})
