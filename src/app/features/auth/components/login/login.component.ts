import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { InputFieldComponent } from '../../../../shared/components/input-field.component';
import { CheckboxComponent } from '../../../../shared/components/checkbox.component';
import { ButtonComponent } from '../../../../shared/components/button.component';
import { LabelComponent } from '../../../../shared/components/label.component';
import { DividerComponent } from '../../../../shared/components/divider.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'heart-beat-login',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    TranslatePipe,
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
  private authService = inject(AuthService);

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
      let request = {
        userEmail: formValue.email ?? '',
        password: formValue.password ?? '',
        rememberMe: formValue.rememberMe || false,
      };
      this.authService.login(request);
    } else {
      // Mark all fields as touched to show validation errors
      this.loginForm.markAllAsTouched();
    }
  }
}
