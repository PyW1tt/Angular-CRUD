import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserCreateComponent } from './user/user-create/user-create.component';
import { UserEditComponent } from './user/user-edit/user-edit.component';
import { UserHomeComponent } from './user/user-home/user-home.component';

const routes: Routes = [
  { path: '', redirectTo:'/user',pathMatch:'full'},
  { path: 'user', component: UserHomeComponent },
  { path: 'user/create', component: UserCreateComponent },
  { path: 'user/edit/:key', component: UserEditComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
