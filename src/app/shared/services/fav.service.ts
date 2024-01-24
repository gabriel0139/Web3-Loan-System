import { Injectable } from '@angular/core';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class FavService {
  private items: Product[] = [];

  constructor() { }

  private isAdded(product: Product) {
    let found = undefined;
    for (let index in this.items) {
      if (this.items[index].description === product.description) {
        found = index;
        break;
      }
    }
    return found;
  }

  getItems(): Product[] {
    return this.items;
  }

  add(product: Product) {
    // If product already in items, do nothing
    const found = this.isAdded(product);

    // If product not in items, add
    if (!found) {
      this.items.push(product);
    }
  }

  remove(product: Product) {
    let found = this.isAdded(product);
    if (found !== undefined) {
      this.items.splice(found, 1);
    }
  }

  isCheapest(product: Product): boolean {
    let cheapestPrice = Number.MAX_VALUE;
    let cheapestProduct = undefined;

    for (let item of this.items) {
      if (item.price < cheapestPrice) {
        cheapestPrice = item.price
        cheapestProduct = item.description;
      }
    }
    if (product.description === cheapestProduct) 
      return true;
    else
      return false;
  }
}
