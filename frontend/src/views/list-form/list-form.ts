import {Component} from '@angular/core';
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
import {Form} from '../../models/form.model';
import {DatePipe} from '@angular/common';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatDivider, MatListItemTitle} from '@angular/material/list';
import {RouterLink} from '@angular/router';


@Component({
  selector: 'app-list-form',
  standalone: true,
  imports: [MatTable, MatColumnDef, MatHeaderCell, MatCell, MatCellDef, MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef, DatePipe, MatIconButton, MatIcon, MatButton, MatListItemTitle, MatDivider, RouterLink],
  templateUrl: './list-form.html',
  styleUrl: './list-form.css'
})
export class ListForm {

  displayedColumns: string[] = ['Form Link', 'Form Name', 'Created At', 'Actions'];
  dataSource: Form[];

  constructor() {
    this.dataSource = new Array<Form>(10).fill({created_at: new Date(), formName: '', id: 0, link:'https://google.com'}).map((_, index) => {
      const res: Form = {
        id: index, formName: `formName ${index}`, created_at: new Date(), link:'https://google.com'
      };
      return res;
    });
    console.log(this.dataSource);
  }

}
