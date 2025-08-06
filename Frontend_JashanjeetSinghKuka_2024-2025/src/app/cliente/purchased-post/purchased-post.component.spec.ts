import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchasedPostComponent } from './purchased-post.component';

describe('PurchasedPostComponent', () => {
  let component: PurchasedPostComponent;
  let fixture: ComponentFixture<PurchasedPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchasedPostComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchasedPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
