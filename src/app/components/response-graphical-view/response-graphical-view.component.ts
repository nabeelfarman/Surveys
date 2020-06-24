import { Component, OnInit } from "@angular/core";
import { Chart } from "angular-highcharts";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { TreeNode } from "../../nodeTree/TreeNode";
import { AppComponent } from "src/app/app.component";
import { ToastrManager } from "ng6-toastr-notifications";
import * as Highcharts from "highcharts";
import { Transform } from "stream";
import { transformAll } from "@angular/compiler/src/render3/r3_ast";

@Component({
  selector: "app-response-graphical-view",
  templateUrl: "./response-graphical-view.component.html",
  styleUrls: ["./response-graphical-view.component.scss"],
})
export class ResponseGraphicalViewComponent implements OnInit {
  serverUrl = "http://localhost:5000/";

  childFound = false;
  Line_chart: Chart;

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
    // this.menuTree = this.data;
    this.getChartData();
    this.getQuestionData();
  }

  getQuestionData() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.serverUrl + "api/getSurveyQuestionAvg?surveyID=10", {
        headers: reqHeader,
      })
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
      .get(this.serverUrl + "api/getQuestionsTreeAvg?surveyID=10", {
        headers: reqHeader,
      })
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
            this.avg.push([this.tempList[i].avg, this.tempList[i].avg]);
            this.treeData.push([data[i].min, data[i].max]);
          }
        }
        this.getColumnRangeChart(this.category, this.treeData, this.avg);
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

    this.categoryName = obj.label;
    for (var i = 0; i < this.tempList.length; i++) {
      if (obj.data[0].parentcategory_id == 305 || obj.data[0].tree_level == 3) {
        this.childFound = true;
        i = this.tempList.length + 1;
      } else if (
        this.tempList[i].parent_category_code == obj.data[0].category_id
      ) {
        this.category.push(this.tempList[i].category_Name);
        this.treeData.push([this.tempList[i].min, this.tempList[i].max]);
        this.avg.push([this.tempList[i].avg, this.tempList[i].avg]);
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
        }
      }
    }
    this.getColumnRangeChart(this.category, this.treeData, this.avg);
  }

  collapseAll() {
    // this.categoryName = "";
    var categoryID = 0;
    var catFound = false;

    for (var i = 0; i < this.tempList.length; i++) {
      if (this.tempList[i].category_Name == this.category[0]) {
        if (
          this.tempList[i].treeLevel == 3 ||
          this.tempList[i].parent_category_code == 305
        ) {
          this.toastr.errorToastr("No Further Collapse", "Error", {
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
              this.category.push(this.tempList[j].category_Name);
              this.avg.push([this.tempList[i].avg, this.tempList[i].avg]);
              this.treeData.push([this.tempList[j].min, this.tempList[j].max]);
            }
          }
        }
      }

      this.getColumnRangeChart(this.category, this.treeData, this.avg);
    } else {
      this.toastr.errorToastr("No Further Collapse", "Error", {
        toastTimeout: 2500,
      });
      return;
    }
  }

  getColumnRangeChart(category, data, avg) {
    let chart = new Chart({
      chart: {
        type: "columnrange",
        inverted: true,
        style: {
          fontFamily: "Helvetica",
        },
      },
      title: {
        text: this.categoryName + " Graphical View",
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
        columnrange: {
          borderRadius: 4,
          shadow: true,
          dataLabels: {
            enabled: true,
            shape: "triangle",
            align: "center",
            borderRadius: 5,
            style: {
              fontSize: "15px",
            },
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            borderWidth: 1,
            borderColor: "#AAA",
            formatter: function () {
              return this.y;
            },
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
          name: "Average",
          pointWidth: 30,
          color: "#A6A5A5",
          type: "columnrange",
          data: avg,
        },
        {
          name: "Categories",
          pointWidth: 30,
          color: {
            linearGradient: {
              x1: 0,
              x2: 0,
              y1: 0,
              y2: 1,
            },
            stops: [
              [0, "#3167ec"],
              [1, "#63bfff"],
              // [0, "#6a78d1"],
              // [1, "#00bda5"],
              // [0, "#003399"],
              // [1, "#05E8BA"],
              // [0, "#045de9"],
              // [1, "#087EE1"],
            ],
          },
          type: "columnrange",
          data: data,
        },
      ],
    });

    this.Line_chart = chart;
  }
}
