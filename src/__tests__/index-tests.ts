import {Imm, imm} from "../index";

class SimpleData extends Imm<SimpleData> {
  @imm public readonly name!: string;
  @imm public readonly address?: string;

  public someBusinessLogic(): this {
    return this.copy({name: "new name"});
  }

  public logicWithTwoParams(a: number, b: number): this {
    return this.copy({name: `name ${a} ${b}`});
  }
}

class DataWithConstructor extends Imm<DataWithConstructor> {
  @imm public readonly name!: string;

  constructor() {
    super({name: "from constructor"});
  }
}

class NestedDataWithConstructor extends Imm<NestedDataWithConstructor> {
  @imm public readonly inner!: SimpleData;

  constructor() {
    super({inner: new SimpleData({name: "simple" })});
  }
}

describe("imm", () => {
  it("can create a new instance", () => {
    const d = new SimpleData({name: "a"});
    expect(d.name).toEqual("a");
    expect(d.address).toBeUndefined();
  });

  it("has a generic copy constructor", () => {
    const a = new SimpleData({name: "a"});
    expect(a.name).toEqual("a");
    expect(a.address).toBeUndefined();
    const b = a.copy({address: "b"});
    // a is unchanged
    expect(a.name).toEqual("a");
    expect(a.address).toBeUndefined();
    // b has a's name but the new address
    expect(b.name).toEqual("a");
    expect(b.address).toEqual("b");
  });

  it("can someBusinessLogic a property with a method", () => {
    const a = new SimpleData({name: "a"});
    expect(a.name).toEqual("a");
    const b = a.someBusinessLogic();
    expect(a.name).toEqual("a");
    expect(b.name).toEqual("new name");
  });

  it("can support classes with constructors", () => {
    const a = new DataWithConstructor();
    expect(a.name).toEqual("from constructor");
    const b = a.copy({name: "new value"});
    expect(b.name).toEqual("new value");
  });

  it("can support nested data classes", () => {
    const a = new NestedDataWithConstructor();
    expect(a.inner.name).toEqual("simple");
    const b = a.copy({inner: new SimpleData({name: "updated"})});
    expect(b.inner.name).toEqual("updated");
  });
});
