const arrayLikeEquals = (a: ArrayLike<unknown>, b: ArrayLike<unknown>) => {
  if (a.length !== b.length) {
    return false;
  }
  // Due to previous condition, a.length === b.length
  for (let index = 0; index < a.length; index++) {
    if (!Object.is(a[index], b[index])) {
      return false;
    }
  }
  return true;
};

export { arrayLikeEquals };
