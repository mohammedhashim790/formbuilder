import { Routes } from '@angular/router';
import {HomeComponent} from "../home/home.component";
import {authGuard} from "../../core/guard/auth/auth.guard";
import {MainComponent} from "../main/main.component";

export const routes: Routes = [
  {
    path:'',
    component: MainComponent,
  },
  {
    path: 'app',
    canActivateChild: [authGuard],
    data: {
      requiresAuth: true,
    },
    children: [
      {
        path:'',
        component:HomeComponent,
      },
      // TODO : Define a parent Form Component, inherit the component to create, view / edit
      {
        path:'create',
        loadComponent: ()=> import('../create-form/create-form.component').then(m => m.CreateFormComponent),
      },
      {
        path:'view',
        loadComponent: ()=> import('../create-form/create-form.component').then(m => m.CreateFormComponent),
      },

      {
        path:'list',
        loadComponent: ()=> import('../list-form/list-form.component').then(m => m.ListFormComponent),
      },

    ]
  },
  {
    path: 'login',
    loadComponent: ()=>import('../login/login.component').then((res)=>res.LoginComponent)
  },
  {
    path: 'signup',
    loadComponent: ()=>import('../signup/signup.component').then((res)=>res.SignupComponent)
  },


];
