
// https://medium.com/dailyjs/typescript-create-a-condition-based-subset-types-9d902cea5b8c
type NotSubTypeKeys<T, Condition> = {
  [K in keyof T]: T[K] extends Condition ? never : K
}[keyof T];

// https://stackoverflow.com/questions/50829805/get-keyof-non-optional-property-names-in-typescript
type NonOptionalKeys<T> = {
  [K in keyof T]-?: undefined extends T[K] ? never : K
}[keyof T];

type AnyFunction = (_: any) => any;
type PropertyKeys<T> = NotSubTypeKeys<T, AnyFunction>;

export type Properties<T> = Pick<T, PropertyKeys<T>>;
export type RequiredData<T> = Pick<T, NonOptionalKeys<T> & PropertyKeys<T>>;

export class Index {


}
