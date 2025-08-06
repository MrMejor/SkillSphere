import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddPostModalComponent } from './add-post-modal.component';

describe('AddProductModalComponent', () => {
  let component: AddPostModalComponent;
  let fixture: ComponentFixture<AddPostModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPostModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPostModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
