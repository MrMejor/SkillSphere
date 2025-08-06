import { Component, Renderer2 } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ViewportScroller } from '@angular/common';


@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet
  ],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  constructor(private renderer: Renderer2) {
    this.renderer.setStyle(document.body, 'margin', '0');
    this.renderer.setStyle(document.body, 'font-family', "'Inter', sans-serif");
  }
}