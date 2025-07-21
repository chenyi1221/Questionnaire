import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-add',
  imports: [MatTabsModule, MatButtonModule, RouterLink, RouterOutlet],
  templateUrl: './add.component.html',
  styleUrl: './add.component.scss'
})
export class AddComponent {
  constructor(
    private router: Router,
  ) {
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        const currentRoute = event.url.split('/').pop();
        for (let link of this.links) {
          if (link.path == currentRoute) {
            this.activeLink = link.name;
          }
        }
      }
    });
  }

  links = [
    { path: 'addQuestionnaire', name: '新增問卷' },
    { path: 'addContent', name: '題目' },
  ];

  activeLink = this.links[0].name;
}
