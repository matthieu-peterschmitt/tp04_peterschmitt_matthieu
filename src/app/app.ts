import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { PollutionFormComponent } from './components/pollution-form/pollution-form.component';
import { PollutionSummaryComponent } from './components/pollution-summary/pollution-summary.component';
import { PollutionDeclaration } from './interfaces/pollution-declaration.interface';

@Component({
  selector: 'app-root',
  imports: [CommonModule, PollutionFormComponent, PollutionSummaryComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
  protected readonly title = signal('tp2');
  protected readonly declarations = signal<PollutionDeclaration[]>([]);

  protected readonly hasDeclarations = computed(() => this.declarations().length > 0);
  protected readonly lastDeclaration = computed(() => {
    const declarations = this.declarations();
    return declarations.length > 0 ? declarations[declarations.length - 1] : null;
  });

  onDeclarationSubmitted(declaration: PollutionDeclaration): void {
    this.declarations.update(current => [...current, declaration]);

    console.log('Nouvelle déclaration ajoutée:', declaration);
    console.log('Total des déclarations:', this.declarations().length);
  }

  onDeclarationDeleted(index: number): void {
    this.declarations.update(current => {
      const updated = [...current];
      updated.splice(index, 1);
      return updated;
    });
  }
}
