import {Component} from '@angular/core';
import {MatTab, MatTabGroup} from '@angular/material/tabs';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {CdkDragHandle} from '@angular/cdk/drag-drop';
import {TitleCasePipe} from '@angular/common';
import {FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';


type FormConfig = {
  type: 'text' | 'checkbox' | 'select',
  title: FormControl<string>,
  desc: FormControl<string>,
  options: FormArray<FormControl>,
  isRequired: FormControl<boolean>
}

@Component({
  selector: 'app-create-form',
  standalone: true,
  imports: [MatTab, MatTabGroup, MatButton, MatIconButton, MatIcon, CdkDragHandle, TitleCasePipe, ReactiveFormsModule],
  templateUrl: './create-form.html',
  styleUrl: './create-form.css'
})
export class CreateForm {


  private formBuilder: FormBuilder = new FormBuilder();
  formGroup: FormGroup;


  settingsForm: FormGroup;

  protected previewBundle = () => JSON.stringify(this.formGroup.value, null, 2);


  protected get field() {
    return this.formGroup.get('fields') as FormArray<FormGroup>;
  }

  protected get fieldValues() {
    return this.formGroup.get('fields')?.value as Array<FormConfig>;
  }


  constructor() {
    this.formGroup = this.formBuilder.group({
      name: new FormControl('Untitled Form'), desc: new FormControl(''), fields: this.formBuilder.array<FormConfig>([])
    });
    this.settingsForm = this.formBuilder.group({
      max_count: new FormControl<number | undefined>(undefined),
      ip_restrict: new FormControl<boolean>(false),
      email_user: new FormControl<boolean>(true)
    })
  }

  protected addField(type: "text" | "checkbox" | "select") {
    let group: FormGroup = this.formBuilder.group({});

    switch (type) {
      case "checkbox":
      case "select":
        group = this.formBuilder.group({
          type: type,
          title: new FormControl(),
          options: this.formBuilder.array<FormControl>([]),
          isRequired: new FormControl(false),
          desc: new FormControl<string>('')
        });
        break;

      case "text":
        group = this.formBuilder.group({
          type: type, title: new FormControl(), isRequired: new FormControl(false), desc: new FormControl<string>('')
        });
        break;
    }
    this.field.push(group);
  }

  protected addOptions(field: FormGroup) {
    this.optionArray(field).push(new FormControl(''))
  }

  protected removeField(index: number) {
    this.field.removeAt(index);
  }


  protected onSubmit() {
    console.log(JSON.stringify(this.formGroup.value, null, 2));

    console.log(this.settingsForm.value);
  }

  protected optionArray(field: FormGroup) {
    return (field.get('options') as FormArray<FormControl>);
  }

}
