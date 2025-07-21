import { InfoService } from './../@service/info.service';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientService } from '../@http-service/http-client.service';


@Component({
  selector: 'app-answer',
  imports: [FormsModule],
  templateUrl: './answer.component.html',
  styleUrl: './answer.component.scss'
})
export class AnswerComponent {
  constructor(
    private router: Router,
    private infoService: InfoService,
    private httpClientService: HttpClientService,
    private route: ActivatedRoute
  ) { }


  userName!: string;
  userPhone!: number;
  userEmail!: any;
  userAge!: number;
  userAnswers: any[] = [];
  questionArray: any[] = [];
  questionnaire!: {
    id: number;
    title: string;
    explanation: string;
    startDate: string;
    endDate: string;
    questionArray: any[];
  }

  goToCheck() {
    if (this.checkMust()) {
      this.userAnswers = []; // 先清空舊的答案

      for (let question of this.questionnaire.questionArray) {
        let answerData: any = {
          quesId: question.quesId,
          type: question.type,
          typeNameChinese: question.typeNameChinese,
          must: question.must,
          qName: question.qName,
        };

        if (question.type === 1 || question.type === 3) {
          const ans = question.selectedAnswer;
          answerData.optionArray = (ans && ans.toString().trim() !== '') ? [ans] : [];
        } else if (question.type === 2) {
          const selectedOptions = question.optionArray
            .filter((opt: { boxBoolean: boolean }) => opt.boxBoolean)
            .map((opt: { optionName: string }) => opt.optionName);
          answerData.optionArray = selectedOptions; // 只放選中的值

        }


        this.userAnswers.push(answerData);
      }

      // 將整體作答資料存進 infoService，給預覽頁使用
      this.infoService.answerData = {
        userName: this.userName,
        userPhone: this.userPhone,
        userEmail: this.userEmail,
        userAge: this.userAge,
        quizId: this.questionnaire.id,
        answers: this.userAnswers,
        title: this.questionnaire.title,
        explanation: this.questionnaire.explanation,

      };

      this.router.navigate(['/check']);

    }
  }

  checkMust(): boolean {
    if (!this.userName || !this.userPhone || !this.userEmail || !this.userAge) {
      alert('確認必填問題');
      return false;
    }
    for (let question of this.questionnaire.questionArray) {
      if (question.must) {
        if (question.type === 1 && !question.selectedAnswer) {
          alert('確認必填問題');
          return false;
        }
        else if (question.type === 2 && !question.optionArray.some((opt: { optionName: string; boxBoolean: boolean }) => opt.boxBoolean)) {
          alert('確認必填問題');
          return false;
        }
        else if (question.type === 3 && (!question.selectedAnswer || question.selectedAnswer.trim() === '')) {
          alert('確認必填問題');
          return false;
        }
      }
    }
    return true;
  }


  gobackToList() {
    this.infoService.answerData = null;
    this.router.navigate(['/list']);
  }


  getTypeFromName(typeName: string): number {
    switch (typeName) {
      case 'Single': return 1;
      case 'Multi': return 2;
      case 'Text': return 3;
      default: return 0;
    }
  }


  getTypeNames(type: number): { typeName: string, typeNameChinese: string } {
    switch (type) {
      case 1:
        return { typeName: 'Single', typeNameChinese: '單選' };
      case 2:
        return { typeName: 'Multi', typeNameChinese: '多選' };
      case 3:
        return { typeName: 'Text', typeNameChinese: '簡答題' };
      default:
        return { typeName: '', typeNameChinese: '' };
    }
  }


  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const quizId = +params['id'];  // 從 URL 拿 quizId

      if (!quizId) {
        alert('無效的問卷 ID');
        return;
      }

      this.infoService.quizId = quizId;
      this.infoService.isEditing = true;

      // 呼叫後端 API 撈問卷資料
      const apiUrl = `http://localhost:8080/quiz/getByQuizId?quizId=${quizId}`;
      this.httpClientService.getApi(apiUrl).subscribe({
        next: (res: any) => {
          if (!res || !res.quiz || !res.questionList) {
            alert('問卷資料異常');
            return;
          }

          // 整理問卷基本資訊
          const quiz = res.quiz;
          const questionVos = res.questionList;

          this.questionArray = questionVos.map((q: any) => {
            const typeNum = this.getTypeFromName(q.typeName);
            const typeInfo = this.getTypeNames(typeNum);

            return {
              quizId: q.quizId,
              quesId: q.qId,
              qName: q.qName,
              type: typeNum,
              typeName: typeInfo.typeName,
              typeNameChinese: typeInfo.typeNameChinese,
              must: q.must,
              options: q.options,
              optionArray: q.options.map((opt: string) => ({
                optionName: opt,
                boxBoolean: false
              })),
              selectedAnswer: ''
            };
          });

          // 將問卷基本資訊與題目設定給 questionnaire（畫面用）
          this.questionnaire = {
            id: quiz.id,
            title: quiz.title,
            explanation: quiz.description,
            startDate: quiz.startDate,
            endDate: quiz.endDate,
            questionArray: this.questionArray
          };

          // ✅ 如果從 check 回來，還原作答資料
          if (this.infoService.answerData && this.infoService.answerData.answers) {
            this.userName = this.infoService.answerData.userName;
            this.userPhone = this.infoService.answerData.userPhone;
            this.userEmail = this.infoService.answerData.userEmail;
            this.userAge = this.infoService.answerData.userAge;

            // 還原每一題作答
            for (let question of this.questionnaire.questionArray) {
              const saved = this.infoService.answerData.answers.find((a: any) => a.quesId === question.quesId);
              if (saved) {
                if (question.type === 1 || question.type === 3) {
                  question.selectedAnswer = saved.optionArray[0] || '';
                } else if (question.type === 2) {
                  for (let opt of question.optionArray) {
                    opt.boxBoolean = saved.optionArray.includes(opt.optionName);
                  }
                }
              }
            }
          }

          // 同步到 infoService 方便預覽頁使用
          this.infoService.questionArray = [...this.questionArray];
          this.infoService.quest = [{
            id: quiz.id,
            title: quiz.title,
            explanation: quiz.description,
            startDate: quiz.startDate,
            endDate: quiz.endDate
          }];
        },
        error: (err: any) => {
          alert('無法取得問卷資料，請稍後再試');
        }
      });
    });
  }

}
