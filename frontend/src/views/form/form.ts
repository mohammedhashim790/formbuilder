import {ChangeDetectorRef, Component} from '@angular/core';
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
import {FieldFromDb, FormFromDb} from '../../models/form.model';
import {FormService} from '../../services/form/form.service';
import {ActivatedRoute} from '@angular/router';


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
    createdAt: '', updateAt: '', title: '', desc: '', link: '', fields: []
  };

  private formId: string = ''

  protected formGroup!: FormGroup;
  protected submitted = false;

  constructor(private fb: FormBuilder, private formService: FormService, private cdr: ChangeDetectorRef, private ar: ActivatedRoute) {
    this.read(this.ar.snapshot.queryParamMap.get('id') ?? '');

  }

  private read(id: string) {
    this.formId = id;
    this.formService.getById(id).then(res => {
      this.sampleResponse = res;
      this.formGroup = this.buildForm(this.sampleResponse);
      this.cdr.detectChanges();
    });
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

    const userMap = new Map<string, any>();

    userMap.set('formId', this.formId);

    for (let i = 0; i < this.sampleResponse.fields.length; i++) {
      const f = this.sampleResponse.fields[i];
      const key = f.title;
      var res = {};
      if (f.type === 'checkbox') {
        const arr = this.checkboxArray(i);
        userMap.set(key, (f.options ?? []).filter((_, oi) => !!arr.at(oi)?.value));

      } else {
        userMap.set(key, String(this.formGroup.get(this.fieldKey(i))?.value ?? ''));
      }
    }

    console.log(Object.fromEntries(userMap.entries()));

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
