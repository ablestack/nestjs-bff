import { Component, OnInit } from '@angular/core';
declare const swal: any;

@Component({
  selector: 'app-sweetalert',
  templateUrl: './sweetalert.component.html',
  styleUrls: ['./sweetalert.component.css']
})
export class SweetAlertComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  openAlert(type) {
    switch (type) {
      case 'basic':
        swal({
          title: 'Here\'s a message!',
          confirmButtonClass: 'btn btn-success'
        });
        break;
      case 'text':
        swal({
          title: 'Good job!',
          text: 'It\'s pretty, isn\'t it?',
          confirmButtonClass: 'btn btn-info'
        });
        break;
      case 'success':
        swal({
          title: 'Good job!',
          text: 'You clicked the button!',
          type: 'success',
          confirmButtonClass: 'btn btn-success'
        });
        break;
      case 'html':
        swal({
          title: '<i>HTML</i> <u>example</u>',
          type: 'info',
          html:
          `You can use <b>bold text</b><a href="//github.com">links</a>and other HTML tags`,
          showCloseButton: true,
          showCancelButton: true,
          confirmButtonText: '<i class="fa fa-thumbs-up"></i> Great!',
          cancelButtonText: '<i class="fa fa-thumbs-down"></i>',
          confirmButtonClass: 'btn btn-primary',
          cancelButtonClass: 'btn btn-warning'
        });
        break;
      case 'confirm':
        swal({
          title: 'Are you sure?',
          text: 'You won\'t be able to revert this!',
          type: 'warning',
          showCancelButton: true,
          confirmButtonClass: 'btn btn-success',
          cancelButtonClass: 'btn btn-danger',
          confirmButtonText: 'YES, DELETE IT!'
        }).then(function () {
          swal({
            title: 'Deleted!',
            text: 'Your file has been deleted.',
            type: 'success',
            confirmButtonClass: 'btn btn-info'
          });
        });
        break;
      case 'cancel':
        swal({
          title: 'Are you sure?',
          text: 'You won\'t be able to revert this!',
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'YES, DELETE IT!',
          cancelButtonText: 'NO, CANCEL!',
          confirmButtonClass: 'btn btn-success',
          cancelButtonClass: 'btn btn-danger',
          buttonsStyling: false
        }).then(function () {
          swal({
            title: 'Deleted!',
            text: 'Your file has been deleted.',
            type: 'success',
            confirmButtonClass: 'btn btn-info'
          });
        }, function (dismiss) {
          // dismiss can be 'cancel', 'overlay',
          // 'close', and 'timer'
          if (dismiss === 'cancel') {
            swal({
              title: 'Cancelled',
              text: 'Your imaginary file is safe :)',
              type: 'error',
              confirmButtonClass: 'btn btn-info'
            });
          }
        });
        break;
      case 'close':
        swal({
          title: 'Auto close alert!',
          text: 'I will close in 2 seconds.',
          timer: 2000,
          showConfirmButton: false
        }).then(
          function () {},
          // handling the promise rejection
          function (dismiss) {
            if (dismiss === 'timer') {
              console.log('I was closed by the timer');
            }
          }
        );
        break;
      case 'input':
        swal({
          title: 'Input something',
          input: 'text',
          inputClass: 'mat-input-container',
          showCancelButton: true,
          confirmButtonText: 'OK',
          confirmButtonClass: 'btn btn-success',
          cancelButtonClass: 'btn btn-danger',
          showLoaderOnConfirm: true,
          preConfirm: function (text) {
            swal({
              text: 'Your entered: ' + text,
              type: 'success',
              confirmButtonClass: 'btn btn-info'
            });
          },
          allowOutsideClick: false
        });
        break;
    }
  }

}
