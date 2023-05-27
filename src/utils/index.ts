export const NOOP = () => {}

export const sleep = (delay = 200) => new Promise((resolve) => setTimeout(resolve, delay));

export function isJSON(str: any) {
  if (typeof str === 'string') {
    try {
      JSON.parse(str);
      return true
    } catch {
      return false;      
    }
  }
  return false;
}


export function arraybufferToStr(buf: ArrayBuffer) {
  return String.fromCharCode.apply(null, [ ...new Uint16Array(buf) ]);
}