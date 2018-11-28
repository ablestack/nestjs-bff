import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';

@NgModule({
  imports: [CommonModule, RouterModule],
  declarations: [HeaderComponent, FooterComponent, NavbarComponent, SidebarComponent],
  exports: [HeaderComponent, FooterComponent, NavbarComponent, SidebarComponent],
})
export class ComponentsModule {}
