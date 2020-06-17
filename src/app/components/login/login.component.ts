import { Component, OnInit } from "@angular/core";
import { ToastrManager } from "ng6-toastr-notifications";
import { HttpClient, HttpHeaders, HttpErrorResponse } from "@angular/common/http";
import { AppComponent } from "src/app/app.component";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";

declare var $: any;

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  // serverUrl = "http://localhost:9010/api/";
  serverUrl = "http://ambit-erp.southeastasia.cloudapp.azure.com:9048/api/";

  userName = "";
  userPassword = "";

  constructor(
    public toastr: ToastrManager,
    private http: HttpClient,
    private app: AppComponent,
    private router: Router,
    private cookie: CookieService
  ) {}

  ngOnInit(): void {

    if(this.cookie.get('un') != ""){
      this.router.navigate(["importsurveyresult"]);
      $('#menuId').show();
    } 


  }

  onSubmit() {


    if (this.userName == "") {
      //this.toastr.errorToastr("Please Enter Email", "Error", { toastTimeout: 2500, });
      this.app.jClickValidate('userName');
      return false;
    } else if (this.userPassword == "") {
      //this.toastr.errorToastr("Please Enter Password", "Error", { toastTimeout: 2500, });
      this.app.jClickValidate("userPassword");
      return false;
    } else {
      var reqData = {
        IndvdlERPUsrID: this.userName,
        IndvdlERPPsswrd: this.userPassword,
      };

      this.app.showSpinner();
      //var token = localStorage.getItem(this.tokenKey);
      // var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
      var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });
      this.http
        .post(this.serverUrl + "CreateToken", reqData, { headers: reqHeader })
        .subscribe((data: any) => {
          if (data.msg == "success") {
            this.toastr.successToastr("Login Successfully!", "Success!", {
              toastTimeout: 2500,
            });

            this.cookie.set("token", data.token);
            this.cookie.set("ui", "159");
            this.cookie.set("un", "Survey Deck");

            //this.cookie.set('ui', data.rows[0].userID);
            //this.cookie.set('un', data.rows[0].userName);

            this.app.hideSpinner();
            this.router.navigate(["importsurveyresult"]);
            $('#menuId').show();
            this.app.startWatching();
            this.app.subscribeIdle();
            return false;
          } else {
            this.toastr.errorToastr(data.msg, "Error !", {
              toastTimeout: 5000,
            });
            this.app.hideSpinner();
            return false;
          }
        });
    }
  }



  FocusValidate(ElementId){

    this.app.jFocusValidate(ElementId);

  }



  clear() {
    this.userName = "";
    this.userPassword = "";
  }
  
}
