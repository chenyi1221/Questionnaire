import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import { AnswerComponent } from './answer/answer.component';
import { CheckComponent } from './check/check.component';
import { CountComponent } from './count/count.component';
import { LoginComponent } from './login/login.component';
import { ManagerListComponent } from './manager-list/manager-list.component';
import { AddComponent } from './add/add.component';
import { AddQuestionnaireComponent } from './add-questionnaire/add-questionnaire.component';
import { AddContentComponent } from './add-content/add-content.component';
import { AddPreviewComponent } from './add-preview/add-preview.component';
import { ResultComponent } from './result/result.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { FeedbackListComponent } from './feedback-list/feedback-list.component';



export const routes: Routes = [
  {path:'list', component: ListComponent},
  {path:'answer', component: AnswerComponent},
  {path:'check', component: CheckComponent},
  {path:'count', component: CountComponent},
  {path:'login',component: LoginComponent},
  {path:'managerList',component: ManagerListComponent},
  {path:'add',component: AddComponent,
    children:[
      {path:'addQuestionnaire',component: AddQuestionnaireComponent},
      {path:'addContent',component: AddContentComponent},
    ]
  },
  {path:'addPreview',component: AddPreviewComponent},
  {path:'result', component: ResultComponent,
    children:[
      {path:'feedbackList', component: FeedbackListComponent},
      {path: 'feedback/:index', component: FeedbackComponent},
      {path:'count', component: CountComponent},
    ]
  },


]
