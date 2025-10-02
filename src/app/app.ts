import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { PollutionFormComponent } from './components/pollution-form/pollution-form.component';
import { PollutionSummaryComponent } from './components/pollution-summary/pollution-summary.component';
import { PollutionDeclaration } from './interfaces/pollution-declaration.interface';

@Component({
  selector: 'app-root',
  imports: [CommonModule, PollutionFormComponent, PollutionSummaryComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('tp2');
  declarations: PollutionDeclaration[] = [];
  currentDeclaration: PollutionDeclaration | null = null;

  onDeclarationSubmitted(declaration: PollutionDeclaration): void {
    // Ajouter la déclaration à la liste
    this.declarations.push(declaration);

    // affichage immédiat
    this.currentDeclaration = declaration;

    console.log('Nouvelle déclaration ajoutée:', declaration);
    console.log('Total des déclarations:', this.declarations.length);
  }

  hasDeclarations(): boolean {
    return this.declarations.length > 0;
  }

  getLastDeclaration(): PollutionDeclaration | null {
    return this.currentDeclaration;
  }
}
