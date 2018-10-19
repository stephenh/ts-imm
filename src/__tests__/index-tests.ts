import {Imm, imm} from "../index";

class SimpleData extends Imm<SimpleData> {
  @imm public name!: string;
  @imm public address?: string;

  public someBusinessLogic(): this {
    return this.copy({name: "new name"});
  }
}

describe("imm", () => {
  it("can create a new instance", () => {
    const d = new SimpleData({name: "a"});
    expect(d.name).toEqual("a");
    expect(d.address).toBeUndefined();
  });

  it("can someBusinessLogic a property with a method", () => {
    const a = new SimpleData({name: "a"});
    expect(a.name).toEqual("a");
    const b = a.someBusinessLogic();
    expect(a.name).toEqual("a");
    expect(b.name).toEqual("new name");
  });

  it("can someBusinessLogic a property with the generic copy constructor", () => {
    const a = new SimpleData({name: "a"});
    expect(a.address).toBeUndefined();
    const b = a.copy({address: "b"});
    expect(a.address).toBeUndefined();
    expect(b.address).toEqual("b");
  });

});
