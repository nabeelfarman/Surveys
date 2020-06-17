import { Component, OnInit } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from "@angular/router";
import { CookieService } from 'ngx-cookie-service';
import { UserIdleService } from "angular-user-idle";
import { element } from 'protractor';

declare var $: any;

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  title = "Surveys";

  constructor(
      private spinner: NgxSpinnerService,
      private router: Router,
      private cookie: CookieService,
      private userIdle: UserIdleService
  ) {}

  
  public UserName = this.cookie.get('un');
  public UserId = this.cookie.get('ui');


  ngOnInit(): void {

    if(this.cookie.get('un') == ""){
      this.router.navigate([""]);
    } else{
      this.router.navigate(["importsurveyresult"]);
    }

  }

  //*Functions for Show & Hide Spinner
  showSpinner() {
    this.spinner.show();
  }

  hideSpinner() {
    setTimeout(() => {
      /** spinner ends after process done*/
      this.spinner.hide();
    }, 1000);
  }


  //logout function 
  Logout() {
    this.stopWatching();
    document.cookie = "un=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "ui=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    this.router.navigate([""]);
    
  }



  //user idle functions
  stop() {
    this.userIdle.stopTimer();
  }

  stopWatching() {
    this.userIdle.stopWatching();
  }

  startWatching() {
    this.userIdle.startWatching();
  }

  subscribeIdle(){
    this.userIdle.onTimerStart().subscribe(count => this.Logout());
  }

  restart() {
    this.userIdle.resetTimer();
  }






  //Jquery Validation 
  jClickValidate(ElementId){

    var reqEle = "#" + ElementId;
    $(reqEle).parent().addClass('alert-validate');
    
  }

  jFocusValidate(ElementId){

    var reqEle = "#" + ElementId;
    var val = $(reqEle).val().trim();

    if(val == ""){
      $(reqEle).parent().removeClass('true-validate');
      $(reqEle).parent().addClass('alert-validate');
    }
    else{
      $(reqEle).parent().removeClass('alert-validate');
      $(reqEle).parent().addClass('true-validate');
    }
    //true-validate                 class

  }
  

}
