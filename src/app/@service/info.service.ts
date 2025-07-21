import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InfoService {
  answerData!: any
  questionArray: any[] = []
  quest: any[] = []
  isEditing: boolean = false;
  quizId!: number;
  userFeedback: any = {};

  constructor() { }

}
