export function Trim(): PropertyDecorator {
  return (target: string, propertyKey: string | symbol) => {
    const privateFieldKey = Symbol();

    Object.defineProperty(target, privateFieldKey, {
      writable: true,
      enumerable: false,
      configurable: true,
    });

    Object.defineProperty(target, propertyKey, {
      set(value: string) {
        this[privateFieldKey] = value.trim();
      },
      get() {
        return this[privateFieldKey];
      },
      enumerable: true,
      configurable: true,
    });
  };
}
