// My Code

export function numArray<T extends number | bigint>(start: T, end: T) {
  var result: T[] = [];
  for (var i = start; i < end; i++) {
    result.push(i);
  }

  return result;
}
