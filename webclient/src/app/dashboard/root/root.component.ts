import { Component, OnInit, OnDestroy } from '@angular/core';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.css']
})
export class RootComponent implements OnInit, OnDestroy {
  public id: number;
  public backgroundColor: string;
  constructor(public settingService: SettingsService) {
    this.id = settingService.getSidebarImageIndex() + 1;
    this.backgroundColor = settingService.getSidebarColor();
  }

  ngOnInit() {
    this.settingService.sidebarImageIndexUpdate.subscribe((id: number) => {
      this.id = id + 1;
    });
    this.settingService.sidebarColorUpdate.subscribe((color: string) => {
      this.backgroundColor = color;
    });
  }

  ngOnDestroy() {
    this.settingService.sidebarImageIndexUpdate.unsubscribe();
    this.settingService.sidebarColorUpdate.unsubscribe();
  }
}
