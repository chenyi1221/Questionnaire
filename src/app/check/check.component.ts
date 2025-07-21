import { Router } from '@angular/router';
import { InfoService } from './../@service/info.service';
import { Component } from '@angular/core';
import { HttpClientService } from '../@http-service/http-client.service';

@Component({
  selector: 'app-check',
  imports: [],
  templateUrl: './check.component.html',
  styleUrl: './check.component.scss'
})
export class CheckComponent {
  answerData!: any

  constructor(
  private router: Router,
  private infoService: InfoService,
  private httpClientService: HttpClientService
) {}

ngOnInit(): void {
  this.answerData = this.infoService.answerData
  console.log(this.answerData);
}


goBackToAnswer(){
      this.router.navigate(['/answer'], {
        queryParams: { id:this.answerData.quizId } // ← 真實 ID
      });
    }


goBackToList() {

    if (!this.answerData || !this.answerData.answers) {
      alert('資料不完整，請確認是否填寫完成');
      return;
    }

    // 整理格式給後端
    const submitData = {
      userName: this.answerData.userName,
      userPhone: this.answerData.userPhone,
      userEmail: this.answerData.userEmail,
      userAge: parseInt(this.answerData.userAge), // 要是數字
      quizId: this.answerData.quizId,
      answers: this.answerData.answers.map((ans: any) => ({
        quesId: ans.quesId,
        optionArray: ans.optionArray // 即使是簡答題也保留陣列
      }))
    };

    this.httpClientService.postApi('http://localhost:8080/quiz/fillin', submitData)
      .subscribe(
        (res: any) => {
          if (res.code === 200) {
            alert('完成送出 , 感謝您的填寫!!');
            this.router.navigate(['/list']);
          } else {
            alert(`送出失敗: ${res.message}`);
          }
        },
        error => {
          console.error('送出失敗', error);
          alert('伺服器錯誤，請稍後再試');
        }
      );

      console.log(submitData);
  }

}
