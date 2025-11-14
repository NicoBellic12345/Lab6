import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ItemsService } from '../../services/items.service';
import { Item } from '../../models/item.model';
import { ItemCardComponent } from '../item-card/item-card.component';

@Component({
  selector: 'app-items-list',
  standalone: false,
  templateUrl: './items-list.component.html',
  styleUrls: ['./items-list.component.css']
})
export class ItemsListComponent implements OnInit {
  items: Item[] = [];
  filteredItems: Item[] = [];
  loading = false;
  error: string | null = null;
  searchQuery = '';

  constructor(
    private itemsService: ItemsService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['q'] || '';
      this.loadItems();
    });
  }

  loadItems(): void {
    this.loading = true;
    this.error = null;

    this.itemsService.getItems().subscribe({
      next: (items) => {
        this.items = items;
        this.filteredItems = this.itemsService.filterItems(items, this.searchQuery);
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load items. Please try again.';
        this.loading = false;
        console.error('Error loading items:', error);
      }
    });
  }

  onSearch(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { q: this.searchQuery || null },
      queryParamsHandling: 'merge'
    });
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.onSearch();
  }
}