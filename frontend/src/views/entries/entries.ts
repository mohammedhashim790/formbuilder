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
import {MatButton} from '@angular/material/button';
import {RecordService} from '../../services/record/record.service';

@Component({
  selector: 'app-entries',
  imports: [MatDivider, MatListItemTitle, MatTable, MatHeaderCell, MatHeaderCellDef, MatCell, MatCellDef, MatColumnDef, MatHeaderRow, MatRow, MatHeaderRowDef, MatRowDef, MatButton],
  templateUrl: './entries.html',
  styleUrl: './entries.css',
})
export class Entries {
  private formId: string = '';


  protected records: any[] = [];
  protected headers: string[] = [];


  constructor(private entryService: EntryService, private cdr: ChangeDetectorRef, private ar: ActivatedRoute, private recordService: RecordService) {
    this.read(this.ar.snapshot.queryParamMap.get('id') ?? '');

  }

  private read(id: string) {
    this.formId = id;
    this.entryService.list(this.formId).then((res) => {

      this.records = res.map(item => ({
        id: item.id, ...(item.record ?? {}),
        checkedIn: (item.checkedIn ?? false) ? '✓' : '',
        checkedInAt: new DatePipe('en').transform(item.checkedInAt ?? null, 'medium'),
      }));
      if (this.records.length > 0) {
        const recordWithMostColumns = this.records.reduce((max, curr) => Object.keys(curr).length > Object.keys(max).length ? curr : max);
        this.headers = Object.keys(recordWithMostColumns);
        this.headers.splice(this.headers.indexOf('id'), 1);
        this.headers.push('actions')

      } else {
        this.headers = [];
      }
      this.cdr.detectChanges();

    });
  }


  checkInUser(recordId: string) {
    console.log(recordId);
    this.recordService.checkIn(recordId).then((_) => window.location.reload());
  }

  protected readonly Array = Array;
}
