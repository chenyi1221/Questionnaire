import { Component } from '@angular/core';
import Chart from 'chart.js/auto';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientService } from '../@http-service/http-client.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-count',
  imports: [CommonModule],
  templateUrl: './count.component.html',
  styleUrl: './count.component.scss',
  standalone: true,
})
export class CountComponent {
  constructor(
    private router: Router,
    private httpClientService: HttpClientService,
    private route: ActivatedRoute,
  ) { }

  charts: { [id: string]: Chart } = {};
  chartData: any[] = [];
  id!: number;
  qName!: String;
  optionCountVoList: any[] = [];
  optionName!: String;
  count!: number;
  labels!: String;
  isFromManager: boolean = false;



  ngAfterViewInit(): void {
    this.chartPie();
  }


  // 圖表畫法
  chartPie() {
    setTimeout(() => {
      for (let count of this.chartData) {
        const ctx = document.getElementById(count.id) as HTMLCanvasElement;
        if (!ctx) {
          console.warn(`找不到 canvas 元素，ID: ${count.id}`);
          continue;
        }

        // 若已存在，先銷毀
        if (this.charts[count.id]) {
          this.charts[count.id].destroy();
        }

        // 建立新圖表並存入
        this.charts[count.id] = new Chart(ctx, {
          type: 'pie',
          data: {
            labels: count.labels,
            datasets: [{
              label: '票數',
              data: count.data,
              backgroundColor: count.backgroundColor,
              hoverOffset: 20
            }]
          },
          options: {
            responsive: false,
            plugins: {
              title: {
                display: true,
                text: count.id + "." + count.qName,
                color: '#000000',
                font: {
                  size: 20,
                  weight: 'bold',
                },
                align: 'start'
              },
              legend: {
                position: 'right',
                labels: {
                  font: {
                    size: 15,
                    weight: 'bold'
                  },
                  boxWidth: 20,
                  padding: 20,
                  color: '#000000',
                },
              },
            },
            elements: {
              arc: {
                borderWidth: 3,
                borderColor: "#000000",
                hoverBorderWidth: 3,
                hoverBorderColor: "#fff"
              }
            }
          }
        });
      }
    }, 100);

    for (let count of this.chartData) {
      const el = document.getElementById(count.id);
    }

  }

  generateColors(count: number): string[] {
    const baseColors = ['#2E7D32', '#b0c336', '#4caf50', '#26A69A', '#a8d492', '#32CD32', '#36A2EB', '#FFCE56'];
    return Array.from({ length: count }, (_, i) => baseColors[i % baseColors.length]);
  }


  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const quizId = +params['id'];

      this.isFromManager = this.router.url.includes('/result/');

      if (isNaN(quizId) || quizId <= 0) {
        alert('無效的問卷 ID');
        return;
      }

      this.httpClientService.postApi(`http://localhost:8080/quiz/statistics?quizId=${quizId}`, {})
        .subscribe((res: any) => {

          const quizList = res.statisticsVoList ?? [];
          if (quizList.length === 0) {
            console.log('統計資料為空');
          }

          this.chartData = quizList.map((item: any) => ({
            id: item.quesId,
            qName: item.question,
            labels: item.optionCountVoList.map((opt: any) => opt.option),
            data: item.optionCountVoList.map((opt: any) => opt.count),
            optionCountVoList: item.optionCountVoList,
            backgroundColor: this.generateColors(item.optionCountVoList.length)
          }));
          this.chartPie(); // 只在資料載入完後呼叫
        }, error => {
          console.error('API 請求錯誤:', error);
          alert('請求資料時發生錯誤，請稍後再試。');
        });
    });
  }

  goBackToList() {
    this.router.navigate(['/list']);
  }

  goBackToManagerList() {
    this.router.navigate(['/managerList']);
  }

}
