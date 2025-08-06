import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillSphereComponent } from './skillSphere.component';

describe('SkillSphere', () => {
  let component: SkillSphereComponent;
  let fixture: ComponentFixture<SkillSphereComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkillSphereComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkillSphereComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
