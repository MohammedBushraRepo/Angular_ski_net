import { Component, inject, OnInit } from '@angular/core';
import { ShopService } from '../../core/services/shop.service';
import { Product } from '../../shared/models/products';
import {MatCard} from '@angular/material/card';
import {MatDialog} from '@angular/material/dialog'

import { ProductItemComponent } from "./product-item/product-item.component";
import { MatButton } from '@angular/material/button';
import { FiltersDialogComponent } from './filters-dialog/filters-dialog.component';
import { MatIcon } from '@angular/material/icon';
import {MatMenu, MatMenuTrigger} from '@angular/material/menu'
import { MatListOption, MatSelectionList, MatSelectionListChange } from '@angular/material/list';
import { ShopeParams } from '../../shared/models/shopParams';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [
    MatCard,
    ProductItemComponent,
    MatButton,
    MatIcon,
    MatMenu,
    MatSelectionList,
    MatListOption,
    MatMenuTrigger
],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss'
})
export class ShopComponent implements OnInit{
 
  private shopeService = inject(ShopService);
  title = 'Skinet';
  private dialogService = inject(MatDialog);

  products:Product[] = [];

  sortOptions = [
    { name: 'Alphabetical' , value:'name'},
    { name: 'price: Low-High' , value:'priceAsc'},
    { name: 'price: High-Low' , value:'priceDsc'},
  ]
  
  shopParams = new ShopeParams;


  ngOnInit(): void {
    this.initializeShope();
  }
  initializeShope(){
   this.shopeService.getBrands();
   this.shopeService.getTypes();
   this.getProducts();
   
  }


  getProducts(){
    this.shopeService.getProducts(this.shopParams).subscribe({
      next: response => this.products = response.data,
      error: error => console.log(error),
    
    })
  }

  onSortChange(event:MatSelectionListChange){
     const selectedOption = event.options[0];  // grap the first element 
     if(selectedOption){
      this.shopParams.sort = selectedOption.value;
     this.getProducts();
      
     }
  }
  

  openFiltersDialog(){
    const  dialogRef = this.dialogService.open(FiltersDialogComponent , {
      minWidth:'500px',
      data: {
        selectedBrands: this.shopParams.brands,
        selectedTypes: this.shopParams.types,
      }
    });

    dialogRef.afterClosed().subscribe({
      next: result => {
        if(result) {
          console.log(result);
          this.shopParams.brands = result.selectedBrands;
          this.shopParams.types = result.selectedTypes;
          //apply filters
            this.getProducts();
          
        }
      }
    })
  }


}
