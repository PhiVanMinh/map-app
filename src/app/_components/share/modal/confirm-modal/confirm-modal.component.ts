import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent implements OnInit {
  @ViewChild('modal') public modal!: ModalDirective;
  @Input() title: string = 'Confirmation';

  content!: string;
  type: number | undefined;

  @Output('modalAccept') modalAccept = new EventEmitter();

    
    constructor(
      public translate: TranslateService
    ) { }

  ngOnInit(
  ) {
  }

  hide() {
    this.modal.hide();
  }

  show(content?: string, type?: number) {
    this.content = content ?? 'AreYouSure';
    this.type = type;
    this.modal.show();
  }

  accept() {
    this.modalAccept.emit(this.type);
    this.hide();
  }

}
