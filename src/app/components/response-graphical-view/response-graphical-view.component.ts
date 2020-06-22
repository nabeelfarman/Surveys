import { Component, OnInit } from "@angular/core";
import { Chart } from "angular-highcharts";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { TreeNode } from "../../nodeTree/TreeNode";
import { AppComponent } from "src/app/app.component";
import { ToastrManager } from "ng6-toastr-notifications";
import * as Highcharts from "highcharts";

@Component({
  selector: "app-response-graphical-view",
  templateUrl: "./response-graphical-view.component.html",
  styleUrls: ["./response-graphical-view.component.scss"],
})
export class ResponseGraphicalViewComponent implements OnInit {
  serverUrl = "http://localhost:5000/";

  childFound = false;
  Line_chart: Chart;

  questionList = [];
  tempList = [];
  menuTree: TreeNode[];
  selectedMenu: TreeNode[];

  category = [];
  treeData = [];
  data = [
    {
      label: "Wholeness",
      data: [
        {
          category_id: "301",
          parentcategory_id: "0",
          tree_level: "1",
          avg: "3.31",
        },
      ],
      children: [
        {
          label: "Meaning",
          data: [
            {
              category_id: "306",
              parentcategory_id: "301",
              tree_level: "2",
              avg: "3.1",
            },
          ],
          children: [
            {
              label: "Acceptance",
              data: [
                {
                  category_id: "319",
                  parentcategory_id: "306",
                  tree_level: "3",
                  avg: "3.2",
                },
              ],
            },
            {
              label: "Purpose",
              data: [
                {
                  category_id: "320",
                  parentcategory_id: "306",
                  tree_level: "3",
                  avg: "3.01",
                },
              ],
            },
          ],
        },
        {
          label: "Connection",
          data: [
            {
              category_id: "307",
              parentcategory_id: "301",
              tree_level: "2",
              avg: "3.52",
            },
          ],
          children: [
            {
              label: "Understanding",
              data: [
                {
                  category_id: "321",
                  parentcategory_id: "307",
                  tree_level: "3",
                  avg: "3.67",
                },
              ],
            },
            {
              label: "Caring",
              data: [
                {
                  category_id: "322",
                  parentcategory_id: "306",
                  tree_level: "3",
                  avg: "3.37",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      label: "Purposeful Action",
      data: [
        {
          category_id: "302",
          parentcategory_id: "0",
          tree_level: "1",
          avg: "3.38",
        },
      ],
      children: [
        {
          label: "Support",
          data: [
            {
              category_id: "308",
              parentcategory_id: "302",
              tree_level: "2",
              avg: "3.37",
            },
          ],
          children: [
            {
              label: "Stakeholders",
              data: [
                {
                  category_id: "323",
                  parentcategory_id: "308",
                  tree_level: "3",
                  avg: "3.47",
                },
              ],
            },
            {
              label: "Tools",
              data: [
                {
                  category_id: "324",
                  parentcategory_id: "308",
                  tree_level: "3",
                  avg: "3.27",
                },
              ],
            },
          ],
        },
        {
          label: "Waste",
          data: [
            {
              category_id: "309",
              parentcategory_id: "302",
              tree_level: "2",
              avg: "3.38",
            },
          ],
          children: [
            {
              label: "Anticipate",
              data: [
                {
                  category_id: "325",
                  parentcategory_id: "309",
                  tree_level: "3",
                  avg: "3.5",
                },
              ],
            },
            {
              label: "Remove",
              data: [
                {
                  category_id: "326",
                  parentcategory_id: "309",
                  tree_level: "3",
                  avg: "3.26",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      label: "Possibility",
      data: [
        {
          category_id: "303",
          parentcategory_id: "0",
          tree_level: "1",
          avg: "3.34",
        },
      ],
      children: [
        {
          label: "Resilience",
          data: [
            {
              category_id: "310",
              parentcategory_id: "303",
              tree_level: "2",
              avg: "3.38",
            },
          ],
          children: [
            {
              label: "Optimism",
              data: [
                {
                  category_id: "327",
                  parentcategory_id: "310",
                  tree_level: "3",
                  avg: "3.5",
                },
              ],
            },
            {
              label: "Failure",
              data: [
                {
                  category_id: "328",
                  parentcategory_id: "310",
                  tree_level: "3",
                  avg: "3.27",
                },
              ],
            },
          ],
        },
        {
          label: "Exploration",
          data: [
            {
              category_id: "311",
              parentcategory_id: "303",
              tree_level: "2",
              avg: "3.3",
            },
          ],
          children: [
            {
              label: "Experimentation",
              data: [
                {
                  category_id: "329",
                  parentcategory_id: "311",
                  tree_level: "3",
                  avg: "3.21",
                },
              ],
            },
            {
              label: "Curiosity",
              data: [
                {
                  category_id: "330",
                  parentcategory_id: "311",
                  tree_level: "3",
                  avg: "3.4",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      label: "Transparency",
      data: [
        {
          category_id: "304",
          parentcategory_id: "0",
          tree_level: "1",
          avg: "3.24",
        },
      ],
      children: [
        {
          label: "Performance",
          data: [
            {
              category_id: "312",
              parentcategory_id: "304",
              tree_level: "2",
              avg: "3.17",
            },
          ],
          children: [
            {
              label: "Individual",
              data: [
                {
                  category_id: "331",
                  parentcategory_id: "312",
                  tree_level: "3",
                  avg: "3.12",
                },
              ],
            },
            {
              label: "Team",
              data: [
                {
                  category_id: "332",
                  parentcategory_id: "312",
                  tree_level: "3",
                  avg: "3.23",
                },
              ],
            },
          ],
        },
        {
          label: "Perspective",
          data: [
            {
              category_id: "313",
              parentcategory_id: "304",
              tree_level: "2",
              avg: "3.29",
            },
          ],
          children: [
            {
              label: "Visibility",
              data: [
                {
                  category_id: "333",
                  parentcategory_id: "313",
                  tree_level: "3",
                  avg: "3.19",
                },
              ],
            },
            {
              label: "Context",
              data: [
                {
                  category_id: "334",
                  parentcategory_id: "313",
                  tree_level: "3",
                  avg: "3.4",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      label: "Team Outcomes",
      data: [
        {
          category_id: "305",
          parentcategory_id: "0",
          tree_level: "1",
          avg: "3.23",
        },
      ],
      children: [
        {
          label: "Psychological Safety",
          data: [
            {
              category_id: "314",
              parentcategory_id: "305",
              tree_level: "2",
              avg: "3.11",
            },
          ],
        },
        {
          label: "Team Identity",
          data: [
            {
              category_id: "315",
              parentcategory_id: "305",
              tree_level: "2",
              avg: "3.49",
            },
          ],
        },
        {
          label: "Exploring Differences",
          data: [
            {
              category_id: "316",
              parentcategory_id: "305",
              tree_level: "2",
              avg: "3.89",
            },
          ],
        },
        {
          label: "Innovation",
          data: [
            {
              category_id: "317",
              parentcategory_id: "305",
              tree_level: "2",
              avg: "3.18",
            },
          ],
        },
        {
          label: "Results",
          data: [
            {
              category_id: "318",
              parentcategory_id: "305",
              tree_level: "2",
              avg: "2.49",
            },
          ],
        },
      ],
    },
  ];

  constructor(
    public toastr: ToastrManager,
    private http: HttpClient,
    private app: AppComponent
  ) {}

  ngOnInit(): void {
    this.menuTree = this.data;
    this.testChart();
    this.getQuestionData();
  }

  getQuestionData() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });
    // this.app.showSpinner();

    this.http
      .get(this.serverUrl + "api/getSurveyQuestionAvg?surveyID=10", {
        headers: reqHeader,
      })
      .subscribe((data: any) => {
        this.questionList = data;
        // this.app.hideSpinner();
      });
  }

  testChart() {
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
        this.treeData = [];
        for (var i = 0; i < data.length; i++) {
          if (data[i].parent_category_code == data[0].category_code) {
            this.category.push(data[i].category_Name);
            this.treeData.push([data[i].min, data[i].max]);
          }
        }

        let chart = new Chart({
          chart: {
            type: "columnrange",
            inverted: true,
          },
          title: {
            text: "Survey Graphical View",
          },
          xAxis: {
            categories: this.category,
          },
          yAxis: {
            tickPositioner: function () {
              return [0, 1, 2, 3, 4, 5];
            },

            labels: {
              formatter: function () {
                if (this.value != 0) {
                  return this.value;
                }
              },
            },
          },
          plotOptions: {
            columnrange: {
              dataLabels: {
                enabled: true,
                borderRadius: 5,
                backgroundColor: "rgba(252, 255, 197, 0.7)",
                borderWidth: 1,
                borderColor: "#AAA",
              },
            },
          },

          legend: {
            enabled: false,
          },

          series: [
            {
              name: "Categories",
              type: "columnrange",
              data: this.treeData,
            },
          ],
        });

        this.Line_chart = chart;
        // var l = chart.addSeries[0].points.length;
        // var p = chart.addSeries[0].points[l - 1];
        // p.update({
        //   marker: {
        //     symbol: "square",
        //     fillColor: "#A0F",
        //     lineColor: "A0F0",
        //     radius: 5,
        //   },
        // });
        this.app.hideSpinner();
      });
  }

  nodeSelect(obj) {
    // alert(obj.label);
    // alert(obj.data[0].category_id);
    this.category = [];
    this.treeData = [];
    debugger;
    for (var i = 0; i < this.tempList.length; i++) {
      if (obj.data[0].parentcategory_id == 305 || obj.data[0].tree_level == 3) {
        this.childFound = true;
        i = this.tempList.length + 1;
      } else if (
        this.tempList[i].parent_category_code == obj.data[0].category_id
      ) {
        this.category.push(this.tempList[i].category_Name);
        this.treeData.push([this.tempList[i].min, this.tempList[i].max]);
      }
    }
    if (this.childFound == true) {
      for (var i = 0; i < this.questionList.length; i++) {
        if (this.questionList[i].category_Code == obj.data[0].category_id) {
          if (this)
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

    let chart = new Chart({
      chart: {
        type: "columnrange",
        inverted: true,
      },
      title: {
        text: "Survey Graphical View",
      },
      xAxis: {
        categories: this.category,
      },
      yAxis: {
        tickPositioner: function () {
          return [0, 1, 2, 3, 4, 5];
        },
        labels: {
          formatter: function () {
            if (this.value != 0) {
              return this.value;
            }
          },
        },
      },
      plotOptions: {
        columnrange: {
          dataLabels: {
            enabled: true,
            borderRadius: 5,
            backgroundColor: "rgba(252, 255, 197, 0.7)",
            borderWidth: 1,
            borderColor: "#AAA",
          },
        },
      },

      legend: {
        enabled: false,
      },

      series: [
        {
          name: "Categories",
          type: "columnrange",
          data: this.treeData,
        },
      ],
    });

    this.Line_chart = chart;
  }
}
