import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PollutionDeclaration, PollutionType } from '../../interfaces/pollution-declaration.interface';

@Component({
  selector: 'app-pollution-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './pollution-form.component.html',
  styleUrls: ['./pollution-form.component.css']
})
export class PollutionFormComponent {
  @Output() declarationSubmitted = new EventEmitter<PollutionDeclaration>();

  pollutionForm: FormGroup;
  pollutionTypes = Object.values(PollutionType);
  isFormSubmitted = false;

  constructor(private formBuilder: FormBuilder) {
    this.pollutionForm = this.formBuilder.group({
      titre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      type: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      dateObservation: ['', [Validators.required, this.dateValidator]],
      lieu: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      latitude: ['', [Validators.required, this.coordinateValidator('latitude')]],
      longitude: ['', [Validators.required, this.coordinateValidator('longitude')]],
      photoUrl: ['', [this.urlValidator]]
    });
  }

  onSubmit(): void {
    if (this.pollutionForm.valid) {
      const formValue = this.pollutionForm.value;
      const declaration: PollutionDeclaration = {
        titre: formValue.titre.trim(),
        type: formValue.type as PollutionType,
        description: formValue.description.trim(),
        dateObservation: new Date(formValue.dateObservation),
        lieu: formValue.lieu.trim(),
        latitude: parseFloat(formValue.latitude),
        longitude: parseFloat(formValue.longitude),
        photoUrl: formValue.photoUrl ? formValue.photoUrl.trim() : undefined
      };

      this.declarationSubmitted.emit(declaration);
      this.isFormSubmitted = true;
    } else {
      this.markAllFieldsAsTouched();
    }
  }

  private markAllFieldsAsTouched(): void {
    Object.keys(this.pollutionForm.controls).forEach(key => {
      this.pollutionForm.get(key)?.markAsTouched();
    });
  }

  resetForm(): void {
    this.isFormSubmitted = false;
    this.pollutionForm.reset();
  }

  dateValidator(control: any) {
    if (!control.value) return null;

    const selectedDate = new Date(control.value);
    const today = new Date();
    const minDate = new Date('1900-01-01');

    if (isNaN(selectedDate.getTime())) {
      return { invalidDate: true };
    }

    if (selectedDate > today) {
      return { futureDate: true };
    }

    if (selectedDate < minDate) {
      return { tooOldDate: true };
    }

    return null;
  }

  coordinateValidator(type: 'latitude' | 'longitude') {
    return (control: any) => {
      if (!control.value) return null;

      const value = parseFloat(control.value);

      if (isNaN(value)) {
        return { invalidNumber: true };
      }

      if (type === 'latitude') {
        if (value < -90 || value > 90) {
          return { latitudeOutOfRange: true };
        }
      } else if (type === 'longitude') {
        if (value < -180 || value > 180) {
          return { longitudeOutOfRange: true };
        }
      }

      return null;
    };
  }

  urlValidator(control: any) {
    if (!control.value || control.value.trim() === '') return null;

    const urlPattern = /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|bmp|svg)(\?.*)?$/i;

    if (!urlPattern.test(control.value.trim())) {
      return { invalidImageUrl: true };
    }

    return null;
  }

  getFieldError(fieldName: string): string {
    const field = this.pollutionForm.get(fieldName);

    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return this.getRequiredErrorMessage(fieldName);
      }
      if (field.errors['minlength']) {
        const requiredLength = field.errors['minlength'].requiredLength;
        return `${this.getFieldDisplayName(fieldName)} doit contenir au moins ${requiredLength} caractères.`;
      }
      if (field.errors['maxlength']) {
        const maxLength = field.errors['maxlength'].requiredLength;
        return `${this.getFieldDisplayName(fieldName)} ne peut pas dépasser ${maxLength} caractères.`;
      }

      if (field.errors['invalidNumber']) {
        return `${this.getFieldDisplayName(fieldName)} doit être un nombre valide.`;
      }
      if (field.errors['latitudeOutOfRange']) {
        return 'La latitude doit être comprise entre -90 et 90 degrés.';
      }
      if (field.errors['longitudeOutOfRange']) {
        return 'La longitude doit être comprise entre -180 et 180 degrés.';
      }

      if (field.errors['invalidDate']) {
        return 'La date saisie n\'est pas valide.';
      }
      if (field.errors['futureDate']) {
        return 'La date ne peut pas être dans le futur.';
      }
      if (field.errors['tooOldDate']) {
        return 'La date ne peut pas être antérieure à 1900.';
      }

      if (field.errors['invalidImageUrl']) {
        return 'L\'URL doit pointer vers une image valide (jpg, png, gif, etc.).';
      }
    }

    return '';
  }

  private getRequiredErrorMessage(fieldName: string): string {
    const messages: { [key: string]: string } = {
      'titre': 'Le titre de la pollution est requis.',
      'type': 'Le type de pollution est requis.',
      'description': 'La description de la pollution est requise.',
      'dateObservation': 'La date d\'observation est requise.',
      'lieu': 'Le lieu de la pollution est requis.',
      'latitude': 'La latitude est requise.',
      'longitude': 'La longitude est requise.'
    };
    return messages[fieldName] || `Le champ ${fieldName} est requis.`;
  }

  private getFieldDisplayName(fieldName: string): string {
    const names: { [key: string]: string } = {
      'titre': 'Le titre',
      'type': 'Le type',
      'description': 'La description',
      'dateObservation': 'La date',
      'lieu': 'Le lieu',
      'latitude': 'La latitude',
      'longitude': 'La longitude',
      'photoUrl': 'L\'URL de la photo'
    };
    return names[fieldName] || fieldName;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.pollutionForm.get(fieldName);
    return !!(field?.invalid && field?.touched);
  }
}
