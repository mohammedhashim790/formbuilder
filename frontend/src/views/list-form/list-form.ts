import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
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
import {FormFromDb} from '../../models/form.model';
import {DatePipe} from '@angular/common';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatDivider, MatListItemTitle} from '@angular/material/list';
import {RouterLink} from '@angular/router';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {FormService} from '../../services/form/form.service';


@Component({
  selector: 'app-list-form',
  standalone: true,
  imports: [MatTable, MatColumnDef, MatHeaderCell, MatCell, MatCellDef, MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef, DatePipe, MatIconButton, MatIcon, MatButton, MatListItemTitle, MatDivider, RouterLink, MatMenu, MatMenuItem, MatMenuTrigger],
  templateUrl: './list-form.html',
  styleUrl: './list-form.css'
})
export class ListForm implements OnInit {

  displayedColumns: string[] = ['Form Link', 'Form Name', 'Created At', 'Actions'];
  dataSource: FormFromDb[] = [];

  constructor(private formService: FormService, private changeDetector: ChangeDetectorRef) {
    this.read();
  }

  ngOnInit(): void {
  }

  private read() {
    this.formService.list().then((res) => {
      this.dataSource = res
      this.changeDetector.detectChanges();
    });
  }

}
