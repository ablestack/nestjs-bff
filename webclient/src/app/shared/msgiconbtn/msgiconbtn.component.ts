import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-msgiconbtn',
  templateUrl: './msgiconbtn.component.html',
  styleUrls: ['./msgiconbtn.component.css']
})
export class MsgIconBtnComponent implements OnInit {
  @Input() number: string;
  @Input() icon: string;
  constructor() { }

  ngOnInit() {
  }

}
