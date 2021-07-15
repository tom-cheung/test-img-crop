export function debounce(func, debounceTime) {
  let timeout;
  return function debouncedFunction(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), debounceTime);
  };
}
