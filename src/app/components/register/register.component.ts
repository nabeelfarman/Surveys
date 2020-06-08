import { Component, OnInit } from "@angular/core";
import { ToastrManager } from "ng6-toastr-notifications";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
})
export class RegisterComponent implements OnInit {
  firstName = "";
  lastName = "";
  password = "";
  cnfrmPassword = "";
  email = "";
  type = "";
  typeList = [
    {
      typeId: "1",
      typeName: "Guru",
    },
    {
      typeId: "2",
      typeName: "Consultant",
    },
  ];

  constructor(public toastr: ToastrManager, private http: HttpClient) {}

  ngOnInit(): void {}

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
      this.toastr.successToastr("All OK", "Success", {
        toastTimeout: 2500,
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
