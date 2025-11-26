import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
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

  // Agregar número al display
  addNumber(num: string) {
    if (this.waitingForNewInput) {
      this.display = num;
      this.waitingForNewInput = false;
    } else {
      // Evitar múltiples ceros a la izquierda
      if (this.display === '0' && num !== '.') {
        this.display = num;
      } else {
        this.display += num;
      }
    }
  }

  // Agregar punto decimal
  addDecimal() {
    if (this.waitingForNewInput) {
      this.display = '0.';
      this.waitingForNewInput = false;
    } else if (this.display.indexOf('.') === -1) {
      this.display += '.';
    }
  }

  // Establecer operador (+, -, ×, ÷)
  setOperator(op: string) {
    if (this.operator && !this.waitingForNewInput) {
      this.calculate();
    }

    this.operator = op;
    this.previousInput = this.display;
    this.waitingForNewInput = true;
  }

  // Calcular resultado
  calculate() {
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
        case '+':
          result = prev + current;
          break;
        case '-':
          result = prev - current;
          break;
        case '×':
          result = prev * current;
          break;
        case '÷':
          if (current === 0) {
            this.display = 'Error';
            this.clearAll();
            return;
          }
          result = prev / current;
          break;
        default:
          return;
      }

      // Formatear el resultado
      this.display = this.formatResult(result);
      this.operator = '';
      this.previousInput = '';
      this.waitingForNewInput = true;
    }
  }

  // Formatear el resultado para evitar decimales largos
  private formatResult(result: number): string {
    // Si es un número entero, mostrar sin decimales
    if (Number.isInteger(result)) {
      return result.toString();
    }
    
    // Si tiene decimales, limitar a 8 decimales y quitar ceros sobrantes
    const formatted = result.toFixed(8);
    return formatted.replace(/\.?0+$/, '');
  }

  // Calcular porcentaje
  percentage() {
    const value = parseFloat(this.display);
    if (!isNaN(value)) {
      this.display = (value / 100).toString();
      this.waitingForNewInput = true;
    }
  }

  // Cambiar signo (+/-)
  toggleSign() {
    const value = parseFloat(this.display);
    if (!isNaN(value)) {
      this.display = (value * -1).toString();
    }
  }

  // Limpiar todo (C)
  clearAll() {
    this.display = '0';
    this.currentInput = '';
    this.previousInput = '';
    this.operator = '';
    this.waitingForNewInput = true;
  }

  // Limpiar entrada actual (CE)
  clearEntry() {
    this.display = '0';
    this.waitingForNewInput = true;
  }

  // Función de backspace (eliminar último carácter)
  backspace() {
    if (!this.waitingForNewInput && this.display.length > 1) {
      this.display = this.display.slice(0, -1);
      
      // Si después de borrar queda vacío, mostrar 0
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