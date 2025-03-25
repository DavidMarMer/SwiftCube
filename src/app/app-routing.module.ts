import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkeletonComponent } from './layout/skeleton/skeleton.component';
import { RegistrationComponent } from './modules/registration/registration.component';
import { HomeComponent } from './modules/home/home.component';
import { LoginComponent } from './modules/login/login.component';
import { EditUserComponent } from './modules/edit-user/edit-user.component';
import { ControlPanelComponent } from './modules/control-panel/control-panel.component';
import { AdministrateUsersComponent } from './modules/control-panel/administrate-users/administrate-users.component';
import { AdministrateCubesComponent } from './modules/control-panel/administrate-cubes/administrate-cubes.component';

const routes: Routes = [
  {
    path: '',
    component: SkeletonComponent,
    pathMatch: 'prefix',
    children: [
      { path: '', component: HomeComponent },
      { path: 'register', component: RegistrationComponent },
      { path: 'login', component: LoginComponent },
      { path: 'userdata', component: EditUserComponent },
      { path: 'control-panel', component: ControlPanelComponent },
      { path: 'control-panel/administrate-users', component: AdministrateUsersComponent },
      { path: 'control-panel/administrate-cubes', component: AdministrateCubesComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
