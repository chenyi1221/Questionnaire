import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ManagerService } from '../@service/manager.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
constructor(
  private router: Router,
  private managerService: ManagerService
){}


  goBackToList(){
    this.router.navigate(['/list'])
  }

  login(){
    this.managerService.manager = true;
    this.router.navigate(['/managerList'])
}
}
