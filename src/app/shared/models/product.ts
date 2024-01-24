export class Product {

  constructor(public description: string, 
              public price: number, 
              public thumbnail: string, 
              public discount: number, 
              public icon?: string ) { }
  
}