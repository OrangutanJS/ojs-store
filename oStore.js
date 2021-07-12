import debounceFn from "./utils/debounce";

const defaultConfig = {
    debounce: false,
    debounceTime: 1000,
    debounceFields: [],
    unobservedFields: []
}

const oStore = (store = {}, instanceOrFunction, config) => {
    const rerender = instanceOrFunction.rerender ? instanceOrFunction.rerender : instanceOrFunction;
    return new Proxy(store, handler(rerender, {...defaultConfig, ...config}));
}

const handler = function (rerender, config) {
    const {debounceTime, debounceFields, unobservedFields} = config;
    let {debounce} = config;
    if (debounceFields.length) debounce = true;

    const debounceSet = debounceFn(() => {
        rerenderOnSet(rerender)
    }, debounceTime);

    return {
        deleteProperty: function (target, property) {
            delete target[property];
            rerender();
            return true;
        },
        get: function (obj, prop) {
            if (['[object Object]', '[object Array]'].indexOf(Object.prototype.toString.call(obj[prop])) > -1) {
                return new Proxy(obj[prop], handler(rerender, config));
            }
            return obj[prop];
        },
        set: function (target, property, value) {
            if (target[property] === value)
                return true;
            target[property] = value;
            if (unobservedFields.includes(property)) return true;
            if (debounce) {
                if (debounceFields.length) {
                    debounceFields.includes(property) ? debounceSet() : rerenderOnSet(rerender);
                    return true;
                } else {
                    debounceSet()
                    return true;
                }
            }

            rerenderOnSet(rerender);
            return true;
        }
    }
}

const rerenderOnSet = (rerender) => {
    const focusHandler = document.activeElement.id;
    // instance?.rerender?.call(instance);
    rerender();
    document.getElementById(focusHandler)?.focus();
}

export default oStore;