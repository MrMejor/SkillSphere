import { Component, OnInit } from '@angular/core';
import { StatsComponent } from '../control-panel-tabs/stats/stats.component';
import { GraphicsComponent } from '../control-panel-tabs/graphics/graphics.component';
import { CommonModule } from '@angular/common';
import { UserPostSummary } from '../../services/interfaces/auth';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-control-panel',
  standalone: true,
  imports: [
    CommonModule,  // Needed for *ngFor and other Angular directives
    StatsComponent,
    GraphicsComponent
  ],
  templateUrl: './control-panel.component.html',
  styleUrl: './control-panel.component.scss'
})
export class ControlPanelComponent implements OnInit {
  userSummaries: UserPostSummary[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.userService.getAllUserPostSummaries().subscribe(data => {
      this.userSummaries = data;
    });
  }

  deleteUser(username: string): void {
    if (confirm(`Are you sure you want to delete ${username}?`)) {
      this.userService.deleteUser(username).subscribe(() => {
        this.userSummaries = this.userSummaries.filter(u => u.username !== username);
      });
    }
  }
}
