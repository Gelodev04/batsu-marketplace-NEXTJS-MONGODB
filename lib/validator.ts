export function arrayMinLength(min: number) {
  return function (val: any[]) {
    return Array.isArray(val) && val.length >= min;
  };
}
