import { Component, OnInit } from "@angular/core";
import { Chart } from "angular-highcharts";
import { ToastrManager } from "ng6-toastr-notifications";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";
import { AppComponent } from "src/app/app.component";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { delay } from "rxjs/operators";
import { Observable, of } from "rxjs";
import * as Highcharts from "highcharts";

declare var $: any;
var imageUrl;

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  // serverUrl = "http://localhost:5010/";
  wordServerUrl = "http://localhost:12345/api/";
  //wordServerUrl = "http://ambit-erp.southeastasia.cloudapp.azure.com:9051/api/";
  serverUrl = "http://ambit-erp.southeastasia.cloudapp.azure.com:9050/";
  path = "../../../assets/documents/Author.docx";

  EXPORT_WIDTH = 1000;

  Line_chart: Chart;

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

  constructor(
    public toastr: ToastrManager,
    private http: HttpClient,
    private app: AppComponent,
    private router: Router,
    private cookie: CookieService
  ) {}

  ngOnInit(): void {
    this.getChart();
    // this.getChartQuestion();
    // this.getHighQuesChart();
    // this.getLowQuesChart();
  }

  logout() {
    this.app.Logout();
  }

  getChartQuestion() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });
    // this.app.showSpinner();
    this.http
      .get(
        "http://ambit-erp.southeastasia.cloudapp.azure.com:9049/api/getSurveyQuestionAvg?surveyID=34&surveyDate=7-1-2020&clientID=7&teamID=18",
        { headers: reqHeader }
      )
      .subscribe((data: any) => {
        this.tempQuesList = data;
        // this.app.hideSpinner();
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
        "http://ambit-erp.southeastasia.cloudapp.azure.com:9049//api/getHighQuestionsTreeAvg?surveyID=34&surveyDate=7-1-2020&clientID=7&teamID=18",
        {
          headers: reqHeader,
        }
      )
      .subscribe((data: any) => {
        this.topQuesList = data;

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
        "http://ambit-erp.southeastasia.cloudapp.azure.com:9049/api/getLowQuestionsTreeAvg?surveyID=34&surveyDate=7-1-2020&clientID=7&teamID=18",
        {
          headers: reqHeader,
        }
      )
      .subscribe((data: any) => {
        this.lowQuesList = data;

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
        "http://ambit-erp.southeastasia.cloudapp.azure.com:9049/api/getQuestionsTreeAvg?surveyID=34&surveyDate=7-1-2020&clientID=7&teamID=18",
        {
          headers: reqHeader,
        }
      )
      .subscribe((data: any) => {
        this.tempList = data;

        this.app.hideSpinner();
      });
  }

  genWord(val) {
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

    var container = document.getElementById("#container");

    // var charts = Highcharts.chart("container", options);
    // var svg = charts.getSVG();
    // var data = window.btoa(svg);

    var charts = Highcharts.chart("container", options);
    var render_width = this.EXPORT_WIDTH;
    var render_height = (render_width * charts.chartHeight) / charts.chartWidth;
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


    console.log(svg);
    var chartList = [];
    for (var i = 0; i < 1; i++) {
      chartList.push({
        name: "Energy",
        imgUrl: image,
      });
    }
    // var imageURL = "";
    // var dataString = "type=image/jpeg&filename=results&width=500&svg=" + svg;
    // $.ajax({
    //   type: "POST",
    //   data: dataString,
    //   url: "../../../../src/assets/images/temp/",
    //   async: false,
    //   success: function (data) {
    //     imageURL = data;
    //     console.log(imageURL);
    //   },
    // });
    // return;
    if (chartList.length == 1) {
      this.genReport(chartList);
    }
  }

  genReport(chartsList) {
    // alert("ok");
    var reqData = {
      images: JSON.stringify(chartsList),
      Consultant_ID: "1",
      Survey_ID: "34",
      Survey_Date: "7-5-2020",
      Client_ID: "7",
      Team_ID: "18",
      name: "T1",
      NoOfRespondents: "6",
    };

    this.app.showSpinner();
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .post(this.wordServerUrl + "genReport", reqData, { headers: reqHeader })
      .subscribe((data: any) => {
        //this.http.get(this.wordServerUrl + "getSurveys", { headers: reqHeader }).subscribe((data: any) => {

        this.app.hideSpinner();
        if (data.msg != "Success") {
          this.toastr.errorToastr(data.msg, "Error", { toastTimeout: 2500 });
        } else {
          this.toastr.successToastr(data.msg, "Success", {
            toastTimeout: 2500,
          });
          this.app.hideSpinner();
        }

        this.app.hideSpinner();
      });
  }

  convertChartImage() {
    // var elm = document.getElementById("#element");
    var svgSize;
    var canvas = <HTMLCanvasElement>document.createElement("element");
    canvas.width = svgSize.width("400");
    canvas.height = svgSize.height("400");
    var ctx = canvas.getContext("2d");

    var img = document.createElement("img");
    // img.setAttribute(
    //   "src",
    //   "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)))
    // );
    img.onload = function () {
      ctx.drawImage(img, 0, 0);
      window.open(canvas.toDataURL("image/png"));
    };

    // domtoimage
    //   .toPng(newCandidatesTable)
    //   .then(function (dataUrl) {
    //     var img = new Image();
    //     img.src = dataUrl;
    //     (<HTMLImageElement>document.querySelector("#preview")).src = dataUrl;

    //     document.body.appendChild(img);
    //   })
    // .catch(function (error) {
    //   console.error("oops, something went wrong!", error);
    // });
    // var lebar ="400";
    // var tinggi ="400";
    // html2canvas(elm, {
    //   logging: true,
    //   allowTaint: false,
    //   useCORS: true,
    // }).then(function (canvas) {
    //   var img = canvas.toDataURL("image/png");
    //   (<HTMLImageElement>document.querySelector("#preview")).src = img;
    // });
    // var myCanvas = <HTMLCanvasElement>document.getElementById("#preview");
    // var ctx = document.getElementById("2d");
    // const dataURI = myCanvas.toDataURL("image/jpeg");
    // console.log(dataURI);
  }

  pushImageData(name, url, val) {
    // alert(name);
    // alert(url);
    if (url != undefined) {
      this.chartList.push({
        name: name,
        imgUrl: url,
      });
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

      (<HTMLImageElement>document.querySelector("#imageTag")).src = imageUrl;

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

      // this.getChartData(this.chartList);
      // this.getHighChart();
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

      (<HTMLImageElement>document.querySelector("#imageTag")).src = imageUrl;

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

        for (var i = 0; i < this.chartList.length; i++) {
          alert(this.chartList[i].name + " - " + this.chartList[i].imgUrl);
        }
      }
    }
  }

  getChartData(imageList) {
    // alert(imageUrl);
    var savePath = "../../shared/img";
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.serverUrl + "api/createWordDocument?image=" + imageList, {
        headers: reqHeader,
      })
      .subscribe((data: any) => {
        alert(data);
        return;
      });
  }
}
