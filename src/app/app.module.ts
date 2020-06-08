import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "./shared/material.module";
import { PNPrimeModule } from "./shared/pnprime/pnprime.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ChartModule } from "angular-highcharts";
import { NgxSpinnerModule } from "ngx-spinner";

import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { ToastrModule } from "ng6-toastr-notifications";
import { OrderModule } from "ngx-order-pipe";
import { NgxPaginationModule } from "ngx-pagination";
import { SearchPipe } from "./shared/pipe-filters/pipe-search";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { RegisterComponent } from "./components/register/register.component";

@NgModule({
  declarations: [AppComponent, SearchPipe, RegisterComponent],
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
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
