
// https://medium.com/dailyjs/typescript-create-a-condition-based-subset-types-9d902cea5b8c
type NotSubTypeKeys<T, Condition> = {
  [K in keyof T]: T[K] extends Condition ? never : K
}[keyof T];
type AnyFunction = (...args: any[]) => any;
type PropertyKeys<T> = NotSubTypeKeys<T, AnyFunction>;

/** The non-method properties of T. */
export type Properties<T> = Pick<T, PropertyKeys<T>>;

interface Constructor {
  new(...args: any[]): any;
}

/** A base class for data classes so they get the constructor and copy method for free. */
export class Imm<T> {

  // An odd name to avoid collisions in subclasses
  private readonly immData: any;

  constructor(data: Properties<T>) {
    // We bypass the subclass's constructor (if the user provided one) passing in a
    // default value by checking if the copy method passed us the map out-of-band.
    //
    // Stepping out of the stack like this is not super-kosher, but it is at least on
    // our protype so should only break if the constructor is making other instances of
    // the same class.
    this.immData = Object.getPrototypeOf(this).copyConstructorData || data;
  }

  /** @return a new instance of this class but with the changes in `data` applied. */
  public copy(data: Partial<T>): this {
    try {
      Object.getPrototypeOf(this).copyConstructorData = {...this.immData, ...(data as any) };
      return new (this.constructor as Constructor)();
    } finally {
      Object.getPrototypeOf(this).copyConstructorData = undefined;
    }
  }
}

/** Annotates a property as immutable/for inclusion in the copy constructor. */
export function imm(target: any, propertyKey: string): any {
  Object.defineProperty(target, propertyKey, {
    configurable: false,
    enumerable: true,
    get(): any {
      return this.immData[propertyKey];
    },
  });
}
