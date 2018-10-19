import {Map} from "immutable";

// https://medium.com/dailyjs/typescript-create-a-condition-based-subset-types-9d902cea5b8c
type NotSubTypeKeys<T, Condition> = {
  [K in keyof T]: T[K] extends Condition ? never : K
}[keyof T];

type AnyFunction = (_: any) => any;
type PropertyKeys<T> = NotSubTypeKeys<T, AnyFunction>;

/** The non-method properties of T. */
export type Properties<T> = Pick<T, PropertyKeys<T>>;

interface Constructor {
  new(...args: any[]): any;
}

/** A base class for data classes so they get the constructor and copy method for free. */
export class Imm<T> {

  private readonly map: Map<any, any>;

  constructor(data: Properties<T>) {
    // Even though our professed parameter is is Properties<T>, the copy constructor
    // lies and passes in a map so that we can use it directly.
    this.map = data instanceof Map ? data as any as Map<any, any> : this.newMap(Map(), data);
  }

  public copy(data: Partial<T>): this {
    return new (this.constructor as Constructor)(this.newMap(this.map, data));
  }

  private newMap(map: Map<any, any>, data: any): Map<any, any> {
    Object.getOwnPropertyNames(Object.getPrototypeOf(this)).forEach(p => {
      if (data.hasOwnProperty(p)) {
        map = map.set(p, data[p]);
      }
    })
    return map;
  }
}

/** Annotates a property as immutable/for inclusion in the copy constructor. */
export function imm(target: any, propertyKey: string): any {
  Object.defineProperty(target, propertyKey, {
    configurable: false,
    enumerable: true,
    get(): any {
      return this.map.get(propertyKey);
    },
  });
}
