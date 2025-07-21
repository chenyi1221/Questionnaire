import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { InfoService } from '../@service/info.service';

@Component({
  selector: 'app-result',
  imports: [MatTabsModule, MatButtonModule, RouterLink, RouterOutlet],
  templateUrl: './result.component.html',
  styleUrl: './result.component.scss'
})
export class ResultComponent {
  quizId: number = 0; // 儲存目前的 quizId

  links = [
    { path: 'feedbackList', name: '問卷回饋' },
    { path: 'count', name: '統計結果' },
  ];

  activeLink = this.links[0].name;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private infoService: InfoService
  ) {
    // 取得 URL 中的 query param
    this.route.queryParams.subscribe(params => {
      const idFromUrl = Number(params['id']);

      // 優先使用網址中的 id，其次 InfoService 中的 quizId
      this.quizId = idFromUrl || this.infoService.quizId || 0;

      // 若網址中沒帶 id，但 InfoService 中有 quizId，補上去
      if (!idFromUrl && this.quizId) {
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { id: this.quizId },
          queryParamsHandling: 'merge',
          replaceUrl: true
        });
      }
    });

    // 追蹤使用者點擊哪個 tab，切換 active 樣式
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const currentRoute = event.url.split('/').pop();
        for (let link of this.links) {
          if (link.path === currentRoute) {
            this.activeLink = link.name;
          }
        }
      }
    });
  }

  // 導向 tab 頁面，並保留目前的 quizId 作為 query param
  navigate(path: string) {
    this.router.navigate([`/result/${path}`], {
      queryParams: { id: this.quizId }
    });
  }
}
