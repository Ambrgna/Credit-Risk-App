import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-footer',
  imports: [CommonModule],
  templateUrl: './card-footer.html',
  styleUrl: './card-footer.css'
})
export class CardFooter {  
@Input() modelResults?: any[];

model1Image: string | null = null;
model2Image: string | null = null;


getAlertClass(value: number): string {
  if (value >= 0 && value <= 33) return 'alert-danger';   // Red
  if (value > 33 && value <= 66) return 'alert-warning'; // Yellow
  return 'alert-success';                                  // Green
}

getAverageResult(): number | null {
  console.log(this.modelResults)
  const results = this.modelResults;

  if (results!==undefined&&results.length !== 0){
    const sum = results.reduce((a, b) => a.model_accuracy + b.model_accuracy, 0);
    return sum / results.length;
  }
   return null;
}

getAverageLabel(): string {
  const avg = this.getAverageResult();
  // return avg !== null ? this.getPredictionLabel(avg) : '';
  return "";
}

getAverageAlertClass(): string {
  const avg = this.getAverageResult();
  return avg !== null ? this.getAlertClass(avg) : 'alert-secondary';
}


}
