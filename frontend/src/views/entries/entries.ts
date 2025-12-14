import {ChangeDetectorRef, Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {EntryService} from '../../services/entry/entry.service';
import {MatDivider, MatListItemTitle} from '@angular/material/list';
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
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-entries',
  imports: [MatDivider, MatListItemTitle, MatTable, MatHeaderCell, MatHeaderCellDef, MatCell, MatCellDef, MatColumnDef, MatHeaderRow, MatRow, MatHeaderRowDef, MatRowDef],
  templateUrl: './entries.html',
  styleUrl: './entries.css',
})
export class Entries {
  private formId: string = '';


  protected records: any[] = [];
  protected headers: string[] = [];


  constructor(private entryService: EntryService, private cdr: ChangeDetectorRef, private ar: ActivatedRoute) {
    this.read(this.ar.snapshot.queryParamMap.get('id') ?? '');

  }

  private read(id: string) {
    this.formId = id;
    this.entryService.list(this.formId).then((res) => {

      this.records = res.map(item => ({
        checkedIn: (item.checkedIn ?? false) ? '✓' : '',
        checkedInAt: new DatePipe('en').transform(item.checkedInAt ?? null, 'medium'), ...(item.record ?? {})
      }));
      if (this.records.length > 0) {
        const recordWithMostColumns = this.records.reduce((max, curr) => Object.keys(curr).length > Object.keys(max).length ? curr : max);

        this.headers = Object.keys(recordWithMostColumns);
        debugger;
      } else {
        this.headers = [];
      }
      this.cdr.detectChanges();
      debugger;
    });
  }

  protected readonly Array = Array;
}
