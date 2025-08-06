// inicial.component.ts
import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicial',
  templateUrl: './inicial.component.html',
  styleUrls: ['./inicial.component.scss']
})
export class InicialComponent implements AfterViewInit {
  constructor(private router: Router) {}

  ngAfterViewInit() {
    this.createParticleInteraction();
  }

  private createParticleInteraction() {
    document.addEventListener('mousemove', (e) => {
      const particles = document.querySelector('.particles-background');
      if (particles) {
        if (particles instanceof HTMLElement) {
          particles.style.setProperty('--x', `${e.clientX}px`);
          particles.style.setProperty('--y', `${e.clientY}px`);
        }
      }
    });
  }

  navigateToRegister() {
    this.router.navigate(['/registro']);
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}