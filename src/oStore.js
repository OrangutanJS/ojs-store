const defaultConfig = {
    debounce: false,
    debounceTime: 1000,
    debounceFields: [],
    unobservedFields: []
}

function debounceFn(fn, debounceTime) {
    let timeout = null;
    return (...args) => {
        if(timeout) clearTimeout(timeout);

        timeout = setTimeout(
            ()=> {
                timeout = null;
                fn(...args);
            },
            debounceTime
        )
    }
}

const oStore = (store = {}, instanceOrFunction, config) => {
    const rerender = instanceOrFunction.rerender
        ? {fn: instanceOrFunction.rerender, instance: instanceOrFunction}
        : {fn: instanceOrFunction, instance: null};
    return new Proxy(store, handler(rerender, {...defaultConfig, ...config}));
}

const handler = (rerender, config) => {
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
    rerender.fn.call(rerender.instance);
    const focusedElement = document.getElementById(focusHandler);
    focusedElement && focusedElement.focus();
}

export default oStore;
