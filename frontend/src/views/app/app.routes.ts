import { Routes } from '@angular/router';
import {Home} from '../home/home';
import {Main} from '../main/main';
import {authGuard} from '../../core/guard/auth/auth.guard';


export const routes: Routes = [
  {
    path:'',
    component: Home,
  },
  {
    path: 'app',
    canActivateChild: [authGuard],
    data: {
      requiresAuth: true,
    },
    component: Main,
    children: [
      {
        path:'',
        loadComponent: ()=> import('../list-form/list-form').then(m => m.ListForm),
      },
      // TODO : Define a parent Form Component, inherit the component to create, view / edit
      {
        path:'create',
        loadComponent: ()=> import('../create-form/create-form').then(m => m.CreateForm),
      },
      {
        path:'view',
        loadComponent: ()=> import('../create-form/create-form').then(m => m.CreateForm),
      },
    ]
  },
  {
    path: 'login',
    loadComponent: ()=>import('../login/login').then((res)=>res.Login)
  },
  {
    path: 'signup',
    loadComponent: ()=>import('../signup/signup').then((res)=>res.Signup)
  },


];
