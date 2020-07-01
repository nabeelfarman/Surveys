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

declare var $: any;
var imageUrl;

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  serverUrl = "http://localhost:5010/";
  path = "../../../assets/documents/Author.docx";

  EXPORT_WIDTH = 1000;

  Line_chart: Chart;

  categoryName = "";
  questionList = [];
  tempList = [];
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
    this.getChartQuestion();
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
      .get("http://localhost:5000/api/getSurveyQuestionAvg?surveyID=10", {
        headers: reqHeader,
      })
      .subscribe((data: any) => {
        this.tempQuesList = data;
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
      .get("http://localhost:5000/api/getQuestionsTreeAvg?surveyID=10", {
        headers: reqHeader,
      })
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

    setTimeout(() => this.pushImageData(categoryName, imageUrl, val), 900);
  }

  pushImageData(name, url, val) {
    this.chartList.push({
      name: name,
      imgUrl: url,
    });

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
    for (var i = 0; i < this.tempList.length; i++) {
      this.category = [];
      this.categoryName = "";
      this.avg = [];
      this.treeData = [];

      if (
        this.tempList[i].treeLevel == 3 ||
        this.tempList[i].parent_category_code == 305
      ) {
        this.categoryName = this.tempList[i].category_Name;
        // alert(
        //   this.tempList[i].category_code +
        //     " - " +
        //     this.tempList[i].category_Name
        // );

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
    this.chartList.push({
      name: categoryName,
      imgUrl: imageUrl,
    });
    // alert(val);
    setTimeout(() => this.getChartQuestions(), 500);

    if (this.chartList.length > 25) {
      this.getChartData(this.chartList);
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
