import { Component, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { ManagerService } from '../@service/manager.service';
import { InfoService } from '../@service/info.service';
import { HttpClientService } from '../@http-service/http-client.service';


@Component({
  selector: 'app-manager-list',
  imports: [MatTableModule, MatPaginatorModule, RouterLink, FormsModule, MatIconModule],
  templateUrl: './manager-list.component.html',
  styleUrl: './manager-list.component.scss'
})


export class ManagerListComponent {
  constructor(
    private router: Router,
    private managerService: ManagerService,
    private infoService: InfoService,
    private httpClientService: HttpClientService
  ) { }

  displayedColumns: string[] = ['checkbox', 'number', 'name', 'status', 'startDate', 'endDate', 'result'];
  dataSource = new MatTableDataSource<PeriodicElement>([]);
  inputData!: string;
  dateFrom!: string;
  dateEnd!: string;
  allCheckboxBoolean = false;

  resData: any[] = [];
  checkboxBoolean = false;
  number!: number;
  name!: string;
  explanation!: string;
  status!: boolean;
  startDate!: string;
  endDate!: string;
  nowDate: string = new Date().toISOString().slice(0, 10);
  published!: boolean;
  result: string = "查看";




  @ViewChild(MatPaginator) paginator!: MatPaginator;


  logOut() {
    this.managerService.manager = false
    this.router.navigate(['/list']);
  }

  changeAllCheckbox() {
    for (let i = 0; i < this.dataSource.data.length; i++) {
      // this.dataSource.data[i].checkboxBoolean = this.allCheckboxBoolean;
      const element = this.dataSource.data[i];
      // 只有 "未開始" 或 "未發布" 的問卷可以被選中
      if (element.status === '未開始' || element.status === '未發布') {
        element.checkboxBoolean = this.allCheckboxBoolean;
      } else {
        element.checkboxBoolean = false; // 進行中和已結束的問卷不允許被選中
      }
    }
  }

  changeCheckbox() {
    this.allCheckboxBoolean = this.dataSource.data.every(data => data.checkboxBoolean);
  }


  delete() {
    const selectedCheckbox = this.dataSource.data.filter(element =>
      element.checkboxBoolean && (element.status === '未開始' || element.status === '未發布')
    );
    const idList = selectedCheckbox.map(item => item.id);
    const deleteQuestionnaire = { idList };
    this.httpClientService.postApi('http://localhost:8080/quiz/delete', deleteQuestionnaire)
      .subscribe({
        next: (res: any) => {
          if (res.code === 200) {
            // ✅ 刪除成功：才移除資料
            this.dataSource.data = this.dataSource.data.filter(element => !element.checkboxBoolean);

            // 重算排序
            this.dataSource.data.forEach((item, index) => item.number = index + 1);

            this.allCheckboxBoolean = false;
            alert('刪除成功!!');
          } else {
            // ❌ 刪除失敗：顯示錯誤訊息，不改變畫面
            alert(`刪除失敗:"進行中"或"已結束"問卷不得刪除：${res.message}`);
          }
        },
        error: err => {
          alert('刪除失敗，請稍後再試');
        }
      });
  }

  goToAddQuestionnaire() {
    this.infoService.quest = []
    this.infoService.questionArray = [];
    this.infoService.isEditing = false;
    this.router.navigate(['/add/addQuestionnaire']);
  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }


  searchBtn() {
    if (this.dateFrom && this.dateEnd && this.dateEnd < this.dateFrom) {
      this.dateEnd = '';
    }

    // 準備 SearchReq 格式的查詢條件
    const searchReq = {
      quizName: this.inputData || '',
      startDate: this.dateFrom || null,
      endDate: this.dateEnd || null,
      forFrontEnd: false
    };

    // 呼叫後端 API，帶入條件
    this.httpClientService.postApi('http://localhost:8080/quiz/getAll', searchReq)
      .subscribe((res: any) => {
        this.resData = res.quizList;

        // 更新表格資料
        this.dataSource.data = this.resData.map((item: any, index: number) => ({
          id: item.id,
          checkboxBoolean: false,
          number: index + 1,
          name: item.title,
          explanation: item.description,
          status: this.getStatus(item.startDate, item.endDate, item.published),
          startDate: item.startDate,
          endDate: item.endDate,
          result: this.result
        }));

        // 更新 checkbox 狀態
        this.allCheckboxBoolean = false;
      }, error => {
        alert('搜尋失敗，請稍後再試');
      });
  }

  clearSearch() {
    this.inputData = '';
    this.dateFrom = '';
    this.dateEnd = '';
    this.searchBtn(); // 重新查詢
  }

  goToFeedbackList(question: PeriodicElement) {
    if (question.status === '已結束') {
      this.router.navigate(['/result/feedbackList'], {
        queryParams: { id: question.id } // ← 真實 ID
      });
    }
  }


  ngOnInit(): void {

    this.httpClientService.getApi('http://localhost:8080/quiz/getAll').
      subscribe((res) => {
        console.log(res)
        this.resData = (res as { quizList: any[] }).quizList;

        this.dataSource.data = this.resData.map((item: any, index: number) => ({
          id: item.id,
          checkboxBoolean: false,
          number: index + 1,
          name: item.title,
          explanation: item.description,
          status: this.getStatus(item.startDate, item.endDate, item.published),
          startDate: item.startDate,
          endDate: item.endDate,
          result: this.result,
        }));

        for (let i = 0; i < this.dataSource.data.length; i++) {
          this.dataSource.data[i].number = i + 1
        };

        // 重新設定 paginator，這是處理資料頁碼的必要步驟
        if (this.paginator) {
          this.dataSource.paginator = this.paginator;
        }

        this.dataSource.data.forEach(item => item.checkboxBoolean = false);
      })
  }

  goToEditQuestionnaire(question: PeriodicElement) {
    if (question.status === '未開始' || question.status === '未發布') {
      this.router.navigate(['/add/addContent'], {
        queryParams: { id: question.id } // ← 真實 ID
      });
    }
  }


  getStatus(startDate: string, endDate: string, published: boolean): string {
    const nowDate = new Date().toISOString().slice(0, 10);
    if (!published && (nowDate < startDate)) {
      return '未發布';
    }

    if (nowDate < startDate) {
      return '未開始';
    } else if (nowDate > endDate) {
      return '已結束';
    } else {
      return '進行中';
    }
  }

}


export interface PeriodicElement {
  id: number;
  number: number;
  name: string;
  status: string;
  startDate: string;
  endDate: string;
  result: string;
  checkboxBoolean: boolean;
  explanation?: string;
}
