import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "./shared/material.module";
import { PNPrimeModule } from "./shared/pnprime/pnprime.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ChartModule, HIGHCHARTS_MODULES } from "angular-highcharts";
import * as more from "highcharts/highcharts-more.src";
import * as exporting from "highcharts/modules/exporting.src";
import * as highcharts from "highcharts/highcharts-3d";
import { NgxSpinnerModule } from "ngx-spinner";

import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { ToastrModule } from "ng6-toastr-notifications";
import { OrderModule } from "ngx-order-pipe";
import { NgxPaginationModule } from "ngx-pagination";
import { SearchPipe } from "./shared/pipe-filters/pipe-search";
import { CookieService } from "ngx-cookie-service";
import { UserIdleModule } from "angular-user-idle";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { RegisterComponent } from "./components/register/register.component";

import { LoginComponent } from "./components/login/login.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { TempFormComponent } from "./components/temp-form/temp-form.component";
import { ResponseGraphicalViewComponent } from "./components/response-graphical-view/response-graphical-view.component";
import { ImportSurveyResultComponent } from "./components/import-survey-result/import-survey-result.component";

@NgModule({
  declarations: [
    AppComponent,
    SearchPipe,
    RegisterComponent,
    LoginComponent,
    DashboardComponent,
    TempFormComponent,
    ImportSurveyResultComponent,
    ResponseGraphicalViewComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    PNPrimeModule,
    ToastrModule.forRoot(),
    HttpClientModule,
    NgxSpinnerModule,
    ChartModule,
    NgxPaginationModule,
    OrderModule,

    // Optionally you can set time for `idle`, `timeout` and `ping` in seconds.
    // Default values: `idle` is 60 (1 minutes), `timeout` is 30 (0.5 minutes)
    // and `ping` is 15 0.25 minutes).
    UserIdleModule.forRoot({ idle: 300, timeout: 300, ping: 15 }),
  ],
  providers: [
    CookieService,
    {
      provide: HIGHCHARTS_MODULES,
      useFactory: () => [more, exporting, highcharts],
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
