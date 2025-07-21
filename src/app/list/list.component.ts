import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { HttpClientService } from '../@http-service/http-client.service';



@Component({
  selector: 'app-list',
  imports: [MatTableModule, MatPaginatorModule, FormsModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})


export class ListComponent {

  constructor(
    private router: Router,
    private httpClientService: HttpClientService
  ) { }

  title = 'Questionnaire';
  displayedColumns: string[] = ['number', 'name', 'status', 'startDate', 'endDate', 'result'];
  dataSource = new MatTableDataSource<PeriodicElement>([]);
  inputData!: string;
  dateFrom!: string;
  dateEnd!: string;
  resData: any[] = [];
  result: string = "查看";

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  goToLogin() {
    this.router.navigate(['/login'])
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
      forFrontEnd: true
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

  goToCount(question: PeriodicElement) {
      if (question.status === '已結束') {
        this.router.navigate(['/count'], {
          queryParams: { id: question.id } // ← 真實 ID
        });
      }
      console.log("回傳" + question.id)
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
    } else if (published && nowDate >= startDate && nowDate <= endDate) {
      return '進行中';
    }
    return '進行中未發布';

  }


  ngOnInit(): void {
    this.httpClientService.getApi('http://localhost:8080/quiz/getAll').subscribe((res) => {
      console.log(res);
      this.resData = (res as { quizList: any[] }).quizList;


      // 過濾掉 status === '未發布' 的問卷
      const filteredData = this.resData.filter(item => {
        const status = this.getStatus(item.startDate, item.endDate, item.published);
        return status !== '未發布' && status !== '進行中未發布';
      });

      this.dataSource.data = filteredData.map((item: any, index: number) => ({
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

      // 設定 paginator
      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
      }
    });
  }

    goToAnswer(question: PeriodicElement) {
      if (question.status === '進行中') {
        this.router.navigate(['/answer'], {
          queryParams: { id: question.id } // ← 真實 ID
        });
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
}

