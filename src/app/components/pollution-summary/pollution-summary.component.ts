import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { PollutionDeclaration } from '../../interfaces/pollution-declaration.interface';

@Component({
  selector: 'app-pollution-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pollution-summary.component.html',
  styleUrls: ['./pollution-summary.component.css']
})
export class PollutionSummaryComponent implements OnInit, OnChanges {
  @Input() declarations: PollutionDeclaration[] = [];
  @Input() highlightLast: boolean = false;

  lastDeclarationIndex: number = -1;
  currentDate: Date = new Date();

  ngOnInit(): void {
    this.updateLastDeclarationIndex();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['declarations']) {
      this.updateLastDeclarationIndex();
    }
  }

  private updateLastDeclarationIndex(): void {
    this.lastDeclarationIndex = this.declarations.length - 1;
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  }

  formatCoordinates(lat: number, lng: number): string {
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  }

  getGoogleMapsUrl(lat: number, lng: number): string {
    return `https://www.google.com/maps?q=${lat},${lng}`;
  }

  deleteDeclaration(index: number): void {
    this.declarations.splice(index, 1);
  }

  getTotalDeclarations(): number {
    return this.declarations.length;
  }

  getDeclarationsByType(): { [key: string]: number } {
    const counts: { [key: string]: number } = {};
    this.declarations.forEach(declaration => {
      counts[declaration.type] = (counts[declaration.type] || 0) + 1;
    });
    return counts;
  }

  getPollutionTypeClass(type: string): string {
    return 'type-' + type.toLowerCase().replace(/\s+/g, '-');
  }

  isLastDeclaration(index: number): boolean {
    return this.highlightLast && index === this.lastDeclarationIndex;
  }

  getCardClass(index: number): string {
    let classes = 'declaration-card';
    if (this.isLastDeclaration(index)) {
      classes += ' last-declaration';
    }
    return classes;
  }

  formatDateTime(date: Date): string {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }

  getDeclarationId(index: number): string {
    return `declaration-${index + 1}`;
  }
}
