import { Routes } from '@angular/router';
import { LoginPage } from './pages/login-page/login-page';
import { ModelPage } from './pages/model-page/model-page';

export const routes: Routes = [
    { path: 'login', component: LoginPage},
    { path: 'models', component: ModelPage},
    { path: '**', component: ModelPage},
];
