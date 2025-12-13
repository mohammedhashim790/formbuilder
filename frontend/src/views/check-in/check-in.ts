import {Component} from '@angular/core';
import {Form} from '../../models/form.model';
import {DatePipe} from '@angular/common';
import {MatIconButton} from '@angular/material/button';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable
} from '@angular/material/table';
import {MatDivider, MatListItemTitle} from '@angular/material/list';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-check-in',
  imports: [DatePipe, MatCell, MatCellDef, MatColumnDef, MatDivider, MatHeaderCell, MatHeaderRow, MatHeaderRowDef, MatIcon, MatIconButton, MatListItemTitle, MatRow, MatRowDef, MatTable, MatHeaderCellDef],
  templateUrl: './check-in.html',
  styleUrl: './check-in.css',
})
export class CheckIn {


  displayedColumns: string[] = ['Form Link', 'Form Name', 'Created At', 'Actions'];
  dataSource: Form[];

  constructor() {
    this.dataSource = new Array<Form>(10).fill({
      created_at: new Date(), formName: '', id: 0, link: 'https://google.com'
    }).map((_, index) => {
      const res: Form = {
        id: index, formName: `formName ${index}`, created_at: new Date(), link: 'https://google.com'
      };
      return res;
    });
    console.log(this.dataSource);
  }

}
