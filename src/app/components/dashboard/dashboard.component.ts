import { Component, OnInit } from '@angular/core';
import { ToastrManager } from "ng6-toastr-notifications";
import { HttpClient, HttpHeaders, HttpErrorResponse } from "@angular/common/http";
import { AppComponent } from "src/app/app.component";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(
    public toastr: ToastrManager,
    private http: HttpClient,
    private app: AppComponent,
    private router: Router,
    private cookie: CookieService
  ) { }

  ngOnInit(): void {
  }


  logout(){
    this.app.Logout();
  }

}
