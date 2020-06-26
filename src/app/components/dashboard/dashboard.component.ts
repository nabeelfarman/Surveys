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

declare var $: any;

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
  // tempList = [
  //   {
  //     category_code: 1,
  //     parent_category_code: 0,
  //     category_Name: "Wholeness",
  //     survey_ID: 1,
  //     treePath: "Wholeness",
  //     avg: 3.2,
  //     amountIncludingChildren: 0,
  //     treeLevel: 1,
  //     min: 3.1,
  //     max: 3.5,
  //   },
  //   {
  //     category_code: 2,
  //     parent_category_code: 0,
  //     category_Name: "Purposeful Action",
  //     survey_ID: 1,
  //     treePath: "Purposeful Action",
  //     avg: 3.1,
  //     amountIncludingChildren: 0,
  //     treeLevel: 1,
  //     min: 3.01,
  //     max: 3.2,
  //   },
  //   {
  //     category_code: 3,
  //     parent_category_code: 0,
  //     category_Name: "Possibility",
  //     survey_ID: 1,
  //     treePath: "Possibility",
  //     avg: 3.37,
  //     amountIncludingChildren: 0,
  //     treeLevel: 1,
  //     min: 3.2,
  //     max: 3.7,
  //   },
  //   {
  //     category_code: 4,
  //     parent_category_code: 0,
  //     category_Name: "Transparency",
  //     survey_ID: 1,
  //     treePath: "Transparency",
  //     avg: 3.1,
  //     amountIncludingChildren: 0,
  //     treeLevel: 1,
  //     min: 3,
  //     max: 3.5,
  //   },
  //   {
  //     category_code: 5,
  //     parent_category_code: 1,
  //     category_Name: "Acceptance",
  //     survey_ID: 1,
  //     treePath: "Wholeness -> Acceptance",
  //     avg: 3.4,
  //     amountIncludingChildren: 0,
  //     treeLevel: 2,
  //     min: 3.2,
  //     max: 3.8,
  //   },
  //   {
  //     category_code: 6,
  //     parent_category_code: 1,
  //     category_Name: "Purpose",
  //     survey_ID: 1,
  //     treePath: "Wholeness -> Purpose",
  //     avg: 3.1,
  //     amountIncludingChildren: 0,
  //     treeLevel: 2,
  //     min: 2.8,
  //     max: 3.4,
  //   },
  //   {
  //     category_code: 7,
  //     parent_category_code: 1,
  //     category_Name: "Understanding",
  //     survey_ID: 1,
  //     treePath: "Wholeness -> Understanding",
  //     avg: 2.9,
  //     amountIncludingChildren: 0,
  //     treeLevel: 2,
  //     min: 2.4,
  //     max: 3.4,
  //   },
  //   {
  //     category_code: 8,
  //     parent_category_code: 1,
  //     category_Name: "Caring",
  //     survey_ID: 1,
  //     treePath: "Wholeness -> Caring",
  //     avg: 2.7,
  //     amountIncludingChildren: 0,
  //     treeLevel: 2,
  //     min: 2.1,
  //     max: 3.4,
  //   },
  //   {
  //     category_code: 9,
  //     parent_category_code: 2,
  //     category_Name: "Stakeholders",
  //     survey_ID: 1,
  //     treePath: "Purposeful Action -> Stakeholders",
  //     avg: 3.1,
  //     amountIncludingChildren: 0,
  //     treeLevel: 2,
  //     min: 2.4,
  //     max: 3.2,
  //   },
  //   {
  //     category_code: 10,
  //     parent_category_code: 2,
  //     category_Name: "Tools",
  //     survey_ID: 1,
  //     treePath: "Purposeful Action -> Tools",
  //     avg: 3.2,
  //     amountIncludingChildren: 0,
  //     treeLevel: 2,
  //     min: 2.8,
  //     max: 3.34,
  //   },
  //   {
  //     category_code: 11,
  //     parent_category_code: 2,
  //     category_Name: "Anticipate",
  //     survey_ID: 1,
  //     treePath: "Purposeful Action -> Anticipate",
  //     avg: 3.01,
  //     amountIncludingChildren: 0,
  //     treeLevel: 2,
  //     min: 2.9,
  //     max: 3.5,
  //   },
  //   {
  //     category_code: 12,
  //     parent_category_code: 2,
  //     category_Name: "Remove",
  //     survey_ID: 1,
  //     treePath: "Purposeful Action -> Remove",
  //     avg: 3.2,
  //     amountIncludingChildren: 0,
  //     treeLevel: 2,
  //     min: 2.4,
  //     max: 3.45,
  //   },
  //   {
  //     category_code: 13,
  //     parent_category_code: 3,
  //     category_Name: "Optimism",
  //     survey_ID: 1,
  //     treePath: "Possibility -> Optimism",
  //     avg: 3.1,
  //     amountIncludingChildren: 0,
  //     treeLevel: 2,
  //     min: 2.56,
  //     max: 3.34,
  //   },
  //   {
  //     category_code: 14,
  //     parent_category_code: 3,
  //     category_Name: "Failure",
  //     survey_ID: 1,
  //     treePath: "Possibility -> Failure",
  //     avg: 0,
  //     amountIncludingChildren: 0,
  //     treeLevel: 2,
  //     min: 0,
  //     max: 0,
  //   },
  //   {
  //     category_code: 15,
  //     parent_category_code: 3,
  //     category_Name: "Experimentation",
  //     survey_ID: 1,
  //     treePath: "Possibility -> Experimentation",
  //     avg: 0,
  //     amountIncludingChildren: 0,
  //     treeLevel: 2,
  //     min: 0,
  //     max: 0,
  //   },
  //   {
  //     category_code: 16,
  //     parent_category_code: 3,
  //     category_Name: "Curiosity",
  //     survey_ID: 1,
  //     treePath: "Possibility -> Curiosity",
  //     avg: 0,
  //     amountIncludingChildren: 0,
  //     treeLevel: 2,
  //     min: 0,
  //     max: 0,
  //   },
  //   {
  //     category_code: 17,
  //     parent_category_code: 4,
  //     category_Name: "Individual",
  //     survey_ID: 1,
  //     treePath: "Transparency -> Individual",
  //     avg: 0,
  //     amountIncludingChildren: 0,
  //     treeLevel: 2,
  //     min: 0,
  //     max: 0,
  //   },
  //   {
  //     category_code: 18,
  //     parent_category_code: 4,
  //     category_Name: "Team",
  //     survey_ID: 1,
  //     treePath: "Transparency -> Team",
  //     avg: 0,
  //     amountIncludingChildren: 0,
  //     treeLevel: 2,
  //     min: 0,
  //     max: 0,
  //   },
  //   {
  //     category_code: 19,
  //     parent_category_code: 4,
  //     category_Name: "Visibility",
  //     survey_ID: 1,
  //     treePath: "Transparency -> Visibility",
  //     avg: 0,
  //     amountIncludingChildren: 0,
  //     treeLevel: 2,
  //     min: 0,
  //     max: 0,
  //   },
  //   {
  //     category_code: 20,
  //     parent_category_code: 4,
  //     category_Name: "Context",
  //     survey_ID: 1,
  //     treePath: "Transparency -> Context",
  //     avg: 0,
  //     amountIncludingChildren: 0,
  //     treeLevel: 2,
  //     min: 0,
  //     max: 0,
  //   },
  //   {
  //     category_code: 21,
  //     parent_category_code: 0,
  //     category_Name: "Team Outcomes",
  //     survey_ID: 1,
  //     treePath: "Team Outcomes",
  //     avg: 0,
  //     amountIncludingChildren: 0,
  //     treeLevel: 1,
  //     min: 0,
  //     max: 0,
  //   },
  //   {
  //     category_code: 22,
  //     parent_category_code: 21,
  //     category_Name: "Psychological Safety",
  //     survey_ID: 1,
  //     treePath: "Team Outcomes -> Psychological Safety",
  //     avg: 0,
  //     amountIncludingChildren: 0,
  //     treeLevel: 2,
  //     min: 0,
  //     max: 0,
  //   },
  //   {
  //     category_code: 23,
  //     parent_category_code: 21,
  //     category_Name: "Team Identity",
  //     survey_ID: 1,
  //     treePath: "Team Outcomes -> Team Identity",
  //     avg: 0,
  //     amountIncludingChildren: 0,
  //     treeLevel: 2,
  //     min: 0,
  //     max: 0,
  //   },
  //   {
  //     category_code: 24,
  //     parent_category_code: 21,
  //     category_Name: "Exploring Differences",
  //     survey_ID: 1,
  //     treePath: "Team Outcomes -> Exploring Differences",
  //     avg: 0,
  //     amountIncludingChildren: 0,
  //     treeLevel: 2,
  //     min: 0,
  //     max: 0,
  //   },
  //   {
  //     category_code: 25,
  //     parent_category_code: 21,
  //     category_Name: "Innovation",
  //     survey_ID: 1,
  //     treePath: "Team Outcomes -> Innovation",
  //     avg: 0,
  //     amountIncludingChildren: 0,
  //     treeLevel: 2,
  //     min: 0,
  //     max: 0,
  //   },
  //   {
  //     category_code: 26,
  //     parent_category_code: 21,
  //     category_Name: "Results",
  //     survey_ID: 1,
  //     treePath: "Team Outcomes -> Results",
  //     avg: 0,
  //     amountIncludingChildren: 0,
  //     treeLevel: 2,
  //     min: 0,
  //     max: 0,
  //   },
  //   {
  //     category_code: 27,
  //     parent_category_code: 0,
  //     category_Name: "Highest",
  //     survey_ID: 1,
  //     treePath: "Highest",
  //     avg: 0,
  //     amountIncludingChildren: 0,
  //     treeLevel: 1,
  //     min: 0,
  //     max: 0,
  //   },
  //   {
  //     category_code: 28,
  //     parent_category_code: 0,
  //     category_Name: "Lowest",
  //     survey_ID: 1,
  //     treePath: "Lowest",
  //     avg: 0,
  //     amountIncludingChildren: 0,
  //     treeLevel: 1,
  //     min: 0,
  //     max: 0,
  //   },
  // ];

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
    // this.getChartData();
  }

  logout() {
    this.app.Logout();
  }

  // getChartData() {
  //   var reqHeader = new HttpHeaders({
  //     "Content-Type": "application/json",
  //     // Authorization: "Bearer " + Token,
  //   });
  //   this.app.showSpinner();
  //   this.http
  //     .get("http://localhost:5000/api/getQuestionsTreeAvg?surveyID=10", {
  //       headers: reqHeader,
  //     })
  //     .subscribe((data: any) => {
  //       this.tempList = data;
  //       // var data = this.tempList;

  //       this.category = [];
  //       this.categoryName = "";
  //       this.avg = [];
  //       this.treeData = [];
  //       this.categoryName = data[0].category_Name;
  //       for (var i = 0; i < data.length; i++) {
  //         if (data[i].parent_category_code == data[0].category_code) {
  //           this.category.push(data[i].category_Name);
  //           this.avg.push([this.tempList[i].avg, this.tempList[i].avg]);
  //           this.treeData.push([data[i].min, data[i].max]);
  //         }
  //       }
  //       this.getColumnRangeChart(this.category, this.treeData, this.avg);
  //       this.app.hideSpinner();
  //     });
  // }

  // getColumnRangeChart(category, data, avg) {
  //   let chart = new Chart({
  //     chart: {
  //       type: "columnrange",
  //       inverted: true,
  //       style: {
  //         fontFamily: "Helvetica",
  //       },
  //     },
  //     title: {
  //       text: this.categoryName + " Graphical View",
  //       style: { fontSize: "25px", color: "black" },
  //     },
  //     xAxis: {
  //       categories: category,
  //       labels: {
  //         style: {
  //           fontSize: "15px",
  //           color: "black",
  //         },
  //       },
  //     },
  //     yAxis: {
  //       gridLineColor: "#A6A5A5",
  //       tickPositioner: function () {
  //         return [0, 1, 2, 3, 4, 5, 6];
  //       },
  //       labels: {
  //         style: {
  //           fontSize: "15px",
  //           color: "black",
  //         },
  //         formatter: function () {
  //           if (this.value != 0 && this.value != 6) {
  //             return this.value;
  //           }
  //         },
  //       },
  //     },
  //     plotOptions: {
  //       columnrange: {
  //         borderRadius: 4,
  //         shadow: true,
  //         dataLabels: {
  //           enabled: true,
  //           shape: "triangle",
  //           align: "center",
  //           borderRadius: 5,
  //           style: {
  //             fontSize: "15px",
  //           },
  //           backgroundColor: "rgba(255, 255, 255, 0.7)",
  //           borderWidth: 1,
  //           borderColor: "#AAA",
  //           formatter: function () {
  //             return this.y;
  //           },
  //         },
  //       },
  //     },

  //     legend: {
  //       enabled: false,
  //     },
  //     credits: {
  //       enabled: false,
  //     },
  //     series: [
  //       {
  //         name: "Average",
  //         pointWidth: 30,
  //         color: "#A6A5A5",
  //         type: "columnrange",
  //         data: avg,
  //       },
  //       {
  //         name: "Categories",
  //         pointWidth: 30,
  //         color: {
  //           linearGradient: {
  //             x1: 0,
  //             x2: 0,
  //             y1: 0,
  //             y2: 1,
  //           },
  //           stops: [
  //             [0, "#3167ec"],
  //             [1, "#63bfff"],
  //             // [0, "#6a78d1"],
  //             // [1, "#00bda5"],
  //             // [0, "#003399"],
  //             // [1, "#05E8BA"],
  //             // [0, "#045de9"],
  //             // [1, "#087EE1"],
  //           ],
  //         },
  //         type: "columnrange",
  //         data: data,
  //       },
  //     ],
  //   });

  //   this.Line_chart = chart;
  // }

  save_chart(chart) {
    var render_width = this.EXPORT_WIDTH;
    var render_height = (render_width * chart.chartHeight) / chart.chartWidth;

    // Get the cart's SVG code
    var svg = chart.getSVG({
      exporting: {
        sourceWidth: chart.chartWidth,
        sourceHeight: chart.chartHeight,
      },
    });

    // Create a canvas
    var canvas = document.createElement("canvas");
    canvas.height = render_height;
    canvas.width = render_width;
    document.body.appendChild(canvas);

    // Create an image and draw the SVG onto the canvas
    var image = new Image();
    // image.onload = function() {
    //     canvas.getContext('2d').drawImage(this, 0, 0, render_width, render_height);
    // };
    image.src = "data:image/svg+xml;base64," + window.btoa(svg);
  }

  genWord() {
    var savePath = "../../shared/img";
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(
        this.serverUrl +
          "api/createWordDocument?fileName=" +
          this.path +
          "&saveAs=" +
          savePath +
          ".docx&image=abc",
        {
          headers: reqHeader,
        }
      )
      .subscribe((data: any) => {
        alert(data);
      });
  }
}
