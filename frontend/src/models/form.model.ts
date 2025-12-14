import {FormArray, FormControl} from '@angular/forms';

export type Form = {
  id: number; formName: string; created_at: Date; link: string;
}


export type FieldType = 'text' | 'checkbox' | 'select' | 'email';

export type FormConfig = {
  type: FieldType,
  title: FormControl<string>,
  desc: FormControl<string>,
  options: FormArray<FormControl>,
  isRequired: FormControl<boolean>
}


export type FieldFromDb = {
  type: FieldType; title: string; desc: string; isRequired: boolean; options?: string[];
};

export type FormFromDb = {
  title: string; desc: string; fields: FieldFromDb[]; createdAt: string; updateAt: string; link: string;
};



