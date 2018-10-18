import {Properties, RequiredData} from "../index";

type Foo = Properties<SimpleData>;

class SimpleData {
  public name!: string;
  public address?: string;

  constructor(data: Properties<SimpleData>) {
  }

  public copy(update: Partial<SimpleData>): this {
    return this;
  }
}

describe("imm", () => {

  it("can create a new instance", () => {
    const d = new SimpleData({name: "a"});
  });


});
