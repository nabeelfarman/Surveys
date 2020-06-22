import { Component, OnInit } from "@angular/core";
import { ToastrManager } from "ng6-toastr-notifications";
import { HttpClient, HttpHeaders, HttpErrorResponse } from "@angular/common/http";
import { AppComponent } from "src/app/app.component";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";

declare var $: any;
import * as XLSX from 'xlsx';

@Component({
    selector: 'app-import-survey-result',
    templateUrl: './import-survey-result.component.html',
    styleUrls: ['./import-survey-result.component.scss']
})
export class ImportSurveyResultComponent implements OnInit {    

    serverUrl = "http://localhost:12345/api/";

    tempData = [];
    summaryData = [];
    detailData = [];

    filePicker = '';
    arrayBuffer:any;
    dataFile: File;


    selectedFile: File = null;
    file;   


    constructor(
        public toastr: ToastrManager,
        private http: HttpClient,
        private app: AppComponent,
        private router: Router,
        private cookie: CookieService
    ) { }

    ngOnInit(): void {
    }



    incomingfile(event) {

        this.dataFile = event.target.files[0]; 

        this.app.showSpinner();

        let fileReader = new FileReader();
        fileReader.onload = (e) => {
            this.arrayBuffer = fileReader.result;
            var data = new Uint8Array(this.arrayBuffer);
            var arr = new Array();
            for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
            var bstr = arr.join("");
            var workbook =  XLSX.read (bstr, {type: 'binary' });
            var first_sheet_name = workbook.SheetNames[0];
            var worksheet = workbook.Sheets[first_sheet_name];

            this.tempData = XLSX.utils.sheet_to_json(worksheet, { raw: true } );
            this.addRecord();
            this.app.hideSpinner();
        }
        fileReader.readAsArrayBuffer(this.dataFile);
        
    }



    onFileSelected(event) {
        this.selectedFile = <File>event.target.files[0];
        let reader = new FileReader();
    
        reader.onloadend = e => {
          this.file = reader.result;
    
          var splitFile = this.file.split(",")[1];
          this.file = splitFile;
        };
    
        reader.readAsDataURL(this.selectedFile);
    }



    addRecord(){

        // Object.keys(user) = ["name", "age"]
        // Object.values(user) = ["John", 30]
        // Object.entries(user) = [ ["name","John"], ["age",30] ]

        var dataLen = this.tempData.length
        this.summaryData = [];
        this.detailData = [];

        for (let i = 0; i < dataLen; i++) {
            
            var xlData = {
                ResponseId : this.tempData[i]['Response ID'],
                FirstName: this.tempData[i]['Email First Name'],
                LastName: this.tempData[i]['Email Last Name'],
                EmailAddress: this.tempData[i]['Email List Address'],
                IPAddress: this.tempData[i]['IP Address'],
                CustomAnswer1: this.tempData[i]['Custom Answer 1'],
                CustomAnswer2: this.tempData[i]['Custom Answer 2'],
                Status: this.tempData[i]['Status']
            };

            this.summaryData.push(xlData);

        }        

    }


    //Function for save document
    save() {
        if (this.filePicker == undefined) {
        this.toastr.errorToastr("Please select document", "Error", {
            toastTimeout: 2500
        });
        return false;
        } else {
        var filePath = null;
        if (this.file != undefined) {
            filePath = this.filePicker;
        }

        var fileNameExt = this.filePicker.substr(this.filePicker.lastIndexOf(".") + 1);

        if(fileNameExt != 'xlsx')
        {
            this.toastr.errorToastr("Please select excel file", "Error", { toastTimeout: 2500 });
            return false;
        }

        this.app.showSpinner();
        //* ********************************************save data
        var saveData = {
            DocID: 0,
            DocExtension: fileNameExt,
            excelfile: this.file,
            DocURL: filePath,
            //ConnectedUser: this.app.empId,
            DelFlag: 0
        };

        //var token = localStorage.getItem(this.tokenKey);

        //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

        var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

        this.http.post(this.serverUrl + "uploadFile", saveData, {headers: reqHeader}).subscribe((data: any) => {
            if (data.msg == "success") {
                this.app.hideSpinner();
                this.toastr.successToastr("Record Save Successfully!", "Success!", {toastTimeout: 2500});
                this.toastr.errorToastr(data.msgT, "Error!", { toastTimeout: 5000 });
                this.toastr.errorToastr(data.msgA, "Error!", { toastTimeout: 5000 });
                this.clear();
                return false;
            } else {
                this.app.hideSpinner();
                this.toastr.errorToastr(data.msg, "Error!", { toastTimeout: 5000 });
                return false;
            }
            });
        }
    }


    clear(){

        this.tempData = [];
        this.summaryData = [];
        this.detailData = [];

        this.filePicker = '';
        this.filePicker = undefined;

        this.file = undefined;
        this.selectedFile = null;

    }



    filterExcelData(){

        //var token = localStorage.getItem(this.tokenKey);
        // var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
        var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

        this.http.get(this.serverUrl + "saveExcelData?rows="+this.summaryData, { headers: reqHeader }).subscribe((data: any) => {

            this.detailData = data;
            alert(data.length);
            this.app.hideSpinner();
        
        });

    }

}
