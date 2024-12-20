import { Component, inject, OnInit } from '@angular/core';
import { ShopService } from '../../core/services/shop.service';
import { Product } from '../../shared/models/products';
import {MatCard} from '@angular/material/card';
import {MatDialog} from '@angular/material/dialog'

import { ProductItemComponent } from "./product-item/product-item.component";
import { MatButton } from '@angular/material/button';
import { FiltersDialogComponent } from './filters-dialog/filters-dialog.component';
import { MatIcon } from '@angular/material/icon';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import {MatMenu, MatMenuTrigger} from '@angular/material/menu'
import { MatListOption, MatSelectionList, MatSelectionListChange } from '@angular/material/list';
import { ShopeParams } from '../../shared/models/shopParams';
import { Pagination } from '../../shared/models/pagination';
import { FormsModule } from '@angular/forms';

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
    MatMenuTrigger,
    MatPaginator,
    FormsModule
],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss'
})
export class ShopComponent implements OnInit{
 
  private shopeService = inject(ShopService);
  title = 'Skinet';
  private dialogService = inject(MatDialog);

  products?:Pagination<Product>;

  sortOptions = [
    { name: 'Alphabetical' , value:'name'},
    { name: 'price: Low-High' , value:'priceAsc'},
    { name: 'price: High-Low' , value:'priceDsc'},
  ]
  
  shopParams = new ShopeParams;
  pageSizeOptions = [5,10,15,20]


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
      next: response => this.products = response, //get paginated response 
      error: error => console.log(error),
    
    })
  }

  onSearchChange(){
    this.shopParams.pageNumber = 1;
    this.getProducts();
  }

  handelPageEvent(event: PageEvent){
    this.shopParams.pageNumber = event.pageIndex + 1 ;
    this.shopParams.pageSize =event.pageSize;
    this.getProducts();
  }

  onSortChange(event:MatSelectionListChange){
     const selectedOption = event.options[0];  // grap the first element 
     if(selectedOption){
      this.shopParams.sort = selectedOption.value;
      this.shopParams.pageNumber = 1;
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
          this.shopParams.pageNumber = 1 ;
          //apply filters
            this.getProducts();
          
        }
      }
    })
  }


}
