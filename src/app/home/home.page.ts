import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar,
  IonGrid,
  IonRow,
  IonCol,
  IonButton
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonGrid,
    IonRow,
    IonCol,
    IonButton
  ]
})
export class HomePage {
  display: string = '0';
  currentInput: string = '';
  previousInput: string = '';
  operator: string = '';
  waitingForNewInput: boolean = true;

  constructor() {}

  // Disparar vibración táctil
  async hapticFeedback() {
    try {
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch (e) {
      // Ignorar error si se corre en web
    }
  }

  addNumber(num: string) {
    this.hapticFeedback();
    if (this.waitingForNewInput) {
      this.display = num;
      this.waitingForNewInput = false;
    } else {
      if (this.display === '0' && num !== '.') {
        this.display = num;
      } else {
        this.display += num;
      }
    }
  }

  addDecimal() {
    this.hapticFeedback();
    if (this.waitingForNewInput) {
      this.display = '0.';
      this.waitingForNewInput = false;
    } else if (this.display.indexOf('.') === -1) {
      this.display += '.';
    }
  }

  setOperator(op: string) {
    this.hapticFeedback();
    if (this.operator && !this.waitingForNewInput) {
      this.calculate(false); // calcular sin vibrar de nuevo
    }

    this.operator = op;
    this.previousInput = this.display;
    this.waitingForNewInput = true;
  }

  calculate(withHaptic = true) {
    if (withHaptic) this.hapticFeedback();
    
    if (this.previousInput && this.operator && !this.waitingForNewInput) {
      const prev = parseFloat(this.previousInput);
      const current = parseFloat(this.display);
      
      if (isNaN(prev) || isNaN(current)) {
        this.display = 'Error';
        this.clearAll();
        return;
      }

      let result: number;

      switch (this.operator) {
        case '+': result = prev + current; break;
        case '-': result = prev - current; break;
        case '×': result = prev * current; break;
        case '÷':
          if (current === 0) {
            this.display = 'Error';
            this.clearAll();
            return;
          }
          result = prev / current;
          break;
        default: return;
      }

      this.display = this.formatResult(result);
      this.operator = '';
      this.previousInput = '';
      this.waitingForNewInput = true;
    }
  }

  private formatResult(result: number): string {
    if (Number.isInteger(result)) {
      return result.toString();
    }
    const formatted = result.toFixed(8);
    return formatted.replace(/\.?0+$/, '');
  }

  percentage() {
    this.hapticFeedback();
    const value = parseFloat(this.display);
    if (!isNaN(value)) {
      this.display = (value / 100).toString();
      this.waitingForNewInput = true;
    }
  }

  toggleSign() {
    this.hapticFeedback();
    const value = parseFloat(this.display);
    if (!isNaN(value)) {
      this.display = (value * -1).toString();
    }
  }

  clearAll() {
    this.hapticFeedback();
    this.display = '0';
    this.currentInput = '';
    this.previousInput = '';
    this.operator = '';
    this.waitingForNewInput = true;
  }

  backspace() {
    this.hapticFeedback();
    if (!this.waitingForNewInput && this.display.length > 1) {
      this.display = this.display.slice(0, -1);
      if (this.display === '' || this.display === '-') {
        this.display = '0';
        this.waitingForNewInput = true;
      }
    } else if (this.display.length === 1) {
      this.display = '0';
      this.waitingForNewInput = true;
    }
  }
}