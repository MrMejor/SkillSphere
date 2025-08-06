import { Component, OnInit } from '@angular/core';
import { SettingsStatusService } from '../../../services/status/settings-status.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  isActiveSettings: boolean = true;

  constructor(private settingsStatusService: SettingsStatusService) {}

  ngOnInit(): void {
    this.settingsStatusService.status$.subscribe((status) => {
      this.isActiveSettings = status;
    });
  }
}