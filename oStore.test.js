import oStore from './oStore';
import fetch from 'node-fetch';

describe("General testing", () => {
    test('oStore is defined', () => {
        expect(oStore).toBeDefined();
    })

    test('oStore is a function', () => {
        expect(typeof oStore).toEqual('function');
    })

    test('oStore returns an object', () => {
        const store = oStore({}, {rerender: jest.fn()})
        expect(store).toBeInstanceOf(Object)
        expect(oStore()).toEqual(expect.any(Object));
    })

    test('oStore works without second argument', () => {
        const store = oStore({});
        expect(store).toBeInstanceOf(Object);
    })

    test('oStore works without arguments', () => {
        const store = oStore();
        expect(store).toBeInstanceOf(Object);
    })
})

describe("Checking Proxy events", () => {
    test('oStore calls rerender function on set event', () => {
        const rerender = jest.fn();
        const store = oStore({test: ''}, {rerender})
        store.test = 'test';
        expect(rerender).toHaveBeenCalled()
    })
    test('oStore calls rerender function on delete event', () => {
        const rerender = jest.fn();
        const store = oStore({test1: '', test2: ''}, {rerender})
        delete store.test1;
        expect(rerender).toHaveBeenCalled()
    })
    test('oStore doesnt call rerender function without events', () => {
        const rerender = jest.fn();
        oStore({test: ''}, {rerender})
        expect(rerender).not.toHaveBeenCalled()
    })
})


describe("Asynchronous API practice | /GET user info", () => {
    test('API returns 200', async () => {
        const data = await fetch('https://jsonplaceholder.typicode.com/users/1')
        expect(data.status).toBe(200);
    })
    test('Users/1 has ID=1', async () => {
        const data = await fetch('https://jsonplaceholder.typicode.com/users/1').then(resp => resp.json())
        expect(data).toBeDefined();
        expect(data).toEqual(expect.objectContaining({id: expect.any(Number)}));
        expect(data).toHaveProperty("id", expect.any(Number)); // same as upper one
        expect(data).toHaveProperty("id"); // check if property id exist
    })
})

