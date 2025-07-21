import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { InfoService } from '../@service/info.service';
import { HttpClientService } from '../@http-service/http-client.service';

@Component({
  selector: 'app-add-content',
  imports: [FormsModule, MatIconModule],
  templateUrl: './add-content.component.html',
  styleUrl: './add-content.component.scss'
})
export class AddContentComponent {
  constructor(
    private router: Router,
    private infoService: InfoService,
    private httpClientService: HttpClientService,
    private route: ActivatedRoute
  ) { }

  qName!: string;
  allCheckboxBoolean = false;
  optionArray: { optionName: string, checkboxBoolean: boolean}[] = [];
  options: string[] = [];
  selectedType: number = 0;
  must: boolean = false;
  questionCounter: number = 0;
  questionArray: any[] = [];
  typeName!: string;
  typeNameChinese!: string;
  tabBoxboolean: boolean = false;
  code!: string;
  qId!: number;
  editingQuestion: any = null;
  quest: any[] = [];

  setType(type: number) {
    this.selectedType = type;
    if (this.selectedType === 1) {
      this.typeName = 'Single'
      this.typeNameChinese = '單選'
    }

    else if (this.selectedType === 2) {
      this.typeName = 'Multi'
      this.typeNameChinese = '多選'
    }

    else if (this.selectedType === 3) {
      this.typeName = 'Text'
      this.typeNameChinese = '簡答題'
    }
  }

  refresh() {
    this.selectedType = 0;
    this.optionArray = [];
    this.qName = '';
    this.must = false;
    this.questionCounter = 0;
  }

  addOption() {
    const newOption = {
      optionName: '',
      checkboxBoolean: false
    };
    this.optionArray.push(newOption);
  }


  changeAllCheckbox() {
    for (let i = 0; i < this.optionArray.length; i++) {
      this.optionArray[i].checkboxBoolean = this.allCheckboxBoolean;
    }
  }

  changeCheckbox() {
    this.allCheckboxBoolean = this.optionArray.every(input => input.checkboxBoolean);
  }

  delete() {
    this.optionArray = this.optionArray.filter(input => !input.checkboxBoolean);

    for (let i = 0; i < this.optionArray.length; i++) {
      this.optionArray[i].optionName = this.optionArray[i].optionName
    };
    this.allCheckboxBoolean = false
  }


  tabDelete() {
    const tabCheckbox = this.questionArray.filter(element => element.tabBoxboolean);
    if (tabCheckbox.length > 0) {
      this.questionArray = this.questionArray.filter(element => !element.tabBoxboolean);

      for (let i = 0; i < this.questionArray.length; i++) {
        this.questionArray[i].qId = i + 1
      };
    }
  }

  updateQuestionIds() {
    for (let i = 0; i < this.questionArray.length; i++) {
      this.questionArray[i].qId = i + 1;
    }
  }

  add() {

    if (this.qName == null || this.qName.trim() === '') {
      alert('請填寫題目');
      return;
    }


    if (this.selectedType === 0) {
      alert('請選擇類型');
      return;
    }

    if (this.selectedType === 1 || this.selectedType === 2) {
      if (this.optionArray.length === 0) {
        alert('請新增選項');
        return;
      }

      for (let i = 0; i < this.optionArray.length; i++) {
        if (this.optionArray[i].optionName.trim() === '') {
          alert('請填寫所有選項');
          return;
        }
        else if (this.optionArray.length < 2) {
          alert('請填寫至少2個選項');
          return;
        }
      }
    }

    this.options = this.optionArray.map(opt => opt.optionName);

    const typeInfo = this.getTypeNames(this.selectedType);

    const currentQuestion = {
      quizId: this.infoService.quizId,
      qId: this.editingQuestion ? this.editingQuestion.qId : this.questionArray.length + 1,
      qName: this.qName,
      type: this.selectedType,
      typeName: typeInfo.typeName,
      typeNameChinese: typeInfo.typeNameChinese,
      must: this.must,
      optionArray: [...this.optionArray],
      options: this.options
    };


    if (this.editingQuestion) {
      const index = this.questionArray.findIndex(q => q.qId === this.editingQuestion.qId);
      if (index !== -1) {
        this.questionArray[index] = currentQuestion;
      }
    } else {
      this.questionArray.push(currentQuestion);
    }


    this.updateQuestionIds()
    this.refresh();
    this.editingQuestion = null;
    console.log(this.questionArray)
  }


  previous() {
    this.infoService.questionArray = [...this.questionArray];
    this.router.navigate(['/add/addQuestionnaire'])
  }

  goToPreview() {
    if (this.questionArray.length < 1) {
      alert('至少加入一題問題')
      return;
    }

    if (!this.infoService.questionArray) {
      this.infoService.questionArray = [... this.questionArray];
    }
    else {
      this.infoService.questionArray = [... this.questionArray];
    };
    this.router.navigate(['/addPreview']);
  }

  editQuestion(question: any) {
    this.editingQuestion = question;
    this.qName = question.qName;
    this.typeNameChinese = question.typeNameChinese;
    this.selectedType = this.getTypeFromChinese(this.typeNameChinese);

    const typeInfo = this.getTypeNames(this.selectedType);
    this.typeName = typeInfo.typeName;
    this.typeNameChinese = typeInfo.typeNameChinese;

    this.must = question.must;
    this.optionArray = [...question.optionArray];
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


  getTypeFromChinese(typeNameChinese: string): number {
    switch (typeNameChinese) {
      case '單選':
        return 1;
      case '多選':
        return 2;
      case '簡答題':
        return 3;
      default:
        return 0;  // 可以設定為預設的無效類型，也可以拋出錯誤
    }
  }


  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const quizId = +params['id'];

      if (quizId) {
        this.infoService.quizId = quizId;
        this.infoService.isEditing = true;

        // 後端撈資料（如需）
        this.httpClientService.getApi(`http://localhost:8080/quiz/getByQuizId?quizId=${quizId}`)
          .subscribe({
            next: (res: any) => {
              const questionVos = res.questionList;
              const questData = {
                id: res.quiz.id,
                title: res.quiz.title,
                explanation: res.quiz.description,
                startDate: res.quiz.startDate,
                endDate: res.quiz.endDate,
              };

              this.questionArray = questionVos.map((q: any, i: number) => {
                const typeNum = this.getTypeFromName(q.typeName);
                const typeInfo = this.getTypeNames(typeNum);
                return {
                  quizId: q.quizId,
                  qId: q.qId,
                  qName: q.qName,
                  type: typeNum,
                  typeName: typeInfo.typeName,
                  typeNameChinese: typeInfo.typeNameChinese,
                  must: q.must,
                  options: q.options,
                  optionArray: q.options.map((opt: string) => ({
                    optionName: opt,
                    checkboxBoolean: false
                  }))
                };
              });

              this.quest = [questData];
              this.infoService.quest = [...this.quest];
              this.infoService.questionArray = [...this.questionArray];
            },
            error: (err: any) => {
              alert('無法取得問卷題目');
            }
          });
      }


      // 👉 回填 infoService 中的題目資料（若有）
      if (this.infoService.questionArray && this.infoService.questionArray.length > 0) {
        this.questionArray = [...this.infoService.questionArray];
        this.updateQuestionIds();
      }

      if (this.infoService.quest && this.infoService.quest.length > 0) {
        this.quest = [...this.infoService.quest];
      }
    });
  }



}
