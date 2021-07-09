const oStore = (store = {}, instance = () => {console.warn("oStore needs rerender function.")}) => {
    return new Proxy(store, handler(instance));
}

const handler = function(instance) {
    return {
        deleteProperty: function (target, property) {
            delete target[property];
            instance?.rerender?.call(instance);
            return true;
        },
        get: function (obj, prop) {
            if (['[object Object]', '[object Array]'].indexOf(Object.prototype.toString.call(obj[prop])) > -1) {
                return new Proxy(obj[prop], handler(instance));
            }
            return obj[prop];
        },
        set: function (target, property, value) {
            if (target[property] === value)
                return true;
            target[property] = value;
            const waitTime = value === '' ? 300 : 0;
            debounce(()=>{
                const focusHandler = document.activeElement.id;
                instance?.rerender?.call(instance);
                document.getElementById(focusHandler)?.focus();
            },waitTime);
            return true;
        }
    }
}

var executed = false;

function debounce(func, wait) {
    let timeout;
    const context = this;
    const args = arguments;
    const later = function () {
        timeout = null;
        let executeTimeout = setTimeout(()=>{executed = false}, 0);
        if (!executed) {
            executed = true;
            func.apply(context, args);
            clearTimeout(executeTimeout);
        }
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
}

export default oStore;