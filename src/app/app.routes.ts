import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin/admin.guard';
import { loginGuard } from './core/guards/login/login.guard';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { 
    path: 'home',
    component: HomeComponent,
    title: 'home',
    // canActivate: [adminGuard]
  },
  {
    path: 'products',
    title: 'products',
    // canActivate: [adminGuard],
    loadComponent: () =>
      import('./pages/products/products.component').then(m => m.ProductsComponent),
  },
  {
    path: 'products/:id',
    title: 'product',
    // canActivate: [adminGuard],
    loadComponent: () =>
      import('./pages/product-details/product-details.component').then(
        m => m.ProductDetailsComponent
      ),
  },
  {
    path: 'contact',
    title: 'contact us',
    // canActivate: [adminGuard],
    loadComponent: () =>
      import('./pages/contact/contact.component').then(m => m.ContactComponent),
  },
  {
    path: 'quality',
    title: 'quality',
    // canActivate: [adminGuard],
    loadComponent: () =>
      import('./pages/quality/quality.component').then(m => m.QualityComponent),
  },
  {
    path: 'story',
    title: 'our story',
    // canActivate: [adminGuard],
    loadComponent: () =>
      import('./pages/story/story.component').then(m => m.StoryComponent),
  },
  {
    path: 'radwacv',
    title: 'Radwa CV',
    // canActivate: [adminGuard],
    loadComponent: () =>
      import('./pages/radwa-cv/radwa-cv.component').then(m => m.RadwaCVComponent),
  },
  {
    path: 'profile',
    title: 'profile',
     canActivate: [adminGuard],
    loadComponent: () =>
      import('./pages/user-profile/user-profile.component').then(m => m.UserProfileComponent),
  },
  {
    path: 'login',
    title: 'login',
    //  canActivate: [loginGuard],
    loadComponent: () =>
      import('./pages/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'register',
    title: 'register',
    loadComponent: () =>
      import('./pages/register/register.component').then(m => m.RegisterComponent),
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
    //canActivate: [adminGuard],
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component').then(
        m => m.DashboardComponent
      ),
  },
  {
    path: 'dashboard/add-product',
    title: 'add product',
    // canActivate: [adminGuard],
    loadComponent: () =>
      import('./pages/add-product/add-product.component').then(
        m => m.AddProductComponent
      ),
  },
  {
    path: 'dashboard/update-product/:id',
    title: 'update product',
    // canActivate: [adminGuard],
    loadComponent: () =>
      import('./pages/update-product/update-product.component').then(
        m => m.UpdateProductComponent
      ),
  },
  {
    path: 'client',
    title: 'clients management',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./pages/client/client.component').then(
        m => m.ClientComponent
      ),
  },
  {
    path: 'social-media-links',
    title: 'social media links',
    // canActivate: [adminGuard],
    loadComponent: () =>
      import('./pages/social-media-links/social-media-links.component').then(
        m => m.SocialMediaLinksComponent
      ),
  },
  { path: '**', redirectTo: 'login' }
];
