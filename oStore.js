const oStore = (store = {}, {rerender} = () => {console.warn("oStore needs rerender function.")}) => {
    return new Proxy(store, {
        deleteProperty: function (target, property) {
            delete target[property];
            rerender();
            return true;
        },
        set: function (target, property, value, receiver) {
            if (target[property] === value)
                return true;
            target[property] = value;
            const waitTime = value === '' ? 300 : 0;
            debounce(()=>{
                const focusHandler = document.activeElement.id;
                rerender();
                document.getElementById(focusHandler)?.focus();
            },waitTime);
            return true;
        }
    });
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
            // clearTimeout(executeTimeout);
        }
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
};

export default oStore;