import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { InfoService } from '../@service/info.service';
import { HttpClientService } from '../@http-service/http-client.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-add-preview',
  imports: [],
  templateUrl: './add-preview.component.html',
  styleUrl: './add-preview.component.scss'
})
export class AddPreviewComponent {
  constructor(
    private router: Router,
    private infoService: InfoService,
    private httpClientService: HttpClientService
  ) {}

  quest: any[] = [];
  questionArray: any[] = [];
  statusBoolean!: boolean;
  result: string = '查看';


  ngOnInit(): void {
    this.quest = this.infoService.quest
    this.questionArray = this.infoService.questionArray
}


async saveToManagerList() {
  const questionnaireData = this.infoService.quest[this.infoService.quest.length - 1];
  questionnaireData.statusBoolean = false;
  questionnaireData.result = this.result;
  questionnaireData.questionArray = this.questionArray;

  try {
    let apiUrl = 'http://localhost:8080/quiz/create';

    // 若是編輯模式，則改用 update
    if (this.infoService.isEditing) {
      apiUrl = 'http://localhost:8080/quiz/update';
      questionnaireData.quizId = this.infoService.quizId;  // 從 infoService 帶入 quizId
    }

    const response = await lastValueFrom(
      this.httpClientService.postApi(apiUrl, questionnaireData)
    );

    console.log('問卷儲存成功:', response);
    alert(this.infoService.isEditing ? '問卷更新成功！' : '新增問卷成功！');

  } catch (error) {
    console.error('儲存問卷失敗:', error);
    alert('問卷儲存失敗！');
  }

  // 回首頁
  this.infoService.isEditing = false;
  this.router.navigate(['/managerList']);
}


async postToList() {
    const questionnaireData = this.infoService.quest[this.infoService.quest.length - 1];
    questionnaireData.statusBoolean = true;
    questionnaireData.result = this.result;
    questionnaireData.questionArray = this.questionArray;

    let apiUrl = 'http://localhost:8080/quiz/create';

    // 若為編輯模式則改為 update
    if (this.infoService.isEditing) {
      apiUrl = 'http://localhost:8080/quiz/update';
      questionnaireData.quizId = this.infoService.quizId; // 加上 quizId
    }

    try {
      const questResponse = await lastValueFrom(
        this.httpClientService.postApi(apiUrl, questionnaireData)
      );
      console.log('問卷儲存成功:', questResponse);
      alert(this.infoService.isEditing ? '問卷更新成功！' : '新增問卷成功！');
    } catch (error) {
      console.error('儲存問卷失敗:', error);
      alert(this.infoService.isEditing ? '問卷更新失敗！' : '新增問卷失敗！');
    }

    this.infoService.isEditing = false;
    this.router.navigate(['/managerList']);
  }

}
