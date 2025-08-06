import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-page-not-found',
  imports: [],
  standalone: true,
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.scss'
})
export class PageNotFoundComponent {
  constructor(private location: Location) {} // Inject Location service

  // Method to navigate back to the previous URL
  goBack(): void {
    this.location.back();
  }
}
