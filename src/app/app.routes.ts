import { Routes } from '@angular/router';
import { LoginPage } from './pages/login-page/login-page';
import { ModelPage } from './pages/model-page/model-page';
import { PlacementPage } from './pages/placement-page/placement-page';
import { RegisterPage } from './pages/register-page/register-page';
import { AuthLayout } from './layouts/auth-layout/auth-layout';
import { MainLayout } from './layouts/main-layout/main-layout';

export const routes: Routes = [
    { 
        path: '',
        component: AuthLayout,
        children: [
            {path: 'login', component: LoginPage},
            {path: 'register', component: RegisterPage},
        ]
    },
    { 
        path: '',
        component: MainLayout,
        children: [
            { path: 'models', component: ModelPage},
            { path: 'placement', component: PlacementPage},
        ]
    },
    { path: '**', component: ModelPage},
];
