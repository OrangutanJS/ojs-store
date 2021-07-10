function debounce(fn, debounceTime) {
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
export default debounce;