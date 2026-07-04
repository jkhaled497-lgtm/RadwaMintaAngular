import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin/admin.guard';
import { loginGuard } from './core/guards/login/login.guard';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  { path: 'home',component:HomeComponent ,title: 'home',},
  {
    path: 'products',
    title: 'products',
    loadComponent: () =>
      import('./pages/products/products.component').then(m => m.ProductsComponent),
  },
  {
    path: 'products/:id',
    title: 'product',
    loadComponent: () =>
      import('./pages/product-details/product-details.component').then(
        m => m.ProductDetailsComponent
      ),
  },
  {
    path: 'contact',
    title: 'contact us',
    loadComponent: () =>
      import('./pages/contact/contact.component').then(m => m.ContactComponent),
  },
  {
    path: 'quality',
    title: 'quality',
    loadComponent: () =>
      import('./pages/quality/quality.component').then(m => m.QualityComponent),
  },
  {
    path: 'story',
    title: 'our story',
    loadComponent: () =>
      import('./pages/story/story.component').then(m => m.StoryComponent),
  },
  {
    path: 'radwacv',
    title: 'Radwa CV',
    loadComponent: () =>
      import('./pages/radwa-cv/radwa-cv.component').then(m => m.RadwaCVComponent),
  },
  {
    path: 'login',
    title: 'login',
    canActivate: [loginGuard],
    loadComponent: () =>
      import('./pages/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'forgot-password',
    title: 'forgot password',
    canActivate: [loginGuard],
    loadComponent: () =>
      import('./pages/forgot-password/forgot-password.component').then(
        m => m.ForgotPasswordComponent
      ),
  },
  {
    path: 'dashboard',
    title: 'dashboard',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component').then(
        m => m.DashboardComponent
      ),
  },
  {path:'**',component:HomeComponent}
];
