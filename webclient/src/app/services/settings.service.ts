import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class SettingsService {
  public sidebarImageIndex = 0;
  public sidebarImageIndexUpdate: EventEmitter<number> = new EventEmitter();
  public sidebarFilter = '#fff';
  public sidebarFilterUpdate: EventEmitter<string> = new EventEmitter();
  public sidebarColor = '#D80B0B';
  public sidebarColorUpdate: EventEmitter<string> = new EventEmitter();

  constructor() { }

  getSidebarImageIndex(): number {
    return this.sidebarImageIndex;
  }
  setSidebarImageIndex(id) {
    this.sidebarImageIndex = id;
    this.sidebarImageIndexUpdate.emit(this.sidebarImageIndex);
  }
  getSidebarFilter(): string {
    return this.sidebarFilter;
  }
  setSidebarFilter(color: string) {
    this.sidebarFilter = color;
    this.sidebarFilterUpdate.emit(this.sidebarFilter);
  }
  getSidebarColor(): string {
    return this.sidebarColor;
  }
  setSidebarColor(color: string) {
    this.sidebarColor = color;
    this.sidebarColorUpdate.emit(this.sidebarColor);
  }
}
