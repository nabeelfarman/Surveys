import { Component, OnInit } from "@angular/core";
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
  serverUrl = "http://localhost:5000/";

  firstName = "";
  lastName = "";
  password = "";
  cnfrmPassword = "";
  email = "";
  type = "";
  typeList = [];

  constructor(
    public toastr: ToastrManager,
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
      this.toastr.errorToastr("Please Enter First Name", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.lastName == "") {
      this.toastr.errorToastr("Please Enter Last Name", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.password == "") {
      this.toastr.errorToastr("Please Enter Password", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.cnfrmPassword == "") {
      this.toastr.errorToastr("Please Enter Confirm Password", "Error", {
        toastTimeout: 2500,
      });
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
    } else if (this.email == "") {
      this.toastr.errorToastr("Please Enter Email", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.validateEmail(this.email) == false) {
      this.toastr.errorToastr("Invalid email address", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.type == "") {
      this.toastr.errorToastr("Invalid Select Registration Type", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else {
      var saveData = {
        indvdlID: 0,
        firstName: this.firstName,
        lastName: this.lastName,
        password: this.password,
        email: this.email,
        typeCd: this.type,
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
          if (data.msg == "Mail sent to your current email address!") {
            this.toastr.successToastr(data.msg, "Success!", {
              toastTimeout: 2500,
            });
            this.app.hideSpinner();
            this.clear();
            this.getIndividualType();
            return false;
          } else {
            this.toastr.errorToastr(data.msg, "Error !", {
              toastTimeout: 5000,
            });
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
    this.type = "";
  }

  public validateEmail(Email) {
    var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    if (!filter.test(Email)) {
      return false;
    } else {
      return true;
    }
  }
}
