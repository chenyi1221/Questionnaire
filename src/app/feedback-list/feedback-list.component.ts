import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientService } from '../@http-service/http-client.service';
import { InfoService } from '../@service/info.service';

@Component({
  selector: 'app-feedback-list',
  imports: [],
  templateUrl: './feedback-list.component.html',
  styleUrl: './feedback-list.component.scss'
})
export class FeedbackListComponent {
  constructor(
    private router: Router,
    private httpClientService: HttpClientService,
    private route: ActivatedRoute,
    private infoService: InfoService,
  ) { }

  feedbackData: any[] = [];

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      let quizId = +params['id'];  // 從 URL 拿 quizId

    // 如果 URL 沒帶 id，就從 InfoService 拿
    if (!quizId && this.infoService.quizId) {
      quizId = this.infoService.quizId;
    }

      if (!quizId) {
        alert('無效的問卷 ID');
        return;
      }

      const finalQuizId = quizId || this.infoService.quizId;

      // 記住這個 quizId
      this.infoService.quizId = finalQuizId;

      console.log(quizId);
      this.httpClientService.postApi(`http://localhost:8080/quiz/feedback?quizId=${quizId}`, {})
        .subscribe((res: any) => {
          const quizList = res.feedbackVoList ?? [];
          this.infoService.userFeedback = res;
          // 更新表格資料
          this.feedbackData = quizList.map((item: any, index: number) => ({
            index,
            userName: item.userName,
            fillinDate: item.fillinDate,
            showFeedback: '查看'
          }));

          // 根據時間欄位排序資料，最新的排在前面
          this.feedbackData.sort((a, b) => new Date(b.fillinDate).getTime() - new Date(a.fillinDate).getTime());
        }, error => {
          alert('搜尋失敗，請稍後再試');
        });

    })

  }

  showFeedback(index: number) {
    this.router.navigate(['/result/feedback', index]);
  }

  goBackToManagerList() {
    this.router.navigate(['/managerList'])
  }

}
