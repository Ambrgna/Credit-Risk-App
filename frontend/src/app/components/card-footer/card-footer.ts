import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-card-footer',
  imports: [CommonModule],
  templateUrl: './card-footer.html',
  styleUrl: './card-footer.css'
})
export class CardFooter {
model1Result: number | null = 75;
model2Result: number | null = 25;


model1Image: string | null = null;
model2Image: string | null = null;

loadingModel1: boolean = false;
loadingModel2: boolean = false;


getPredictionLabel(value: number): string {
  if (value >= 0 && value <= 33) return 'Rejected';
  if (value > 33 && value <= 66) return 'Pending';
  return 'Approved';
}

getAlertClass(value: number): string {
  if (value >= 0 && value <= 33) return 'alert-danger';   // Red
  if (value > 33 && value <= 66) return 'alert-warning'; // Yellow
  return 'alert-success';                                  // Green
}

getAverageResult(): number | null {
  if (this.model1Result !== null && this.model2Result !== null) {
    return (this.model1Result + this.model2Result) / 2;
  }
  return null;
}

getAverageLabel(): string {
  const avg = this.getAverageResult();
  return avg !== null ? this.getPredictionLabel(avg) : '';
}

getAverageAlertClass(): string {
  const avg = this.getAverageResult();
  return avg !== null ? this.getAlertClass(avg) : 'alert-secondary';
}


}
