class UtilsObjects {
  constructor() {}

  public ObjKeysToLowercase(obj: any) {
    if (!obj) {
      return {};
    }
    if (typeof obj !== "object") {
      return obj;
    }
    const input = JSON.parse(JSON.stringify(obj));
    let result = {};
    if (Array.isArray(input)) {
      result = input.map(this.ObjKeysToLowercase.bind(this));
    } else {
      result = Object.keys(input).reduce((newObj, key) => {
        const val = input[key];
        const newVal =
          typeof val === "object" && val !== null
            ? this.ObjKeysToLowercase(val)
            : val;
        newObj[key.toLowerCase()] = newVal;
        return newObj;
      }, {});
    }
    return result;
  }

  public StringToObject(optionstring: string) {
    const has = (obj: any, t: string) => obj.indexOf(t) !== -1;
    let o: any = {};
    if (has(optionstring, "%7B") || has(optionstring, "%7b")) {
      const decodedString = decodeURIComponent(optionstring);
      try {
        o = JSON.parse(decodedString);
      } catch (e) {
        const catchDecodedString = decodeURI(optionstring);
        try {
          o = JSON.parse(catchDecodedString);
        } catch (e) {}
      }
    }
    return o;
  }
  public Clone(obj: any) {
    return JSON.parse(JSON.stringify(obj));
  }
}

export default new UtilsObjects();
