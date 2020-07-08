import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { Chart } from "angular-highcharts";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { TreeNode } from "../../nodeTree/TreeNode";
import { AppComponent } from "src/app/app.component";
import { ToastrManager } from "ng6-toastr-notifications";
//import html2canvas from "html2canvas";
import * as Highcharts from "highcharts";
import { Transform } from "stream";
import { transformAll } from "@angular/compiler/src/render3/r3_ast";

declare var $: any;
@Component({
  selector: "app-response-graphical-view",
  templateUrl: "./response-graphical-view.component.html",
  styleUrls: ["./response-graphical-view.component.scss"],
})
export class ResponseGraphicalViewComponent implements OnInit {
  //serverUrl = "http://localhost:5000/";
  serverUrl = "http://ambit-erp.southeastasia.cloudapp.azure.com:9049/";
  markerPath = "../../../assets/images/Marker.png";

  // @ViewChild("image") image: ElementRef;
  // @ViewChild("canvas") canvas: ElementRef;
  // @ViewChild("downloadLink") downloadLink: ElementRef;

  childFound = false;
  Line_chart: Chart;
  Line_chart_3d: Chart;
  allow3D = false;

  alphaAngle = "";
  betaAngle = "";
  depthAngle = "";

  categoryName = "";
  questionList = [];
  tempList = [];
  menuTree: TreeNode[];
  selectedMenu: TreeNode[];

  category = [];
  avg = [];
  treeData = [];

  constructor(
    public toastr: ToastrManager,
    private http: HttpClient,
    private app: AppComponent
  ) {}

  ngOnInit(): void {
    this.getChartData();
    this.getQuestionData();
  }

  getQuestionData() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(
        this.serverUrl +
          "api/getSurveyQuestionAvg?surveyID=38&surveyDate=7/8/2020&clientID=7&teamID=18",
        {
          headers: reqHeader,
        }
      )
      .subscribe((data: any) => {
        this.questionList = data;
      });
  }

  getChartData() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });
    this.app.showSpinner();
    this.http
      .get(
        this.serverUrl +
          "api/getQuestionsTreeAvg?surveyID=38&surveyDate=7/8/2020&clientID=7&teamID=18",
        {
          headers: reqHeader,
        }
      )
      .subscribe((data: any) => {
        this.tempList = data;

        this.category = [];
        this.categoryName = "";
        this.avg = [];
        this.treeData = [];
        this.categoryName = data[0].category_Name;
        for (var i = 0; i < data.length; i++) {
          if (data[i].parent_category_code == data[0].category_code) {
            this.category.push(data[i].category_Name);
            this.avg.push([data[i].avg]);
            this.treeData.push([data[i].min, data[i].max]);
          }
        }
        this.getColumnRangeChart(this.category, this.treeData, this.avg);
        this.get3DColumnRangeChart(this.category, this.treeData, this.avg);

        this.getTreeData(this.tempList);
        this.app.hideSpinner();
      });
  }

  getTreeData(obj) {
    this.menuTree = [];
    var menuList = [];
    var menuFstChild = [];
    var menuSndChild = [];

    for (var i = 0; i < obj.length; i++) {
      if (obj[i].treeLevel == 1) {
        menuFstChild = [];
        for (var j = 0; j < obj.length; j++) {
          if (
            obj[j].treeLevel == 2 &&
            obj[j].parent_category_code == obj[i].category_code
          ) {
            menuSndChild = [];
            for (var k = 0; k < obj.length; k++) {
              if (
                obj[k].treeLevel == 3 &&
                obj[k].parent_category_code == obj[j].category_code
              ) {
                menuSndChild.push({
                  label: obj[k].category_Name,
                  data: [
                    {
                      category_id: obj[k].category_code,
                      parentcategory_id: obj[k].parent_category_code,
                      tree_level: obj[k].treeLevel,
                      avg: obj[k].avg,
                    },
                  ],
                });
              }
            }
            menuFstChild.push({
              label: obj[j].category_Name,
              data: [
                {
                  category_id: obj[j].category_code,
                  parentcategory_id: obj[j].parent_category_code,
                  tree_level: obj[j].treeLevel,
                  avg: obj[j].avg,
                },
              ],
              children: menuSndChild,
            });
          }
        }

        menuList.push({
          label: obj[i].category_Name,
          data: [
            {
              category_id: obj[i].category_code,
              parentcategory_id: obj[i].parent_category_code,
              tree_level: obj[i].treeLevel,
              avg: obj[i].avg,
            },
          ],
          children: menuFstChild,
        });
      }
    }

    this.menuTree = menuList;
  }

  nodeSelect(obj) {
    this.categoryName = "";
    this.category = [];
    this.avg = [];
    this.treeData = [];
    var category_code;
    for (var i = 0; i < this.tempList.length; i++) {
      if (this.tempList[i].treeLevel == 1) {
        category_code = this.tempList[i].category_code;
      }
    }
    this.categoryName = obj.label;
    for (var i = 0; i < this.tempList.length; i++) {
      if (
        obj.data[0].parentcategory_id == category_code ||
        obj.data[0].tree_level == 3
      ) {
        this.childFound = true;
        i = this.tempList.length + 1;
      } else if (
        this.tempList[i].parent_category_code == obj.data[0].category_id
      ) {
        this.category.push(this.tempList[i].category_Name);
        this.treeData.push([this.tempList[i].min, this.tempList[i].max]);
        this.avg.push([this.tempList[i].avg]);
      }
    }
    if (this.childFound == true) {
      for (var i = 0; i < this.questionList.length; i++) {
        if (this.questionList[i].category_Code == obj.data[0].category_id) {
          this.categoryName = obj.label;
          this.category.push(
            this.questionList[i].survey_Question_Sequence_Number.toString() +
              " " +
              this.questionList[i].question_Text
          );
          this.treeData.push([
            this.questionList[i].min,
            this.questionList[i].max,
          ]);
          this.avg.push([this.questionList[i].avg]);
        }
      }
    }
    this.getColumnRangeChart(this.category, this.treeData, this.avg);
    this.get3DColumnRangeChart(this.category, this.treeData, this.avg);
  }

  collapseAll() {
    // this.categoryName = "";
    var categoryID = 0;
    var catFound = false;

    for (var i = 0; i < this.tempList.length; i++) {
      if (this.tempList[i].category_Name == this.category[0]) {
        if (
          this.tempList[i].treeLevel == 3 ||
          this.tempList[i].parent_category_code == 747
        ) {
          this.toastr.errorToastr("No Further Expand", "Error", {
            toastTimeout: 2500,
          });
          return;
        } else {
          categoryID = this.tempList[i].parent_category_code;
          i = this.tempList.length + 1;
          catFound = true;
        }
      }
    }

    if (catFound == true) {
      this.category = [];
      this.avg = [];
      this.treeData = [];
      for (var i = 0; i < this.tempList.length; i++) {
        if (this.tempList[i].parent_category_code == categoryID) {
          for (var j = 0; j < this.tempList.length; j++) {
            if (
              this.tempList[j].parent_category_code ==
              this.tempList[i].category_code
            ) {
              if (this.category.length == 0) {
                this.category.push(this.tempList[j].category_Name);
                this.avg.push([this.tempList[j].avg]);
                this.treeData.push([
                  this.tempList[j].min,
                  this.tempList[j].max,
                ]);
              } else {
                var categoryFound = false;
                for (var l = 0; l < this.category.length; l++) {
                  if (this.category[l] == this.tempList[j].category_Name) {
                    categoryFound = true;
                    l = this.category.length + 1;
                  }
                }
                if (categoryFound == false) {
                  this.category.push(this.tempList[j].category_Name);
                  this.avg.push([this.tempList[j].avg]);
                  this.treeData.push([
                    this.tempList[j].min,
                    this.tempList[j].max,
                  ]);
                }
              }
            }
          }
        }
      }

      this.getColumnRangeChart(this.category, this.treeData, this.avg);
      this.get3DColumnRangeChart(this.category, this.treeData, this.avg);
    } else {
      this.toastr.errorToastr("No Further Expand", "Error", {
        toastTimeout: 2500,
      });
      return;
    }
  }

  getColumnRangeChart(category, data, avg) {
    let chartData = new Chart({
      chart: {
        type: "columnrange",
        inverted: true,
        backgroundColor: "transparent",
        style: {
          fontFamily: "Helvetica",
        },
      },
      exporting: {
        // enabled: true,
      },
      title: {
        text: this.categoryName,
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
            radius: 10,
            // symbol:
            //   "url(http://ambit-erp.southeastasia.cloudapp.azure.com:9000/assets/images/Marker2.png)",
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
          dataLabels: {
            enabled: false,
            // shape: "triangle",
            // verticalAlign: "bottom",
            // align: "center",
            // style: {
            //   fontSize: "15px",
            // },
            // backgroundColor: "rgba(255, 255, 255, 0.7)",
            // borderWidth: 1,
            // borderColor: "#AAA",
            // formatter: function () {
            //   for (var i = 0; i < avg.length; i++) {
            //     if (this.y == avg[i][0]) {
            //       return this.y;
            //     }
            //   }
            // },
          },
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
          type: "columnrange",
          data: data,
        },
        {
          name: "Average",
          pointWidth: 0,

          // color: "#A6A5A5",
          type: "line",
          data: avg,
        },
      ],
    });

    this.Line_chart = chartData;
  }

  get3DColumnRangeChart(category, data, avg) {
    let chartData = new Chart({
      chart: {
        type: "columnrange",
        inverted: true,
        backgroundColor: "transparent",
        style: {
          fontFamily: "Helvetica",
        },
        options3d: {
          enabled: true,
          alpha: 25,
          beta: 25,
          depth: 50,
        },
      },
      exporting: {
        // enabled: true,
        // buttons: {
        //   contextButton: {
        //     menuItems: null,
        //     onclick: function () {
        //       this.exportChart();
        //     },
        //   },
        // },
      },
      title: {
        text: this.categoryName,
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
            radius: 10,
            // symbol:
            //   "url(http://ambit-erp.southeastasia.cloudapp.azure.com:9000/assets/images/Marker2.png)",
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
          dataLabels: {
            enabled: false,
            // shape: "triangle",
            // verticalAlign: "bottom",
            // align: "center",
            // style: {
            //   fontSize: "15px",
            // },
            // backgroundColor: "rgba(255, 255, 255, 0.7)",
            // borderWidth: 1,
            // borderColor: "#AAA",
            // formatter: function () {
            //   for (var i = 0; i < avg.length; i++) {
            //     if (this.y == avg[i][0]) {
            //       return this.y;
            //     }
            //   }
            // },
          },
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
          type: "columnrange",
          data: data,
        },
        {
          name: "Average",
          pointWidth: 0,

          // color: "#A6A5A5",
          type: "line",
          data: avg,
        },
      ],
    });

    this.Line_chart_3d = chartData;
  }
}
