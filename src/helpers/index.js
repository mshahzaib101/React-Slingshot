export function testSpaces(inputValue) {
  const val = inputValue || "";
  if (val && val.replace) {
    return val.replace(/\s/, "").length;
  } else {
    return false;
  }
}

/**
 * Returns window width
 * @export windowWidth
 * @returns {number}
 */
export function windowWidth() {
  let docElemProp = window.document.documentElement.clientWidth,
    body = window.document.body;
  return (
    (window.document.compatMode === "CSS1Compat" && docElemProp) ||
    (body && body.clientWidth) ||
    docElemProp
  );
}

export function hasWhiteSpace(s) {
  return /\s/g.test(s);
}
/**
 * Get query string value from url
 * @export getQueryVariable
 * @param {string} variable
 * @returns {string}
 */
export function getQueryVariable(variable) {
  let query = window.location.search.substring(1);
  let vars = query.split("&");
  for (let i = 0; i < vars.length; i++) {
    let pair = vars[i].split("=");
    if (decodeURIComponent(pair[0]) == variable) {
      return decodeURIComponent(pair[1]);
    }
  }
}

/**
 * convert a given file to base64 string
 * @export getBase64
 * @param {file} file
 */
export function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
