import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InfoService } from '../@service/info.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-questionnaire',
  imports: [FormsModule],
  templateUrl: './add-questionnaire.component.html',
  styleUrl: './add-questionnaire.component.scss'
})
export class AddQuestionnaireComponent {

  constructor(
    private router: Router,
    private infoService: InfoService
  ) { }

  title!: string
  explain!: string
  sDate!: string
  eDate!: string
  minDate!: string
  quest: any[] = []



  changeDateFormat(dateData: Date, dateTyep: string = '-') {
    let year;
    let month;
    let date;
    if (dateData) {
      year = dateData.getFullYear();
      month = dateData.getMonth() + 1;
      if (String(month).length == 1) {
        month = '0' + month;
      }
      date = dateData.getDate();
      if (String(date).length == 1) {
        date = '0' + date;
      }

      return year + dateTyep + month + dateTyep + date;
    }
    else { return ''; }
  }

  cancel() {
    this.router.navigate(['/managerList']);
  }


  next() {
    if (this.title == null || this.title.trim() === '') {
      alert('請填寫問卷名稱');
      return;
    }
    if (this.explain == null || this.explain.trim() === '') {
      alert('請填寫問卷說明');
      return;
    }
    if ((this.sDate == null || this.sDate.trim() === '') || (this.eDate == null || this.eDate.trim() === '')) {
      alert('請填寫完整開始、結束時間');
      return;
    }

    if (this.sDate && this.eDate && this.eDate < this.sDate) {
      this.eDate = '';
      return;
    };

    const questionnaireData = {
      title: this.title,
      explanation: this.explain,
      startDate: this.sDate,
      endDate: this.eDate
    };
    this.quest.push(questionnaireData);
    this.quest = [questionnaireData];  // 直接覆蓋，避免累積舊資料
    this.infoService.quest = [...this.quest];

    if (!this.infoService.quest) {
      this.infoService.quest = [... this.quest];
    } else {
      this.infoService.quest = [... this.quest];
    };
    this.router.navigate(['/add/addContent']);
  }

  ngOnInit(): void {
    this.minDate = this.changeDateFormat(new Date());

    const lastQuestionnaire = this.infoService.quest[this.infoService.quest.length - 1];
    if (lastQuestionnaire) {
      this.title = lastQuestionnaire.title;
      this.explain = lastQuestionnaire.explanation;
      this.sDate = lastQuestionnaire.startDate;
      this.eDate = lastQuestionnaire.endDate;
    };


  }


}
