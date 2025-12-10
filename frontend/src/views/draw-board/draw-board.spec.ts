import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawBoard } from './draw-board';

describe('DrawBoard', () => {
  let component: DrawBoard;
  let fixture: ComponentFixture<DrawBoard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrawBoard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrawBoard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
