import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Item } from '../shared/item/item';
import { ItemService } from '../shared/item/item.service';
import { Web3Handler } from 'src/web3';

@Component({
  selector: 'app-add-items',
  templateUrl: './add-items.page.html',
  styleUrls: ['./add-items.page.scss'],
})
export class AddItemsPage {
  items: Item[];

  constructor(private router: Router, private itemService: ItemService) {
    this.items = this.itemService.getAll();

    if(!Web3Handler.connected()){
      this.router.navigateByUrl('/login');
    }
  }

  save() {
    this.router.navigate(['/tabs/new-loan']);
  }

  search(event) {
    // Get the text typed by the user in the search bar
    const text = event.target.value;
    // Get all products again from the service
    const allProducts = this.itemService.getAll();
    if (text && text.trim() !== '') {
      // Use all products to filter
      this.items = allProducts.filter((item) =>
        item.name.toLowerCase().includes(text.toLowerCase())
      );
    } else {
      // Blank text, clear the search, show all products
      this.items = allProducts;
    }
  }
}
