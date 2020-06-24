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
      $('#menuId').hide();
    } else{
      //this.router.navigate(["importsurveyresult"]);
      //$('#menuId').show();
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
    $('#menuId').hide();
    
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
  


  showUserNameMenu(){
    $("#userNotiMenu").removeClass('show-dropdown');
    $("#userSettingMenu").removeClass('show-dropdown');
    $("#userNameMenu").toggleClass('show-dropdown');
  }

  showUserSettingMenu(){
    $("#userNameMenu").removeClass('show-dropdown');
    $("#userNotiMenu").removeClass('show-dropdown');
    $("#userSettingMenu").toggleClass('show-dropdown');
  }

  showUserNotiMenu(){
    $("#userNameMenu").removeClass('show-dropdown');
    $("#userSettingMenu").removeClass('show-dropdown');
    $("#userNotiMenu").toggleClass('show-dropdown');
  }
  

  showMobMenu(){
    $('.navbar-mobile').slideToggle('500');
    $("#userMobNotiMenu").removeClass('show-dropdown');
    $("#userMobSettingMenu").removeClass('show-dropdown');
    $("#userMobNameMenu").removeClass('show-dropdown');
  }
  
  showMobUserNameMenu(){
    $("#userMobNotiMenu").removeClass('show-dropdown');
    $("#userMobSettingMenu").removeClass('show-dropdown');
    $("#userMobNameMenu").toggleClass('show-dropdown');
  }

  showMobUserSettingMenu(){
    $("#userMobNameMenu").removeClass('show-dropdown');
    $("#userMobNotiMenu").removeClass('show-dropdown');
    $("#userMobSettingMenu").toggleClass('show-dropdown');
  }

  showMobUserNotiMenu(){
    $("#userMobNameMenu").removeClass('show-dropdown');
    $("#userMobSettingMenu").removeClass('show-dropdown');
    $("#userMobNotiMenu").toggleClass('show-dropdown');
  }

}
