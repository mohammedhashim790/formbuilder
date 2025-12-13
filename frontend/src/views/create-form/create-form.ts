import {Component} from '@angular/core';
import {MatTab, MatTabGroup} from '@angular/material/tabs';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {CdkDragHandle} from '@angular/cdk/drag-drop';
import {TitleCasePipe} from '@angular/common';

@Component({
  selector: 'app-create-form',
  standalone: true,
  imports: [MatTab, MatTabGroup, MatButton, MatIconButton, MatIcon, CdkDragHandle, TitleCasePipe],
  templateUrl: './create-form.html',
  styleUrl: './create-form.css'
})
export class CreateForm {


  form: Array<{ field: 'text' | 'checkbox' | 'select' }> = [];

  constructor() {
  }

  protected addField(field: "text" | "checkbox" | "select") {
    this.form.push({field});
  }

  protected removeField(index: number) {
    this.form.splice(index, 1);
  }
}
