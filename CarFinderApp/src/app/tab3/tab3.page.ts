import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/services/auto.service';
import { Auto } from 'src/models/auto.model';

@Component({
  selector: 'app-tab3',
  templateUrl: './tab3.page.html',
  styleUrls: ['./tab3.page.scss'],
})
export class Tab3Page implements OnInit {
  user: any;
  reportes: Auto[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
    this.reportes = this.productService.getProductsByUser(this.user.email);
  }
}
