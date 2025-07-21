import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InfoService } from '../@service/info.service';

@Component({
  selector: 'app-feedback',
  imports: [],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.scss'
})
export class FeedbackComponent {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private infoService: InfoService,
  ) { }

  questionnaire: any = {};

 ngOnInit(): void {
  this.route.paramMap.subscribe(params => {
    const indexParam = params.get('index');
    const index = indexParam !== null ? +indexParam : -1;
    const fullData = this.infoService.userFeedback;

    if (index === -1 || !fullData || !fullData.feedbackVoList) {
      alert('找不到作答資料，請從問卷紀錄頁面重新進入。');
      this.router.navigate(['/result/feedbackList']);
      return;
    }

    const targetFeedback = fullData.feedbackVoList[index];

    if (!targetFeedback) {
      alert('找不到該筆資料。');
      this.router.navigate(['/result/feedbackList']);
      return;
    }

      this.questionnaire = {
        title: fullData.title,
        explanation: fullData.description,
        userName: targetFeedback.userName,
        userPhone: targetFeedback.phone,
        userEmail: targetFeedback.email,
        userAge: targetFeedback.age,
        questionArray: targetFeedback.answerVoList.map((ans: any) => ({
          qName: ans.question,
          type: this.getType(ans.optionArray),
          typeName: this.getTypeName(ans.optionArray),
          optionArray: ans.optionArray.map((opt: any) => ({
            optionName: opt,
          })),
          must: true,
        }))
      };
    });
  }

  getType(optionArray: any[]): string {
    if (optionArray.length > 1) return '2';
    if (optionArray.length === 1) return '1';
    return '3';
  }

  getTypeName(optionArray: any[]): string {
    if (optionArray.length > 1) return '複選';
    if (optionArray.length === 1) return '單選';
    return '簡答';
  }

  goBackToFeedbackList() {
    const quizId = this.infoService.quizId;
    this.router.navigate(['/result/feedbackList'], { queryParams: { id: quizId } })
  }


}
