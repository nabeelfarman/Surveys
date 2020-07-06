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
var imageUrl;

@Component({
  selector: "app-import-survey-result",
  templateUrl: "./import-survey-result.component.html",
  styleUrls: ["./import-survey-result.component.scss"],
})
export class ImportSurveyResultComponent implements OnInit {
  // wordServerUrl = "http://ambit-erp.southeastasia.cloudapp.azure.com:9051/api/";
  wordServerUrl = "http://localhost:5099/api/";
  serverUrl = "http://ambit-erp.southeastasia.cloudapp.azure.com:9050/api/";

  tempData = [];
  summaryData = [];
  detailData = [];
  surveyData = [];

  txtSearchSurvey = "";
  surveyDate = "";
  filePicker = "";
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

  constructor(
    public toastr: ToastrManager,
    private http: HttpClient,
    private app: AppComponent,
    private router: Router,
    private cookie: CookieService
  ) {}

  ngOnInit(): void {
    this.surveyDate = new Date().toISOString().split("T")[0];
    // this.getSurveys();
    // this.getChart();
    // this.getChartQuestion();
    // this.getHighQuesChart();
    // this.getLowQuesChart();
  }

  //function for get surveys data
  getSurveys() {
    this.app.showSpinner();
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .get(this.serverUrl + "getSurveys", { headers: reqHeader })
      .subscribe((data: any) => {
        this.surveyData = data;
        this.app.hideSpinner();
      });
  }

  genReport(chartsList) {
    alert("ok");
    var reqData = {
      images: JSON.stringify(chartsList),
      Consultant_ID: "1",
      Survey_ID: "34",
      Survey_Date: "2020-07-01",
      Client_ID: "7",
      Team_ID: "18",
    };

    this.app.showSpinner();
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .post(this.wordServerUrl + "genReport", reqData, { headers: reqHeader })
      .subscribe((data: any) => {
        //this.http.get(this.wordServerUrl + "getSurveys", { headers: reqHeader }).subscribe((data: any) => {

        this.app.hideSpinner();
        if (data.msg != "Success") {
          this.toastr.successToastr(data.msg, "Error", { toastTimeout: 2500 });
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
          this.toastr.errorToastr(data.msg, "Success", { toastTimeout: 2500 });
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
    this.surveyDt = "7/1/2020";

    // alert(this.clientID + " - " + this.teamID + " - " + this.surveyDt + " - ");

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
        "http://ambit-erp.southeastasia.cloudapp.azure.com:9049/api/getSurveyQuestionAvg?surveyID=34&surveyDate=" +
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
        // this.app.hideSpinner();
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
        "http://ambit-erp.southeastasia.cloudapp.azure.com:9049/api/getQuestionsTreeAvg?surveyID=34&surveyDate=" +
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
        this.app.hideSpinner();
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
        "http://ambit-erp.southeastasia.cloudapp.azure.com:9049/api/getHighQuestionsTreeAvg?surveyID=34&surveyDate=" +
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
        "http://ambit-erp.southeastasia.cloudapp.azure.com:9049/api/getLowQuestionsTreeAvg?surveyID=34&surveyDate=" +
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

      this.getSurveys();
      return false;
      this.http
        .post(this.serverUrl + "uploadFile", saveData, { headers: reqHeader })
        .subscribe((data: any) => {
          if (data.msgT == "Team Success" && data.msgA == "Answer Success") {
            this.app.hideSpinner();
            this.toastr.successToastr("Record Save Successfully!", "Success!", {
              toastTimeout: 2500,
            });
            //this.toastr.errorToastr(data.msgT, "Error!", { toastTimeout: 5000 });
            //this.toastr.errorToastr(data.msgA, "Error!", { toastTimeout: 5000 });
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
        text: categoryName,
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
        gridLineColor: "#A6A5A5",
        categories: ["", 1, 2, 3, 4, 5, ""],
        min: 1,
        max: 5,
        // tickPositioner: function () {
        //   return [0, 1, 2, 3, 4, 5, 6];
        // },
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
            symbol:
              "url(http://ambit-erp.southeastasia.cloudapp.azure.com:9000/assets/images/Marker2.png)",
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
          borderRadius: 16,
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
          name: "Categories",
          pointWidth: 32,
          color: {
            linearGradient: {
              x1: 0,
              x2: 0,
              y1: 0,
              y2: 1,
            },
            stops: [
              [0, "#1707b2"],
              [1, "#54ffc1"],
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

    var datas = {
      // type: "POST",
      options: JSON.stringify(options),
      filename: "test.png",
      type: "image/png",
      async: true,
    };

    var exportUrl = "https://export.highcharts.com/";
    $.post(exportUrl, datas, function (datas) {
      imageUrl = exportUrl + datas;
      var urlCreator = window.URL || window.webkitURL;

      // (<HTMLImageElement>document.querySelector("#imageTag")).src = imageUrl;

      fetch(imageUrl)
        .then((response) => response.blob())
        .then((datas) => {
          // You have access to chart data here
          // console.log(datas);
        });
    });

    setTimeout(() => this.pushImageData(categoryName, imageUrl, val), 900);
  }

  pushImageData(name, url, val) {
    if (url != undefined) {
      var chartFound = false;
      for (var i = 0; i < this.chartList.length; i++) {
        if (this.chartList[i].imgUrl == imageUrl) {
          // alert(found);
          // alert(this.chartList[i].name + " - " + categoryName);
          chartFound = true;
          i = this.chartList.length + 1;
        }
      }
      if (chartFound == false) {
        this.chartList.push({
          name: name,
          imgUrl: url,
        });
      }
    }

    var increment = val + 1;
    if (increment < 14) {
      this.genWord(increment);
    } else if (increment == 14) {
      this.getChartQuestions();
    }

    // this.getChartQuestions();

    // setInterval(() => this.getChartData(), 1000);
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
      // alert(category_code);
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
            this.categoryName,
            i
          );

          i = this.tempList.length + 1;
        } else {
          // alert(i);
          i = i;
        }
      }
    }
  }

  genChartQuesImage(category, avg, treeData, categoryName, val) {
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
        text: categoryName,
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
        gridLineColor: "#A6A5A5",
        categories: ["", 1, 2, 3, 4, 5, ""],
        min: 1,
        max: 5,
        // tickPositioner: function () {
        //   return [0, 1, 2, 3, 4, 5, 6];
        // },
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
            symbol:
              "url(http://ambit-erp.southeastasia.cloudapp.azure.com:9000/assets/images/Marker2.png)",
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
          borderRadius: 16,
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
          name: "Categories",
          pointWidth: 32,
          color: {
            linearGradient: {
              x1: 0,
              x2: 0,
              y1: 0,
              y2: 1,
            },
            stops: [
              [0, "#1707b2"],
              [1, "#54ffc1"],
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

    var datas = {
      // type: "POST",
      options: JSON.stringify(options),
      filename: "test.png",
      type: "image/png",
      async: true,
    };

    var exportUrl = "https://export.highcharts.com/";
    $.post(exportUrl, datas, function (datas) {
      imageUrl = exportUrl + datas;
      var urlCreator = window.URL || window.webkitURL;

      // (<HTMLImageElement>document.querySelector("#imageTag")).src = imageUrl;

      fetch(imageUrl)
        .then((response) => response.blob())
        .then((datas) => {
          // You have access to chart data here
          // console.log(datas);
        });
    });

    setTimeout(() => this.pushImageQuesData(categoryName, imageUrl, val), 1000);
  }

  pushImageQuesData(categoryName, imageUrl, val) {
    var found = false;
    for (var i = 0; i < this.chartList.length; i++) {
      // alert(this.chartList[i].imgUrl + " - " + imageUrl);
      if (this.chartList[i].imgUrl == imageUrl) {
        // alert(found);
        // alert(this.chartList[i].name + " - " + categoryName);
        found = true;
        i = this.chartList.length + 1;
      }
    }
    if (found == false) {
      this.chartList.push({
        name: categoryName,
        imgUrl: imageUrl,
      });
    }
    // alert(val);
    setTimeout(() => this.getChartQuestions(), 500);

    if (this.chartList.length == 26) {
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
        text: categoryName,
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
        gridLineColor: "#A6A5A5",
        categories: ["", 1, 2, 3, 4, 5, ""],
        min: 1,
        max: 5,
        // tickPositioner: function () {
        //   return [0, 1, 2, 3, 4, 5, 6];
        // },
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
            symbol:
              "url(http://ambit-erp.southeastasia.cloudapp.azure.com:9000/assets/images/Marker2.png)",
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
          borderRadius: 16,
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
          name: "Categories",
          pointWidth: 32,
          color: {
            linearGradient: {
              x1: 0,
              x2: 0,
              y1: 0,
              y2: 1,
            },
            stops: [
              [0, "#1707b2"],
              [1, "#54ffc1"],
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

    var datas = {
      // type: "POST",
      options: JSON.stringify(options),
      filename: "test.png",
      type: "image/png",
      async: true,
    };

    var exportUrl = "https://export.highcharts.com/";
    $.post(exportUrl, datas, function (datas) {
      imageUrl = exportUrl + datas;
      var urlCreator = window.URL || window.webkitURL;

      // (<HTMLImageElement>document.querySelector("#imageTag")).src = imageUrl;

      fetch(imageUrl)
        .then((response) => response.blob())
        .then((datas) => {
          // You have access to chart data here
          // console.log(datas);
        });
    });

    setTimeout(() => this.pushHighImageQuesData(categoryName, imageUrl), 1000);
  }

  pushHighImageQuesData(catName, url) {
    if (url != undefined) {
      var chartFound = false;
      for (var i = 0; i < this.chartList.length; i++) {
        if (this.chartList[i].imgUrl == url) {
          chartFound = true;
          i = this.chartList.length + 1;
        }
      }
      if (catName == "Highest") {
        if (chartFound == false) {
          this.chartList.push({
            name: catName,
            imgUrl: url,
          });
          setTimeout(() => this.getLowChart(), 500);
        } else {
          setTimeout(() => this.getHighQuesChart(), 500);
        }
      } else if (catName == "Lowest") {
        if (chartFound == false) {
          this.chartList.push({
            name: catName,
            imgUrl: url,
          });
        } else {
          setTimeout(() => this.getLowChart(), 500);
        }
      }
      if (this.chartList.length > 27) {
        this.genReport(this.chartList);
        // alert("ok");

        // for (var i = 0; i < this.chartList.length; i++) {
        //   alert(this.chartList[i].name + " - " + this.chartList[i].imgUrl);
        // }
      }
    }
  }
}
