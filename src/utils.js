/** Small browser utilities shared by Searchly modules. */
export function debounce(fn, delay = 180) {
  let timer = null;
  return function debounced(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}
