import {Component} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import {FieldType} from '../../models/form.model';


type FieldFromDb = {
  type: FieldType; title: string; desc: string; isRequired: boolean; options?: string[];
};

type FormFromDb = {
  name: string; desc: string; fields: FieldFromDb[];
};

const atLeastOneChecked: ValidatorFn = (ctrl: AbstractControl): ValidationErrors | null => {
  const fa = ctrl as FormArray<FormControl<boolean>>;
  const ok = fa.controls.some(c => c.value);
  return ok ? null : {required: true};
};


@Component({
  selector: 'app-form', imports: [ReactiveFormsModule], templateUrl: './form.html', styleUrl: './form.css',
})
export class Form {


  protected sampleResponse: FormFromDb = {
    name: 'New Form',
    desc: 'New Form Description',
    fields: [{type: 'text', title: 'Email', isRequired: false, desc: 'Enter Email'}, {
      type: 'checkbox', title: 'CheckBox', options: ['Option 1', 'Option 2'], isRequired: true, desc: 'Select Options'
    }, {
      type: 'select',
      title: 'Select',
      options: ['Option 1', 'Option 2 ', 'Option 3'],
      isRequired: false,
      desc: 'Choose option'
    }, {
      type: 'email', title: 'Email', isRequired: false, desc: 'Enter Email',
    }]
  };

  protected formGroup: FormGroup;
  protected submitted = false;

  constructor(private fb: FormBuilder) {
    this.formGroup = this.buildForm(this.sampleResponse);
  }

  protected fields(): FieldFromDb[] {
    return this.sampleResponse.fields;
  }

  protected fieldKey(index: number): string {
    return `f_${index}`;
  }

  protected checkboxArray(index: number): FormArray<FormControl<boolean>> {
    return this.formGroup.get(this.fieldKey(index)) as FormArray<FormControl<boolean>>;
  }

  protected hasError(index: number, error: string): boolean {
    const c = this.formGroup.get(this.fieldKey(index));
    return !!c && c.touched && c.hasError(error);
  }

  protected submit(): void {
    this.submitted = false;
    this.formGroup.markAllAsTouched();

    if (this.formGroup.invalid) return;

    const answers = this.sampleResponse.fields.map((f, i) => {
      if (f.type === 'checkbox') {
        const arr = this.checkboxArray(i);
        const selected = (f.options ?? []).filter((_, oi) => !!arr.at(oi)?.value);
        return {type: f.type, title: f.title, value: selected};
      }

      const v = this.formGroup.get(this.fieldKey(i))?.value ?? '';
      return {type: f.type, title: f.title, value: String(v)};
    });

    // this.store.save({
    //   formName: this.sampleResponse.name, submittedAt: new Date().toISOString(), answers
    // });

    this.submitted = true;
    this.formGroup.reset(this.buildForm(this.sampleResponse).getRawValue());
  }

  private buildForm(def: FormFromDb): FormGroup {
    const group: Record<string, AbstractControl> = {};

    def.fields.forEach((f, i) => {
      const key = this.fieldKey(i);

      if (f.type === 'checkbox') {
        const opts = f.options ?? [];
        const arr = this.fb.array(opts.map(() => this.fb.control(false, {nonNullable: true})));
        if (f.isRequired) arr.addValidators(atLeastOneChecked);
        group[key] = arr;
        return;
      }

      const validators = f.isRequired ? [Validators.required] : [];

      if (f.type === 'email') validators.push(Validators.email);
      group[key] = this.fb.control<string>('', {nonNullable: true, validators});
    });

    return this.fb.group(group);
  }


}
