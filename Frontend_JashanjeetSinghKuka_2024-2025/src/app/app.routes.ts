import { Routes } from '@angular/router';

import { LayoutComponent } from './cliente/layout/layout.component';
import { LayoutBackComponent } from './backoffice/layout/layout.component';

import { InicialComponent } from './cliente/Inicial/inicial.component';
import { LoginComponent } from './cliente/login/login.component';
import { RegistroComponent } from './cliente/registro/registro.component';
// import { TiendaComponent } from './cliente/SkillSphere/tienda.component';
import { SkillSphereComponent } from './cliente/skillSphere/skillSphere.component';
import { ControlPanelComponent } from './backoffice/control-panel/control-panel.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { authGuard } from './services/guards/auth.guard';
import { publicGuard } from './services/guards/public.guard';
import { UserProfileComponent } from './shared/user-profile/user-profile.component';
import { ChangePasswordComponent } from './shared/change-password/change-password.component';
import { AddPostComponent } from './backoffice/add-post/add-post.component';
import { AddPostModalComponent } from './backoffice/add-post-modal/add-post-modal.component';
import { VerProductosComponent } from './cliente/ver-productos/ver-productos.component';
import { CartComponent } from './cliente/cart/cart.component';
import { CartService } from './services/cart.service';
import { FormaPagoComponent } from './cliente/forma-pago/forma-pago.component';
import { RoleGuard } from './services/guards/role.guard';
import { PurchasedPostsComponent } from './cliente/purchased-post/purchased-post.component';
import { VisitProfileComponent } from './cliente/visit-profile/visit-profile.component';




export const routes: Routes = [

  // cliente
  // localhost:4200 -> www.ejemplo.com
  {
    path: "", component: LayoutComponent, children: [ // -> www.ejemplo.com
      { path: "", component: InicialComponent }, // -> www.ejemplo.com
      // { path: "", component: HomeComponent, canActivate: [publicGuard]  }, // -> www.ejemplo.com
      { path: "login", component: LoginComponent, canActivate: [publicGuard] }, // -> www.ejemplo.com/login
      // { path: "login", component: LoginComponent }, // -> www.ejemplo.com/login
      { path: "registro", component: RegistroComponent, canActivate: [publicGuard] }, // -> www.ejemplo.com/registro
      // { path: "registro", component: RegistroComponent }, // -> www.ejemplo.com/registro
    ]
  },

  // backoffice // admin
  // www.ejemplo.com/app
  // {
  //   path: "app", canActivate: [authGuard], component: LayoutBackComponent, children: [ // -> www.ejemplo.com/app
  //     // www.ejemplo.com/app -> no hay parámetros después del app, por lo tanto, angular buscar dentro de esta sección de children el path que esté vacío ""
  //     { path: "", redirectTo: "control-panel", pathMatch: "full" }, // -> www.ejemplo.com/app
  //     { path: "control-panel", component: ControlPanelComponent }, // -> www.ejemplo.com/app/control-panel
  //     { path: 'user-profile', component: UserProfileComponent },
  //     { path: "change-password", component: ChangePasswordComponent },
  //     { path: "add-producto", component: AddProductoComponent },
  //     { path: "tienda", component: TiendaComponent },
  //     { path: 'ver-productos/:id', component: VerProductosComponent },
  //     { path: "cart", component: CartComponent},
  //     { path: "forma-pago", component: FormaPagoComponent},
  //   ]
  // },
    // Client routes
    {
      path: "student",
      canActivate: [authGuard, RoleGuard],
      component: LayoutBackComponent,
      data: { role: "STUDENT" }, // Add role-specific data
      children: [
        { path: "", component: SkillSphereComponent, pathMatch:"full" }, // Client-specific homepage
        { path: "skillSphere", component: SkillSphereComponent },
        { path: "ver-productos/:id", component: VerProductosComponent },
        { path: "cart", component: CartComponent },
        { path: "forma-pago", component: FormaPagoComponent },
        { path: 'user-profile', component: UserProfileComponent },
        { path: "change-password", component: ChangePasswordComponent },
        { path: "purchased-posts", component: PurchasedPostsComponent }, // Added purchased posts route
        { path: "profile/:username", component: VisitProfileComponent },


      ],
    },
  
    // Admin routes
    {
      path: "admin",
      canActivate: [authGuard, RoleGuard],
      component: LayoutBackComponent,
      data: { role: "ADMIN" }, // Add role-specific data
      children: [
        { path: "", component: ControlPanelComponent, pathMatch:"full" }, // Admin-specific homepage
        { path: "control-panel", component: ControlPanelComponent },
        { path: "skillSphere", component: SkillSphereComponent },
        { path: "ver-productos/:id", component: VerProductosComponent },
        { path: "cart", component: CartComponent },
        { path: "forma-pago", component: FormaPagoComponent},
        { path: "add-post", component: AddPostComponent },
        { path: 'user-profile', component: UserProfileComponent },
        { path: "change-password", component: ChangePasswordComponent },
        { path: "purchased-posts", component: PurchasedPostsComponent },
        { path: "profile/:username", component: VisitProfileComponent },


      ],
  },
       // Admin routes
       {
        path: "teacher",
        canActivate: [authGuard, RoleGuard],
        component: LayoutBackComponent,
        data: { role: "TEACHER" }, // Add role-specific data
        children: [
          { path: "", component: AddPostComponent, pathMatch:"full" }, // Seller-specific homepage
          { path: "control-panel", component: ControlPanelComponent },
          { path: "add-post", component: AddPostComponent },
          { path: "add-post-modal", component: AddPostModalComponent },
          { path: 'user-profile', component: UserProfileComponent },
          { path: "change-password", component: ChangePasswordComponent },
          { path: "skillSphere", component: SkillSphereComponent },
          { path: "cart", component: CartComponent },
          { path: "ver-productos/:id", component: VerProductosComponent },
          { path: "purchased-posts", component: PurchasedPostsComponent }, // Added purchased posts route
          { path: "profile/:username", component: VisitProfileComponent },


        ],
      },
  // Si el usuario introduce una url que no existe en la parte superior
  {path: "**", component: PageNotFoundComponent},
];
