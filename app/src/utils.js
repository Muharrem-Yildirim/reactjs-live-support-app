export function isEmptyOrSpaces(str) {
  return str === null || str.match(/^ *$/) !== null;
}

export function getRuntime() {
  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    return "dev";

  } else {
    return "prod";
  }
}