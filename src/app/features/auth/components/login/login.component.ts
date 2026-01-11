import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { InputFieldComponent } from '../../../../shared/components/input-field.component';
import { CheckboxComponent } from '../../../../shared/components/checkbox.component';
import { ButtonComponent } from '../../../../shared/components/button.component';
import { LabelComponent } from '../../../../shared/components/label.component';
import { DividerComponent } from '../../../../shared/components/divider.component';

@Component({
  selector: 'heart-beat-login',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    InputFieldComponent,
    CheckboxComponent,
    ButtonComponent,
    LabelComponent,
  ],
  templateUrl: './login.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private fb = inject(FormBuilder);

  showPassword = signal(false);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rememberMe: [false],
  });

  togglePasswordVisibility(): void {
    this.showPassword.update((value) => !value);
  }

  onSignIn(): void {
    if (this.loginForm.valid) {
      const formValue = this.loginForm.value;
      console.log('Email:', formValue.email);
      console.log('Password:', formValue.password);
      console.log('Remember Me:', formValue.rememberMe);
      // TODO: Implement actual authentication logic
    } else {
      // Mark all fields as touched to show validation errors
      this.loginForm.markAllAsTouched();
    }
  }
}
