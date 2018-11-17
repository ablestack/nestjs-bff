import {Component, OnInit} from '@angular/core';
declare const $: any;

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
  }

  btnClick(position) {
    let from = 'top';
    let align = 'right';
    let type = 'info';
    switch (position) {
      case 'top-left':
        align = 'left';
        type = 'rose';
        break;
      case 'top-center':
        align = 'center';
        type = 'success';
        break;
      case 'bottom-left':
        align = 'left';
        from = 'bottom';
        type = 'primary';
        break;
      case 'bottom-center':
        align = 'center';
        from = 'bottom';
        type = 'warning';
        break;
      case 'bottom-right':
        from = 'bottom';
        type = 'danger';
        break;
    }
    $.notify({
      message: 'Welcome to <b>MATERIAL DASHBOARD</b> - a beautiful dashboard for every web developer.',
    }, {
      placement: {from, align},
      offset: {x: 20, y: 35},
      type,
      template: `<div class="alert alert-{0} alert-with-icon col-md-4">
          <i class="material-icons alert-icon">notifications</i>
          <button class="close" type="button" data-dismiss="alert" aria-label="Close"><i class="material-icons">close</i></button>
          <span>{2}</span>
        </div>`
    });
  }

}
