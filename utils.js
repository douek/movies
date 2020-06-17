
const debounce = (func, delay = 1000) => {
    let timeout
    return (...args) => {
        if (timeout) { clearTimeout(timeout) }
        timeout = setTimeout( () => {func.apply(null, args)}, delay)
    }
}