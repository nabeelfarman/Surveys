import { Component, OnInit } from "@angular/core";
import { ToastrManager } from "ng6-toastr-notifications";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";
import { AppComponent } from "src/app/app.component";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";

declare var $: any;
import * as XLSX from "xlsx";
import { state } from "@angular/animations";
import { stat, Stats } from "fs";
import * as Highcharts from "highcharts";
var imageUrl;

@Component({
  selector: "app-import-survey-result",
  templateUrl: "./import-survey-result.component.html",
  styleUrls: ["./import-survey-result.component.scss"],
})
export class ImportSurveyResultComponent implements OnInit {
  wordServerUrl = "http://ambit-erp.southeastasia.cloudapp.azure.com:9051/api/";
  //wordServerUrl = "http://localhost:12345/api/";
  //wordServerUrl = "http://ambit-erp.southeastasia.cloudapp.azure.com:9051/api/";
  serverUrl = "http://ambit-erp.southeastasia.cloudapp.azure.com:9050/api/";

  EXPORT_WIDTH = 1000;
  tempData = [];
  summaryData = [];
  detailData = [];
  surveyData = [];

  txtSearchSurvey = "";
  surveyDate = "";
  filePicker = "";
  ddlSurvey = "latest";
  arrayBuffer: any;
  dataFile: File;

  selectedFile: File = null;
  file;

  //-----------nabeel
  categoryName = "";
  questionList = [];
  tempList = [];
  topQuesList = [];
  lowQuesList = [];
  tempQuesList = [];
  chartList = [];

  category = [];
  avg = [];
  treeData = [];

  clientID = "";
  surveyDt = "";
  teamID = "";
  teamName = "";
  noOfRespondent = "";

  constructor(
    public toastr: ToastrManager,
    private http: HttpClient,
    private app: AppComponent,
    private router: Router,
    private cookie: CookieService
  ) {}

  ngOnInit(): void {
    this.surveyDate = new Date().toISOString().split("T")[0];
    //this.getSurveys();
    // this.getChart();
    // this.getChartQuestion();
    // this.getHighQuesChart();
    // this.getLowQuesChart();
  }

  changeSurveyDDL(){

    this.surveyData = [];
    if(this.ddlSurvey == 'latest'){
      this.getSurveys();
    }else {
      this.getSurveysAll();
    }

  }

  //function for get surveys data
  getSurveys() {
    this.app.showSpinner();
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http.get(this.wordServerUrl + "getSurveyDetail", { headers: reqHeader }).subscribe((data: any) => {
        this.surveyData = data;
        this.app.hideSpinner();
      });
  }

  getSurveysAll() {
    this.app.showSpinner();
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http.get(this.wordServerUrl + "getSurveyDetailAll", { headers: reqHeader }).subscribe((data: any) => {
        this.surveyData = data;
        this.app.hideSpinner();
      });
  }

  downloadReport(type, item) {

    var tmpDate = this.formatDate(item.survey_Date, 'withOutSlash');
    var fileName = item.team_Name + "_" + tmpDate + "." + type;

    // alert(fileName);
    // return false;
    window.open(this.wordServerUrl + 'downloadfile?fileName=' + fileName ,  '_blank');

  }

  genReport(chartsList) {

    var reqData = {
      images: JSON.stringify(chartsList),
      Consultant_ID: "1",
      Survey_ID: "38",
      Survey_Date: this.surveyDt,
      Client_ID: this.clientID,
      Team_ID: this.teamID,
      name: this.teamName,
      NoOfRespondents: this.noOfRespondent,
    };

    this.app.showSpinner();
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http.post(this.wordServerUrl + "genReport", reqData, { headers: reqHeader }).subscribe((data: any) => {
        //this.http.get(this.wordServerUrl + "getSurveys", { headers: reqHeader }).subscribe((data: any) => {

        if (data.msg != "Success") {
          this.toastr.errorToastr(data.msg, "Error", { toastTimeout: 2500 });
        } else {
          // // debugger;
          // // var fileData = this.base64ToBlob(data.fileData, 'docx');
          // // const a =window.document.createElement('a');

          // // a.href = window.URL.createObjectURL(fileData);
          // // a.download;
          // // a.click();
          // if(data.fileData != undefined || data.fileData != ""){
          //   var fileData = this.base64ToBlob(data.fileData);

          //   window.URL.createObjectURL(fileData);

          // }

          //window.open("C:/SurveyTemplate/surveyDuckReport.doc");
          this.toastr.successToastr(data.msg, "Success", {
            toastTimeout: 2500,
          });
          this.app.hideSpinner();
        }

        this.app.hideSpinner();
      });
  }

  base64ToBlob(b64Data, contentType = "", sliceSize = 512) {
    b64Data = b64Data.replace(/\s/g, ""); //IE compatibility...
    let byteCharacters = atob(b64Data);
    let byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      let slice = byteCharacters.slice(offset, offset + sliceSize);

      let byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      let byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, { type: contentType });
  }

  getTableData(item) {
    this.clientID = item.client_ID;
    this.teamID = item.team_ID;
    //this.surveyDt = item.survey_Date;
    this.surveyDt = this.formatDate(item.survey_Date, 'withSlash');
    this.teamName = item.team_Name;
    this.noOfRespondent = item.noOfRespondents;
    
    this.getChart();
  }

  getChartQuestion() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });
    // this.app.showSpinner();
    this.http
      .get(
        "http://ambit-erp.southeastasia.cloudapp.azure.com:9049/api/getSurveyQuestionAvg?surveyID=38&surveyDate=" +
          this.surveyDt +
          "&clientID=" +
          this.clientID +
          "&teamID=" +
          this.teamID,
        { headers: reqHeader }
      )
      .subscribe((data: any) => {
        this.tempQuesList = data;
        // alert(this.tempQuesList);
        this.getHighQuesChart();
      });
  }

  getChart() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });
    this.app.showSpinner();
    this.http
      .get(
        "http://ambit-erp.southeastasia.cloudapp.azure.com:9049/api/getQuestionsTreeAvg?surveyID=38&surveyDate=" +
          this.surveyDt +
          "&clientID=" +
          this.clientID +
          "&teamID=" +
          this.teamID,
        {
          headers: reqHeader,
        }
      )
      .subscribe((data: any) => {
        this.tempList = data;
        // alert(this.tempList);

        this.getChartQuestion();
      });
  }

  getHighQuesChart() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });
    // this.app.showSpinner();
    this.http
      .get(
        "http://ambit-erp.southeastasia.cloudapp.azure.com:9049/api/getHighQuestionsTreeAvg?surveyID=38&surveyDate=" +
          this.surveyDt +
          "&clientID=" +
          this.clientID +
          "&teamID=" +
          this.teamID,
        {
          headers: reqHeader,
        }
      )
      .subscribe((data: any) => {
        this.topQuesList = data;
        // alert(this.topQuesList);

        this.getLowQuesChart();
        // this.app.hideSpinner();
      });
  }

  getLowQuesChart() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });
    // this.app.showSpinner();
    this.http
      .get(
        "http://ambit-erp.southeastasia.cloudapp.azure.com:9049/api/getLowQuestionsTreeAvg?surveyID=38&surveyDate=" +
          this.surveyDt +
          "&clientID=" +
          this.clientID +
          "&teamID=" +
          this.teamID,
        {
          headers: reqHeader,
        }
      )
      .subscribe((data: any) => {
        this.lowQuesList = data;
        // alert(this.lowQuesList);

        this.genWord(0);
        // this.app.hideSpinner();
      });
  }

  downloadFile() {
    //$('#downloadReport').hide();
  }

  incomingfile(event) {
    this.dataFile = event.target.files[0];

    this.app.showSpinner();

    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result;
      var data = new Uint8Array(this.arrayBuffer);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i)
        arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      var workbook = XLSX.read(bstr, { type: "binary" });
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];

      this.tempData = XLSX.utils.sheet_to_json(worksheet, { raw: true });
      this.addRecord();
      this.app.hideSpinner();
    };
    fileReader.readAsArrayBuffer(this.dataFile);
  }

  onFileSelected(event) {
    this.selectedFile = <File>event.target.files[0];
    let reader = new FileReader();

    reader.onloadend = (e) => {
      this.file = reader.result;

      var splitFile = this.file.split(",")[1];
      this.file = splitFile;
    };

    reader.readAsDataURL(this.selectedFile);
  }

  addRecord() {
    // Object.keys(user) = ["name", "age"]
    // Object.values(user) = ["John", 30]
    // Object.entries(user) = [ ["name","John"], ["age",30] ]

    var dataLen = this.tempData.length;
    this.summaryData = [];
    this.detailData = [];

    for (let i = 0; i < dataLen; i++) {
      var xlData = {
        ResponseId: this.tempData[i]["Response ID"],
        FirstName: this.tempData[i]["Email First Name"],
        LastName: this.tempData[i]["Email Last Name"],
        EmailAddress: this.tempData[i]["Email List Address"],
        IPAddress: this.tempData[i]["IP Address"],
        CustomAnswer1: this.tempData[i]["Custom Answer 1"],
        CustomAnswer2: this.tempData[i]["Custom Answer 2"],
        Status: this.tempData[i]["Status"],
      };

      this.summaryData.push(xlData);
    }
  }

  //Function for save document
  save() {
    if (this.filePicker == undefined) {
      this.toastr.errorToastr("Please select document", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.surveyDate == undefined || this.surveyDate == "") {
      this.toastr.errorToastr("Please enter survey date", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else {
      var filePath = null;
      if (this.file != undefined) {
        filePath = this.filePicker;
      }

      var fileNameExt = this.filePicker.substr(
        this.filePicker.lastIndexOf(".") + 1
      );

      if (fileNameExt != "xlsx") {
        this.toastr.errorToastr("Please select excel file", "Error", {
          toastTimeout: 2500,
        });
        return false;
      }

      // this.app.showSpinner();
      //* ********************************************save data
      var saveData = {
        DocID: 0,
        DocExtension: fileNameExt,
        excelfile: this.file,
        surveyDate: this.surveyDate,
        DocURL: filePath,
        //ConnectedUser: this.app.empId,
        DelFlag: 0,
      };

      //var token = localStorage.getItem(this.tokenKey);

      //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

      var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

      // return false;
      this.http.post(this.serverUrl + "uploadFile", saveData, { headers: reqHeader }).subscribe((data: any) => {
          if (data.msgT == "Team Success" && data.msgA == "Answer Success") {
            this.app.hideSpinner();
            this.toastr.successToastr("Record Save Successfully!", "Success!", {
              toastTimeout: 2500,
            });
            this.getSurveys();
            this.clear();
            return false;
          } else {
            this.app.hideSpinner();
            if (data.msg == "success") {
              this.toastr.errorToastr(data.msgT, "Error!", {
                toastTimeout: 5000,
              });
              this.toastr.errorToastr(data.msgA, "Error!", {
                toastTimeout: 5000,
              });
            } else {
              this.toastr.errorToastr(data.msg, "Error!", {
                toastTimeout: 5000,
              });
            }
            return false;
          }
        });
    }
  }

  clear() {
    this.tempData = [];
    this.summaryData = [];
    this.detailData = [];

    this.filePicker = "";
    this.filePicker = undefined;
    this.surveyDate = "";
    this.txtSearchSurvey = "";

    this.file = undefined;
    this.selectedFile = null;

    var fileName = "Choose Response Data file";
    $(".custom-file-input")
      .siblings(".custom-file-label")
      .addClass("selected")
      .html(fileName);
  }

  filterExcelData() {
    //var token = localStorage.getItem(this.tokenKey);
    // var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .get(this.serverUrl + "saveExcelData?rows=" + this.summaryData, {
        headers: reqHeader,
      })
      .subscribe((data: any) => {
        this.detailData = data;
        // alert(data.length);
        this.app.hideSpinner();
      });
  }

  fileChange() {
    var fileName = $(".custom-file-input").val().split("\\").pop();
    $(".custom-file-input")
      .siblings(".custom-file-label")
      .addClass("selected")
      .html(fileName);
  }

  genWord(val) {
    if (this.chartList.length == 28) {
      // alert(this.chartList.length);
      this.chartList = [];
      // alert(this.chartList.length);
    }
    this.app.showSpinner();
    for (var i = val; i < this.tempList.length; i++) {
      this.category = [];
      this.categoryName = "";
      this.avg = [];
      this.treeData = [];
      if (this.tempList[i].parent_category_code != 0) {
        for (var j = 0; j < this.tempList.length; j++) {
          if (
            this.tempList[i].parent_category_code ==
            this.tempList[j].category_code
          ) {
            this.categoryName = this.tempList[j].category_Name;
          }
          if (this.categoryName == "Team Outcomes") {
            for (var k = 0; k < this.tempList.length; k++) {
              if (
                this.tempList[k].parent_category_code ==
                this.tempList[j].category_code
              ) {
                this.category.push(this.tempList[k].category_Name);
                this.avg.push([this.tempList[k].avg]);
                this.treeData.push([
                  this.tempList[k].min,
                  this.tempList[k].max,
                ]);
              }
            }
            j = this.tempList.length + 1;
          } else if (
            this.tempList[i].parent_category_code ==
            this.tempList[j].parent_category_code
          ) {
            for (var k = 0; k < this.tempList.length; k++) {
              if (
                this.tempList[k].parent_category_code ==
                this.tempList[j].category_code
              ) {
                // this.category.push(this.tempList[k].category_Name);
                // this.avg.push([this.tempList[k].avg]);
                // this.treeData.push([
                //   this.tempList[k].min,
                //   this.tempList[k].max,
                // ]);
                if (this.category.length == 0) {
                  this.category.push(this.tempList[k].category_Name);
                  this.avg.push([this.tempList[k].avg]);
                  this.treeData.push([
                    this.tempList[k].min,
                    this.tempList[k].max,
                  ]);
                } else {
                  var categoryFound = false;
                  for (var l = 0; l < this.category.length; l++) {
                    if (this.category[l] == this.tempList[k].category_Name) {
                      categoryFound = true;
                      l = this.category.length + 1;
                    }
                  }
                  if (categoryFound == false) {
                    this.category.push(this.tempList[k].category_Name);
                    this.avg.push([this.tempList[k].avg]);
                    this.treeData.push([
                      this.tempList[k].min,
                      this.tempList[k].max,
                    ]);
                  }
                }
              }
            }
          }
        }
        if (this.chartList.length == 0) {
          this.genChartImage(
            this.category,
            this.avg,
            this.treeData,
            this.categoryName,
            i
          );
          i = this.tempList.length + 1;
        } else {
          var found = false;
          for (var j = 0; j < this.chartList.length; j++) {
            if (this.chartList[j].name == this.categoryName) {
              // alert("ok");
              found = true;
              j = this.chartList.length + 1;
            }
          }
          if (found == false) {
            this.genChartImage(
              this.category,
              this.avg,
              this.treeData,
              this.categoryName,
              i
            );
            i = this.tempList.length + 1;
          }
        }
      }
    }
  }

  genChartImage(category, avg, treeData, categoryName, val) {
    var options = {
      chart: {
        inverted: true,
        // options3d: {
        //   enabled: true,
        //   alpha: 25,
        //   beta: 25,
        //   depth: 50,
        //   viewdistance: 30,
        // },
      },
      title: {
        text: "",
        style: { fontSize: "25px", color: "black" },
      },
      xAxis: {
        categories: category,
        labels: {
          style: {
            fontSize: "15px",
            color: "black",
          },
        },
      },
      yAxis: {
        gridLineColor: "#c0c0c0",
        // categories: ["", 1, 2, 3, 4, 5, ""],
        // min: 1,
        // max: 5,
        title: {
          text: ""
        },
        tickPositioner: function () {
          return [0, 1, 2, 3, 4, 5, 6];
        },
        labels: {
          style: {
            fontSize: "15px",
            color: "black",
          },
          formatter: function () {
            if (this.value != 0 && this.value != 6) {
              return this.value;
            }
          },
        },
      },
      plotOptions: {
        line: {
          marker: {
            symbol: "diamond",
            fillColor: "black",
            // "url(http://ambit-erp.southeastasia.cloudapp.azure.com:9000/assets/images/Marker2.png)",
            // "url(../../../../../assets/images/Marker2.png)",
            radius: 10,
          },
          lineWidth: 0,
          dataLabels: {
            enabled: true,
            style: {
              fontSize: "15px",
            },
          },
        },
        columnrange: {
          // borderRadius: 16,
          shadow: true,
          // dataLabels: {
          //   enabled: false,
          // },
        },
      },

      legend: {
        enabled: false,
      },
      credits: {
        enabled: false,
      },
      series: [
        {
          // stroke: "#b1b1b1",
          // strokeWidth: 2,
          borderColor: "#b1b1b1",
          name: "Categories",
          pointWidth: 30,
          color: {
            linearGradient: {
              x1: 0,
              x2: 1,
              y1: 0,
              y2: 0,
            },
            stops: [
              [0, "#727272"],
              // [0, "#1707b2"],
              // [1, "#54ffc1"],
              [1, "#f2f2f2"],
            ],
          },
          data: treeData,
          type: "columnrange",
        },
        {
          name: "Average",
          pointWidth: 0,
          data: avg,
          type: "line",
        },
      ],
    };

    var container = document.getElementById("#container");

    // var charts = Highcharts.chart("container", options);
    // var svg = charts.getSVG();
    // var data = window.btoa(svg);

    var charts = Highcharts.chart("container", options);
    var render_width = this.EXPORT_WIDTH;
    var render_height =
      (render_width * charts.chartHeight) / charts.chartWidth;
    var svg = charts.getSVG({
      exporting: {
        sourceWidth: charts.chartWidth,
        sourceHeight: charts.chartHeight,
      },
    });

    var canvas = document.createElement("canvas");
    canvas.height = render_height;
    canvas.width = render_height;

    var image;
    image = btoa(unescape(encodeURIComponent(svg)));

    this.chartList.push({
      name: categoryName,
      imgUrl: image,
    });
    var increment = val + 1;
    if (increment < 14) {
      this.genWord(increment);
    } else if (increment == 14) {
      this.getChartQuestions();
    }
  }

  getChartQuestions() {
    var category_code;
    for (var i = 0; i < this.tempList.length; i++) {
      if (this.tempList[i].treeLevel == 1) {
        category_code = this.tempList[i].category_code;
      }
    }
    for (var i = 0; i < this.tempList.length; i++) {
      this.category = [];
      this.categoryName = "";
      this.avg = [];
      this.treeData = [];
      if (
        this.tempList[i].treeLevel == 3 ||
        this.tempList[i].parent_category_code == category_code
      ) {
        this.categoryName = this.tempList[i].category_Name;

        for (var j = 0; j < this.tempQuesList.length; j++) {
          if (
            this.tempQuesList[j].category_Code == this.tempList[i].category_code
          ) {
            this.category.push(
              this.tempQuesList[j].survey_Question_Sequence_Number.toString() +
                " " +
                this.tempQuesList[j].question_Text
            );
            this.treeData.push([
              this.tempQuesList[j].min,
              this.tempQuesList[j].max,
            ]);
            this.avg.push([this.tempQuesList[j].avg]);
          }
        }
        var quesFound = false;
        for (var j = 0; j < this.chartList.length; j++) {
          if (this.chartList[j].name == this.categoryName) {
            quesFound = true;
            j = this.chartList.length + 1;
          }
        }
        if (quesFound == false) {
          this.genChartQuesImage(
            this.category,
            this.avg,
            this.treeData,
            this.categoryName
          );
          console.log(this.categoryName);

          i = this.tempList.length + 1;
        } else {
          i = i;
        }
      }
    }
  }

  genChartQuesImage(category, avg, treeData, categoryName) {
    var options = {
      chart: {
        inverted: true,
        // options3d: {
        //   enabled: true,
        //   alpha: 25,
        //   beta: 25,
        //   depth: 50,
        //   viewdistance: 30,
        // },
      },
      title: {
        text: "",
        style: { fontSize: "25px", color: "black" },
      },
      xAxis: {
        categories: category,
        labels: {
          style: {
            fontSize: "15px",
            color: "black",
          },
        },
      },
      yAxis: {
        gridLineColor: "#c0c0c0",
        // categories: ["", 1, 2, 3, 4, 5, ""],
        // min: 1,
        // max: 5,
        title: {
          text: ""
        },
        tickPositioner: function () {
          return [0, 1, 2, 3, 4, 5, 6];
        },
        labels: {
          style: {
            fontSize: "15px",
            color: "black",
          },
          formatter: function () {
            if (this.value != 0 && this.value != 6) {
              return this.value;
            }
          },
        },
      },
      plotOptions: {
        line: {
          marker: {
            symbol: "diamond",
            fillColor: "black",
            // "url(http://ambit-erp.southeastasia.cloudapp.azure.com:9000/assets/images/Marker2.png)",
            // "url(../../../../../assets/images/Marker2.png)",
            radius: 10,
          },
          lineWidth: 0,
          dataLabels: {
            enabled: true,
            style: {
              fontSize: "15px",
            },
          },
        },
        columnrange: {
          // borderRadius: 16,
          shadow: true,
          // dataLabels: {
          //   enabled: false,
          // },
        },
      },

      legend: {
        enabled: false,
      },
      credits: {
        enabled: false,
      },
      series: [
        {
          // stroke: "#b1b1b1",
          // strokeWidth: 2,
          borderColor: "#b1b1b1",
          name: "Categories",
          pointWidth: 30,
          color: {
            linearGradient: {
              x1: 0,
              x2: 1,
              y1: 0,
              y2: 0,
            },
            stops: [
              [0, "#727272"],
              // [0, "#1707b2"],
              // [1, "#54ffc1"],
              [1, "#f2f2f2"],
            ],
          },
          data: treeData,
          type: "columnrange",
        },
        {
          name: "Average",
          pointWidth: 0,
          data: avg,
          type: "line",
        },
      ],
    };

    var container = document.getElementById("#container");

    // var charts = Highcharts.chart("container", options);
    // var svg = charts.getSVG();
    // var data = window.btoa(svg);

    var charts = Highcharts.chart("container", options);
    var render_width = this.EXPORT_WIDTH;
    var render_height =
      (render_width * charts.chartHeight) / charts.chartWidth;
    var svg = charts.getSVG({
      exporting: {
        sourceWidth: charts.chartWidth,
        sourceHeight: charts.chartHeight,
      },
    });

    var canvas = document.createElement("canvas");
    canvas.height = render_height;
    canvas.width = render_height;

    var image;
    image = btoa(unescape(encodeURIComponent(svg)));

    this.chartList.push({
      name: categoryName,
      imgUrl: image,
    });

    if (this.chartList.length < 26) {
      this.getChartQuestions();
    } else if (this.chartList.length == 26) {
      console.log("chartlist length 26");
      this.getHighChart();
    }
  }

  getHighChart() {
    this.category = [];
    this.categoryName = "";
    this.avg = [];
    this.treeData = [];

    for (var i = 0; i < this.topQuesList.length; i++) {
      this.category.push(
        this.topQuesList[i].survey_Question_Sequence_Number.toString() +
          " " +
          this.topQuesList[i].question_Text
      );
      this.treeData.push([this.topQuesList[i].min, this.topQuesList[i].max]);
      this.avg.push([this.topQuesList[i].avg]);
    }
    this.genCharthighLowImage(
      this.category,
      this.avg,
      this.treeData,
      "Highest"
    );
  }

  getLowChart() {
    this.category = [];
    this.categoryName = "";
    this.avg = [];
    this.treeData = [];

    for (var i = 0; i < this.lowQuesList.length; i++) {
      this.category.push(
        this.lowQuesList[i].survey_Question_Sequence_Number.toString() +
          " " +
          this.lowQuesList[i].question_Text
      );
      this.treeData.push([this.lowQuesList[i].min, this.lowQuesList[i].max]);
      this.avg.push([this.lowQuesList[i].avg]);
    }
    this.genCharthighLowImage(this.category, this.avg, this.treeData, "Lowest");
  }

  genCharthighLowImage(category, avg, treeData, categoryName) {
    var options = {
      chart: {
        inverted: true,
        // options3d: {
        //   enabled: true,
        //   alpha: 25,
        //   beta: 25,
        //   depth: 50,
        //   viewdistance: 30,
        // },
      },
      title: {
        text: "",
        style: { fontSize: "25px", color: "black" },
      },
      xAxis: {
        categories: category,
        labels: {
          style: {
            fontSize: "15px",
            color: "black",
          },
        },
      },
      yAxis: {
        gridLineColor: "#c0c0c0",
        // categories: ["", 1, 2, 3, 4, 5, ""],
        // min: 1,
        // max: 5,
        title: {
          text: ""
        },
        tickPositioner: function () {
          return [0, 1, 2, 3, 4, 5, 6];
        },
        labels: {
          style: {
            fontSize: "15px",
            color: "black",
          },
          formatter: function () {
            if (this.value != 0 && this.value != 6) {
              return this.value;
            }
          },
        },
      },
      plotOptions: {
        line: {
          marker: {
            symbol: "diamond",
            fillColor: "black",
            // "url(http://ambit-erp.southeastasia.cloudapp.azure.com:9000/assets/images/Marker2.png)",
            // "url(../../../../../assets/images/Marker2.png)",
            radius: 10,
          },
          lineWidth: 0,
          dataLabels: {
            enabled: true,
            style: {
              fontSize: "15px",
            },
          },
        },
        columnrange: {
          // borderRadius: 16,
          shadow: true,
          // dataLabels: {
          //   enabled: false,
          // },
        },
      },

      legend: {
        enabled: false,
      },
      credits: {
        enabled: false,
      },
      series: [
        {
          // stroke: "#b1b1b1",
          // strokeWidth: 2,
          borderColor: "#b1b1b1",
          name: "Categories",
          pointWidth: 30,
          color: {
            linearGradient: {
              x1: 0,
              x2: 1,
              y1: 0,
              y2: 0,
            },
            stops: [
              [0, "#727272"],
              // [0, "#1707b2"],
              // [1, "#54ffc1"],
              [1, "#f2f2f2"],
            ],
          },
          data: treeData,
          type: "columnrange",
        },
        {
          name: "Average",
          pointWidth: 0,
          data: avg,
          type: "line",
        },
      ],
    };

    var container = document.getElementById("#container");

    // var charts = Highcharts.chart("container", options);
    // var svg = charts.getSVG();
    // var data = window.btoa(svg);

    var charts = Highcharts.chart("container", options);
    var render_width = this.EXPORT_WIDTH;
    var render_height =
      (render_width * charts.chartHeight) / charts.chartWidth;
    var svg = charts.getSVG({
      exporting: {
        sourceWidth: charts.chartWidth,
        sourceHeight: charts.chartHeight,
      },
    });

    var canvas = document.createElement("canvas");
    canvas.height = render_height;
    canvas.width = render_height;

    var image;
    image = btoa(unescape(encodeURIComponent(svg)));

    if (categoryName == "Highest") {
      this.chartList.push({
        name: categoryName,
        imgUrl: image,
      });

      console.log("highest chart");
      this.getLowChart();
    } else if (categoryName == "Lowest") {
      this.chartList.push({
        name: categoryName,
        imgUrl: image,
      });
      console.log("lowest chart");
      this.genReport(this.chartList);
    }
  } 

  formatDate(reqDate, type) {

    var rtnDate;
    var x = new Date(reqDate);
    var dd = x.getDate();
    var mm = x.getMonth() + 1;
    var yy = x.getFullYear();

    if(type == 'withSlash'){
      rtnDate = mm +"/" + dd +"/" + yy;
    }
    else {
      rtnDate = mm + "" + dd + "" + yy;
    }

    return rtnDate;

  }
}
