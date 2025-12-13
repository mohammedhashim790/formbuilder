import {Component} from '@angular/core';
import {MatTab, MatTabGroup} from '@angular/material/tabs';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {CdkDragHandle} from '@angular/cdk/drag-drop';
import {TitleCasePipe} from '@angular/common';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';


type FormConfig = {
  type: 'text' | 'checkbox' | 'select', title: string, desc?: string, options?: string[], isRequired: boolean
}

@Component({
  selector: 'app-create-form',
  standalone: true,
  imports: [MatTab, MatTabGroup, MatButton, MatIconButton, MatIcon, CdkDragHandle, TitleCasePipe],
  templateUrl: './create-form.html',
  styleUrl: './create-form.css'
})
export class CreateForm {


  private formBuilder: FormBuilder = new FormBuilder();
  formGroup: FormGroup;


  protected get field() {
    return this.formGroup.get('fields') as FormArray<FormGroup>;
  }

  protected get fieldValues() {
    return this.formGroup.get('fields')?.value as Array<FormConfig>;
  }


  constructor() {
    this.formGroup = this.formBuilder.group({
      name: new FormControl(''), desc: new FormControl(''), fields: this.formBuilder.array<FormConfig>([])
    })
  }

  protected addField(type: "text" | "checkbox" | "select") {
    this.field.push(this.formBuilder.group({
      type: type, title: "",
    }))
  }

  protected removeField(index: number) {
    this.field.removeAt(index);
  }


  protected onSubmit() {
    console.log(this.formGroup.value)
  }
}
