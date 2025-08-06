import { Component, OnInit } from '@angular/core';

import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-stats',
  imports: [],
  standalone: true,
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.scss'
})
export class StatsComponent implements OnInit {
  totalPosts: number = 0;
  totalUsers: number = 0;
  totalStudents: number = 0;
  totalTeachers: number = 0;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getAllStats().subscribe({
      next: (stats) => {
        this.totalPosts = stats.totalPosts;
        this.totalUsers = stats.totalUsers;
        this.totalStudents = stats.totalStudents;
        this.totalTeachers = stats.totalTeachers;
      },
      error: (err) => {
        console.error('Error fetching statistics:', err);
      }
    });
  }
}
