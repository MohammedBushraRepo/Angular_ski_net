import { Component, inject, OnInit } from '@angular/core';
import { ShopService } from '../../core/services/shop.service';
import { Product } from '../../shared/models/products';
import {MatCard} from '@angular/material/card'

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [
    MatCard
  ],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss'
})
export class ShopComponent implements OnInit{
 
  private shopeService = inject(ShopService)
  title = 'Skinet';

  products:Product[] = [];

  ngOnInit(): void {
   this.shopeService.getProducts().subscribe({
      next: response => this.products = response.data,
      error: error => console.log(error),
      complete  : () => console.log('complete'),      
    })
  }

}
