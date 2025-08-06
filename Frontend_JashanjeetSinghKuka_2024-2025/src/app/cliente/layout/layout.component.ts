import { Component } from '@angular/core';
import {HeaderClienteComponent} from '../header-cliente/header-cliente.component';
import {RouterOutlet} from '@angular/router';
import { FooterComponent } from "../../footer/footer.component";

@Component({
  selector: 'app-layout',
  imports: [
    HeaderClienteComponent,
    RouterOutlet,
    FooterComponent
],
  standalone: true,
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {

}
