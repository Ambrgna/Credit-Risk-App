
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Api } from '../../services/api';
import { Loan } from '../../interface/loan';
import { HomeOwnership, LoanIntent, LoanGrade } from '../../models/enums';
import { CommonModule } from '@angular/common';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';


@Component({
  selector: 'app-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './form.html',
  styleUrl: './form.css'
})
export class Form implements OnInit {

  loanForm!: FormGroup;

  // Enum options for dropdowns
  homeOwnershipOptions = Object.values(HomeOwnership);
  loanIntentOptions = Object.values(LoanIntent);
  loanGradeOptions = Object.values(LoanGrade);

  inputGroups: any[] = []; 
  
  constructor(private fb: FormBuilder, private api: Api) {}

  ngOnInit() {  
    this.inputGroups = [
      {
        name: 'Personal Info',
        inputs: [
          { name: 'person_age', type: 'number', label: 'Age', step: 1, min: 0},
          { name: 'person_income', type: 'number', label: 'Annual Income', step: 1, min: 0 },
          { name: 'person_homeownership', type: 'enum', label: 'Home Ownership', options: this.homeOwnershipOptions },
          { name: 'person_emplength', type: 'number', label: 'Employment Length (years)', step: 1, min: 0}
        ]
      },
      {
        name: 'Loan Info',
        inputs: [
          { name: 'loan_intent', type: 'enum', label: 'Loan Intent', options: this.loanIntentOptions },
          { name: 'loan_grade', type: 'enum', label: 'Loan Grade', options: this.loanGradeOptions },
          { name: 'loan_amnt', type: 'number', label: 'Loan Amount', step: 1, min: 0 },
          { name: 'loan_intrate', type: 'number', label: 'Interest Rate', step: .01, min: 0 },
          { name: 'loan_percentincome', type: 'number', label: 'Percent of Income', step: 1, min: 0, max:100 }
        ]
      },
      {
        name: 'Credit Info',
        inputs: [
          { name: 'defaultonfile', type: 'binary', label: 'Historical Default' },
          { name: 'credhistlength', type: 'number', label: 'Credit History Length (years)', step: 1, min: 0,  }
        ]
      }
    ];
    
    this.loanForm = this.fb.group({
      person_age: [null, [Validators.required, Validators.min(0), Validators.pattern(/^\d+$/)]],
      person_income: [null, [Validators.required, Validators.min(0), Validators.pattern(/^\d+$/)]],
      person_homeownership: [null, Validators.required],
      person_emplength: [
        null,
        [
          Validators.required,
          Validators.min(0),
          Validators.pattern(/^\d+$/),
          this.lengthValidator('person_age') 
        ]
      ],
      loan_intent: [null, Validators.required],
      loan_grade: [null, Validators.required],
      loan_amnt: [null, [Validators.required, Validators.min(0), Validators.pattern(/^\d+$/)]],
      loan_intrate: [null, [Validators.required, Validators.min(0)]],
      loan_percentincome: [null, [Validators.required, Validators.min(0)]],
      defaultonfile: [false, Validators.required],
      credhistlength: [
        null, 
        [
          Validators.required, 
          Validators.min(0),
          Validators.pattern(/^\d+$/),
          this.lengthValidator('person_age') 
        ]
      ]
    });
  }

  formatEnum(value: string): string {
    return value
      .toLowerCase()
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  lengthValidator(ageControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.parent) return null;

      const ageControl = control.parent.get(ageControlName);
      if (!ageControl) return null;

      const age = ageControl.value;
      const emplength = control.value;

      if (emplength != null && age != null && emplength > age) {
        return { greaterThanAge: true };
      }
      return null;
    };
  }

  submitLoan() {
    if (this.loanForm.valid) {
      const loan: Loan = this.loanForm.value;
      this.api.getLoanStatus(loan).subscribe({
        next: res => console.log('Loan submitted:', res),
        error: err => console.error(err)
      });
    } else {
      console.warn('Form is invalid');
      this.loanForm.markAllAsTouched();
    }
  }
}
