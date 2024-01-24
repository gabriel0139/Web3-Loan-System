import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { of } from 'rxjs/internal/observable/of';
import { Item } from './item';

export const ITEM_TYPES = [
  new Item(0x1n, 'Table', 0),
  new Item(0x2n, 'Chair', 0),
  new Item(0x3n, 'Projector', 0),
  new Item(0x4n, 'Speaker', 0),
  new Item(0x5n, 'DSLR', 0),
  new Item(0x6n, 'Video Camera', 0),
  new Item(0x7n, 'Tripod', 0),
  new Item(0x8n, 'Laptop', 0),
  new Item(0x9n, 'Monitor', 0),
  new Item(0xAn, 'TV', 0),
  new Item(0xBn, 'Keyboard', 0),
  new Item(0xCn, 'Mouse', 0),
];

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  //write in hexidecimal for clarity with ethers
  private items = ITEM_TYPES;

  constructor() { }

  getItemName(id: bigint): string{
    return ITEM_TYPES.find( x=> x.id == id)?.name || "{UNKOWN ITEM}"
  }

  getAll(): Item[] {
    return this.items;
  }

  getAllAsync(): Observable<Item[]> {
    return of(this.items);
  }

  resetQuantity() {
    for (let item of this.items) {
      item.quantity = 0;
    }
  }
}
