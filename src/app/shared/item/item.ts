import { BigNumberish } from "ethers";

export class Item {
  constructor(
    public id: bigint,
    public name: string,
    public quantity: number) { }

}