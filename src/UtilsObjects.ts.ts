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
      result = Object.keys(input).reduce((newObj: any, key) => {
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

  public StringToObject(attributeString: string) {
    const has = (obj: any, t: string) => obj.trim().indexOf(t) !== -1;
    let o: any = {};
    if (
      (attributeString && has(attributeString, "%7B")) ||
      has(attributeString, "%7b")
    ) {
      const decodedString = decodeURIComponent(attributeString);
      try {
        o = JSON.parse(decodedString);
      } catch (e) {
        const catchDecodedString = decodeURI(attributeString);
        try {
          o = JSON.parse(catchDecodedString);
        } catch (e) {
          console.warn(
            `Unable to parse the string "${attributeString}" to a JSON object`
          );
        }
      }
    }
    return o;
  }
  public Clone(obj: any) {
    return JSON.parse(JSON.stringify(obj));
  }
}

export default new UtilsObjects();
