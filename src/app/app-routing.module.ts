import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { RegisterComponent } from "./components/register/register.component";
import { LoginComponent } from "./components/login/login.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { TempFormComponent } from "./components/temp-form/temp-form.component";
import { ImportSurveyResultComponent } from './components/import-survey-result/import-survey-result.component';

const routes: Routes = [
  {
    path: "",
    component: LoginComponent,
  },
  {
    path: "temp",
    component: TempFormComponent,
  },
  {
    path: "dashboard",
    component: DashboardComponent,
  },
  {
    path: "register",
    component: RegisterComponent,
  },
  {
    path: "importsurveyresult",
    component: ImportSurveyResultComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
