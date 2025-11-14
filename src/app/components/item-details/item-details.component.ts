import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ItemsService } from '../../services/items.service';
import { Item } from '../../models/item.model';

@Component({
  selector: 'app-item-details',
  standalone: false,
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.css']
})
export class ItemDetailsComponent implements OnInit {
  item: Item | null = null;
  loading = false;
  error: string | null = null;
  notFound = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private itemsService: ItemsService
  ) { }

  ngOnInit(): void {
    this.loadItem();
  }

  loadItem(): void {
    const id = this.route.snapshot.paramMap.get('id');
    
    if (!id) {
      this.notFound = true;
      return;
    }

    this.loading = true;
    this.error = null;
    this.notFound = false;

    this.itemsService.getItemById(id).subscribe({
      next: (item) => {
        this.item = item;
        this.loading = false;
      },
      error: (error) => {
        if (error.status === 404) {
          this.notFound = true;
        } else {
          this.error = 'Failed to load product details. Please try again.';
        }
        this.loading = false;
        console.error('Error loading item:', error);
      }
    });
  }

  goBack(): void {
    this.location.back();
  }

  goToItems(): void {
    this.router.navigate(['/items']);
  }
}