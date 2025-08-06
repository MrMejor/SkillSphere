import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SettingsStatusService {
  // BehaviorSubject to manage the visibility state
  private _isSettingsVisible = new BehaviorSubject<boolean>(false);
  status$ = this._isSettingsVisible.asObservable();

  constructor() {}

  // Method to toggle the settings visibility
  toggleSettings() {
    this._isSettingsVisible.next(!this._isSettingsVisible.value);
  }

  // Method to open the settings
  openSettings() {
    this._isSettingsVisible.next(true);
  }

  // Method to close the settings
  closeSettings() {
    this._isSettingsVisible.next(false);
  }
}