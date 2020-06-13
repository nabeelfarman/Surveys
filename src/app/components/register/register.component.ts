import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ToastrManager } from "ng6-toastr-notifications";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";
import { AppComponent } from "src/app/app.component";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
})
export class RegisterComponent implements OnInit {
  // serverUrl = "http://localhost:5000/";
  serverUrl = "http://ambit-erp.southeastasia.cloudapp.azure.com:9049/";

  // this.toastr.errorToastr("Please Enter Email", "Error", { toastTimeout: 2500, });
  firstName = "";
  lastName = "";
  password = "";
  cnfrmPassword = "";
  email = "";
  ddlRole = "";
  typeList = [];

  constructor(
    public toastr: ToastrManager,
    private router: Router,
    private http: HttpClient,
    private app: AppComponent
  ) {}

  ngOnInit(): void {
    this.getIndividualType();
  }

  //******************** To get departments
  getIndividualType() {
    // var Token = localStorage.getItem(this.tokenKey);
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.app.showSpinner();

    this.http
      .get(this.serverUrl + "api/getIndividualType", { headers: reqHeader })
      .subscribe((data: any) => {
        this.typeList = data;
        this.app.hideSpinner();
      });
  }

  save() {
    if (this.firstName == "") {
      this.app.jClickValidate("firstName");
      return false;
    } else if (this.lastName == "") {
      this.app.jClickValidate("lastName");
      return false;
    } else if (this.email == "") {
      this.app.jClickValidate("email");
      return false;
    } else if (this.validateEmail(this.email) == false) {
      this.app.jClickValidate("email");
      return false;
    } else if (this.password == "") {
      this.app.jClickValidate("password");
      return false;
    } else if (this.password.length < 8) {
      this.toastr.errorToastr(
        "Password must be at least 8 characters",
        "Error",
        {
          toastTimeout: 2500,
        }
      );
      return false;
    } else if (this.cnfrmPassword == "") {
      this.app.jClickValidate("cnfrmPassword");
      return false;
    } else if (this.password != this.cnfrmPassword) {
      this.toastr.errorToastr(
        "Password and Confirm Password not Matched",
        "Error",
        {
          toastTimeout: 2500,
        }
      );
      return false;
    } else if (this.ddlRole == "") {
      this.app.jClickValidate("ddlRole");
      return false;
    } else {
      var saveData = {
        indvdlID: 0,
        firstName: this.firstName,
        lastName: this.lastName,
        password: this.password,
        email: this.email,
        typeCd: this.ddlRole,
      };
      this.app.showSpinner();
      //var token = localStorage.getItem(this.tokenKey);
      // var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
      var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });
      this.http
        .post(this.serverUrl + "api/saveIndividual", saveData, {
          headers: reqHeader,
        })
        .subscribe((data: any) => {
          if (data.msg == "Record Saved Successfully!") {
            this.toastr.successToastr(data.msg, "Success!", {
              toastTimeout: 2500,
            });
            this.app.hideSpinner();
            this.router.navigate([""]);
            this.ddlRole = "";
            this.clear();
            this.getIndividualType();
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

  clear() {
    this.firstName = "";
    this.lastName = "";
    this.password = "";
    this.cnfrmPassword = "";
    this.email = "";
    this.ddlRole = "";
  }

  public validateEmail(Email) {
    var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    if (!filter.test(Email)) {
      return false;
    } else {
      return true;
    }
  }

  FocusValidate(ElementId) {
    this.app.jFocusValidate(ElementId);
  }
}
