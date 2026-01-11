import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { LabelComponent } from '../../shared/components/label.component';
import { InputFieldComponent } from '../../shared/components/input-field.component';
import { CheckboxComponent } from '../../shared/components/checkbox.component';
import { ButtonComponent } from '../../shared/components/button.component';
import { RadioComponent } from '../../shared/components/radio.component';
import { RadioGroupComponent } from '../../shared/components/radio-group.component';
import { ThemeToggleComponent } from '../../shared/components/theme-toggle.component';

@Component({
  selector: 'heart-beat-demo-controlls',
  imports: [
    LabelComponent,
    InputFieldComponent,
    CheckboxComponent,
    ButtonComponent,
    RadioComponent,
    RadioGroupComponent,
    ThemeToggleComponent,
    ReactiveFormsModule,
    JsonPipe,
  ],
  template: `
    <div class="max-w-4xl mx-auto p-6">
      <h1 class="text-3xl font-bold mb-2">Form Controls Demo</h1>
      <p class="text-gray-600 dark:text-gray-400 mb-8">
        Comprehensive examples of label and input-field component usage with different form controls
      </p>

      <div class="space-y-4">
        <!-- Input Field Component Examples -->
        <details class="group border border-gray-300 dark:border-gray-700 rounded-lg" open>
          <summary
            class="cursor-pointer bg-gray-50 dark:bg-gray-800 px-6 py-4 font-semibold text-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-between"
          >
            <span>Input Field Components (Reactive Forms)</span>
            <span class="transform group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <div class="p-6">
            <form [formGroup]="userForm" (ngSubmit)="onSubmit()" class="space-y-6">
              <!-- Email Input -->
              <div>
                <h3 class="text-sm font-medium text-gray-500 mb-2">Email Input with Validation</h3>
                <heart-beat-label for="email" [required]="true">Email Address</heart-beat-label>
                <heart-beat-input-field
                  id="email"
                  type="email"
                  formControlName="email"
                  placeholder="john.doe@example.com"
                  [error]="!!(userForm.get('email')?.invalid && userForm.get('email')?.touched)"
                  [hint]="
                    userForm.get('email')?.invalid && userForm.get('email')?.touched
                      ? 'Please enter a valid email address'
                      : getEmailHint()
                  "
                />
              </div>

              <!-- Text Input -->
              <div>
                <h3 class="text-sm font-medium text-gray-500 mb-2">Name Input with Min Length</h3>
                <heart-beat-label for="name" [required]="true">Full Name</heart-beat-label>
                <heart-beat-input-field
                  id="name"
                  type="text"
                  formControlName="name"
                  placeholder="John Doe"
                  [error]="!!(userForm.get('name')?.invalid && userForm.get('name')?.touched)"
                  [hint]="
                    userForm.get('name')?.invalid && userForm.get('name')?.touched
                      ? 'Name must be at least 3 characters'
                      : ''
                  "
                />
              </div>

              <!-- Number Input -->
              <div>
                <h3 class="text-sm font-medium text-gray-500 mb-2">Age Input (Number)</h3>
                <heart-beat-label for="age" [required]="true">Age</heart-beat-label>
                <heart-beat-input-field
                  id="age"
                  type="number"
                  formControlName="age"
                  placeholder="25"
                  min="18"
                  max="120"
                  [error]="!!(userForm.get('age')?.invalid && userForm.get('age')?.touched)"
                  [hint]="
                    userForm.get('age')?.invalid && userForm.get('age')?.touched
                      ? 'Age must be between 18 and 120'
                      : 'Must be 18 or older'
                  "
                />
              </div>

              <!-- Phone Input (Optional) -->
              <div>
                <h3 class="text-sm font-medium text-gray-500 mb-2">Phone Number (Optional)</h3>
                <heart-beat-label for="phone" [optional]="true">Phone Number</heart-beat-label>
                <heart-beat-input-field
                  id="phone"
                  type="tel"
                  formControlName="phone"
                  placeholder="+1 (555) 123-4567"
                  hint="Include country code"
                />
              </div>

              <!-- Password Input -->
              <div>
                <h3 class="text-sm font-medium text-gray-500 mb-2">Password Input</h3>
                <heart-beat-label for="password" [required]="true">Password</heart-beat-label>
                <heart-beat-input-field
                  id="password"
                  type="password"
                  formControlName="password"
                  placeholder="Enter a strong password"
                  [error]="!!(userForm.get('password')?.invalid && userForm.get('password')?.touched)"
                  [hint]="
                    userForm.get('password')?.invalid && userForm.get('password')?.touched
                      ? 'Password must be at least 8 characters'
                      : 'Use a combination of letters, numbers, and symbols'
                  "
                />
              </div>

              <!-- Success State Example -->
              <div>
                <h3 class="text-sm font-medium text-gray-500 mb-2">Username (Success State)</h3>
                <heart-beat-label for="username" [required]="true">Username</heart-beat-label>
                <heart-beat-input-field
                  id="username"
                  type="text"
                  formControlName="username"
                  placeholder="johndoe123"
                  [success]="!!(userForm.get('username')?.valid && userForm.get('username')?.touched)"
                  [hint]="
                    userForm.get('username')?.valid && userForm.get('username')?.touched
                      ? 'Username is available!'
                      : 'Choose a unique username'
                  "
                />
              </div>

              <!-- Disabled State Example -->
              <div>
                <h3 class="text-sm font-medium text-gray-500 mb-2">Account Type (Disabled)</h3>
                <heart-beat-label for="accountType" [disabled]="true">Account Type</heart-beat-label>
                <heart-beat-input-field
                  id="accountType"
                  type="text"
                  formControlName="accountType"
                  hint="This field cannot be modified"
                />
              </div>

              <!-- Checkbox Example -->
              <div>
                <h3 class="text-sm font-medium text-gray-500 mb-2">Terms and Conditions</h3>
                <heart-beat-checkbox
                  id="terms"
                  formControlName="terms"
                  label="I agree to the terms and conditions"
                />
                @if (userForm.get('terms')?.invalid && userForm.get('terms')?.touched) {
                <p class="mt-1.5 text-xs text-error-500">
                  You must agree to the terms and conditions
                </p>
                }
              </div>

              <!-- Newsletter Checkbox (Optional) -->
              <div>
                <h3 class="text-sm font-medium text-gray-500 mb-2">Newsletter Subscription</h3>
                <heart-beat-checkbox
                  id="newsletter"
                  formControlName="newsletter"
                  label="Subscribe to our newsletter for updates"
                />
              </div>

              <!-- Form Actions -->
              <div class="flex gap-4 pt-4">
                <button
                  type="submit"
                  [disabled]="userForm.invalid"
                  class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Form
                </button>
                <button
                  type="button"
                  (click)="resetForm()"
                  class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-white"
                >
                  Reset
                </button>
              </div>

              <!-- Form Status -->
              @if (formSubmitted()) {
              <div
                class="p-4 bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-600 rounded-lg"
              >
                <h4 class="font-semibold text-green-800 dark:text-green-200 mb-2">
                  Form Submitted Successfully!
                </h4>
                <pre
                  class="text-xs text-green-700 dark:text-green-300"
                >{{ formValue() | json }}</pre>
              </div>
              }
            </form>
          </div>
        </details>

        <!-- Event-Driven Example (without Reactive Forms) -->
        <details class="group border border-gray-300 dark:border-gray-700 rounded-lg">
          <summary
            class="cursor-pointer bg-gray-50 dark:bg-gray-800 px-6 py-4 font-semibold text-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-between"
          >
            <span>Event-Driven Input (No Forms)</span>
            <span class="transform group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <div class="p-6 space-y-6">
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-2">
                Search Input (Event-Driven)
              </h3>
              <heart-beat-label for="search">Search Query</heart-beat-label>
              <heart-beat-input-field
                id="search"
                type="text"
                placeholder="Type to search..."
                (valueChange)="onSearchChange($event)"
                hint="Results update as you type"
              />
              @if (searchValue()) {
              <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                You typed: <strong>{{ searchValue() }}</strong>
              </p>
              }
            </div>
          </div>
        </details>

        <!-- Checkbox Component Examples -->
        <details class="group border border-gray-300 dark:border-gray-700 rounded-lg" open>
          <summary
            class="cursor-pointer bg-gray-50 dark:bg-gray-800 px-6 py-4 font-semibold text-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-between"
          >
            <span>Checkbox Components</span>
            <span class="transform group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <div class="p-6 space-y-6">
            <!-- Basic Checkbox -->
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-2">Basic Checkbox</h3>
              <heart-beat-checkbox
                id="basic"
                label="Enable notifications"
              />
            </div>

            <!-- Checkbox with Event -->
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-2">Checkbox with Change Event</h3>
              <heart-beat-checkbox
                id="eventCheckbox"
                label="Accept privacy policy"
                (checkedChange)="onCheckboxChange($event)"
              />
              @if (checkboxValue()) {
              <p class="mt-2 text-xs text-success-500">
                ✓ You have accepted the privacy policy
              </p>
              }
            </div>

            <!-- Disabled Checkbox (Checked) -->
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-2">Disabled (Checked)</h3>
              <heart-beat-checkbox
                id="disabledChecked"
                label="Premium features enabled"
                [disabled]="true"
              />
            </div>

            <!-- Disabled Checkbox (Unchecked) -->
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-2">Disabled (Unchecked)</h3>
              <heart-beat-checkbox
                id="disabledUnchecked"
                label="Beta features (coming soon)"
                [disabled]="true"
              />
            </div>

            <!-- Multiple Checkboxes -->
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-2">Multiple Options</h3>
              <div class="space-y-3">
                <heart-beat-checkbox
                  id="option1"
                  label="Email notifications"
                />
                <heart-beat-checkbox
                  id="option2"
                  label="SMS notifications"
                />
                <heart-beat-checkbox
                  id="option3"
                  label="Push notifications"
                />
              </div>
            </div>
          </div>
        </details>

        <!-- Input Field with Icons -->
        <details class="group border border-gray-300 dark:border-gray-700 rounded-lg" open>
          <summary
            class="cursor-pointer bg-gray-50 dark:bg-gray-800 px-6 py-4 font-semibold text-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-between"
          >
            <span>Input Fields with Icons</span>
            <span class="transform group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <div class="p-6 space-y-6">
            <!-- Email with Icon Before -->
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-2">Email with Icon Before</h3>
              <heart-beat-label for="iconEmail">Email Address</heart-beat-label>
              <heart-beat-input-field
                id="iconEmail"
                type="email"
                iconBefore="lucideMail"
                placeholder="email@example.com"
                hint="Enter your email address"
              />
            </div>

            <!-- Search with Icon After -->
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-2">Search with Icon After</h3>
              <heart-beat-label for="iconSearch">Search</heart-beat-label>
              <heart-beat-input-field
                id="iconSearch"
                type="text"
                iconAfter="lucideSearch"
                placeholder="Search for anything..."
                hint="Press enter to search"
              />
            </div>

            <!-- Password with Both Icons -->
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-2">Password with Icon Before</h3>
              <heart-beat-label for="iconPassword" [required]="true">Password</heart-beat-label>
              <heart-beat-input-field
                id="iconPassword"
                type="password"
                iconBefore="lucideLock"
                placeholder="Enter your password"
                hint="At least 8 characters"
              />
            </div>

            <!-- Phone with Icon -->
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-2">Phone with Icon Before</h3>
              <heart-beat-label for="iconPhone">Phone Number</heart-beat-label>
              <heart-beat-input-field
                id="iconPhone"
                type="tel"
                iconBefore="lucidePhone"
                placeholder="+1 (555) 123-4567"
                hint="Include country code"
              />
            </div>

            <!-- Username with Icon -->
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-2">Username with Icon Before</h3>
              <heart-beat-label for="iconUsername">Username</heart-beat-label>
              <heart-beat-input-field
                id="iconUsername"
                type="text"
                iconBefore="lucideUser"
                placeholder="johndoe"
                hint="Choose a unique username"
              />
            </div>

            <!-- Location/Address with Icon -->
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-2">Location with Icon Before</h3>
              <heart-beat-label for="iconLocation">Location</heart-beat-label>
              <heart-beat-input-field
                id="iconLocation"
                type="text"
                iconBefore="lucideMapPin"
                placeholder="Enter your address"
              />
            </div>

            <!-- Calendar/Date with Icon -->
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-2">Date with Icon Before</h3>
              <heart-beat-label for="iconDate">Date of Birth</heart-beat-label>
              <heart-beat-input-field
                id="iconDate"
                type="date"
                iconBefore="lucideCalendar"
              />
            </div>

            <!-- URL with Icon -->
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-2">Website with Icon Before</h3>
              <heart-beat-label for="iconUrl" [optional]="true">Website</heart-beat-label>
              <heart-beat-input-field
                id="iconUrl"
                type="url"
                iconBefore="lucideGlobe"
                placeholder="https://example.com"
                hint="Include https://"
              />
            </div>

            <!-- Credit Card with Icon -->
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-2">Card Number with Icon Before</h3>
              <heart-beat-label for="iconCard">Card Number</heart-beat-label>
              <heart-beat-input-field
                id="iconCard"
                type="text"
                iconBefore="lucideCreditCard"
                placeholder="1234 5678 9012 3456"
              />
            </div>

            <!-- Currency/Amount with Icon -->
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-2">Amount with Icon Before</h3>
              <heart-beat-label for="iconAmount">Amount</heart-beat-label>
              <heart-beat-input-field
                id="iconAmount"
                type="number"
                iconBefore="lucideDollarSign"
                placeholder="0.00"
                [step]="0.01"
                [min]="'0'"
              />
            </div>

            <!-- Icons with Error State -->
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-2">Email with Error State</h3>
              <heart-beat-label for="iconEmailError" [required]="true">Email</heart-beat-label>
              <heart-beat-input-field
                id="iconEmailError"
                type="email"
                iconBefore="lucideMail"
                [error]="true"
                hint="Please enter a valid email address"
              />
            </div>

            <!-- Icons with Success State -->
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-2">Username with Success State</h3>
              <heart-beat-label for="iconUsernameSuccess">Username</heart-beat-label>
              <heart-beat-input-field
                id="iconUsernameSuccess"
                type="text"
                iconBefore="lucideUser"
                [success]="true"
                hint="Username is available!"
              />
            </div>

            <!-- Custom Icon Size -->
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-2">Large Icon (24px)</h3>
              <heart-beat-label for="iconLarge">Search Products</heart-beat-label>
              <heart-beat-input-field
                id="iconLarge"
                type="text"
                iconBefore="lucideSearch"
                iconSize="24"
                placeholder="Search..."
                className="text-base py-3"
              />
            </div>
          </div>
        </details>

        <!-- Radio Component Examples -->
        <details class="group border border-gray-300 dark:border-gray-700 rounded-lg" open>
          <summary
            class="cursor-pointer bg-gray-50 dark:bg-gray-800 px-6 py-4 font-semibold text-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-between"
          >
            <span>Radio Button Components</span>
            <span class="transform group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <div class="p-6 space-y-8">
            <!-- Basic Radio Group -->
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-3">Basic Radio Group</h3>
              <div class="space-y-3">
                <heart-beat-radio
                  id="basic-option1"
                  name="basic-group"
                  value="option1"
                  label="Option 1"
                  (valueChange)="onRadioChange($event)"
                />
                <heart-beat-radio
                  id="basic-option2"
                  name="basic-group"
                  value="option2"
                  label="Option 2"
                  (valueChange)="onRadioChange($event)"
                />
                <heart-beat-radio
                  id="basic-option3"
                  name="basic-group"
                  value="option3"
                  label="Option 3"
                  (valueChange)="onRadioChange($event)"
                />
              </div>
              @if (radioValue()) {
              <p class="mt-2 text-xs text-gray-600 dark:text-gray-400">
                Selected: <strong>{{ radioValue() }}</strong>
              </p>
              }
            </div>

            <!-- Radio Group with Form Control -->
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-3">
                Notification Preferences (Reactive Form)
              </h3>
              <form [formGroup]="radioForm" class="space-y-3">
                <heart-beat-radio
                  id="notify-email"
                  name="notificationMethod"
                  value="email"
                  label="Email notifications"
                  formControlName="notificationMethod"
                />
                <heart-beat-radio
                  id="notify-sms"
                  name="notificationMethod"
                  value="sms"
                  label="SMS notifications"
                  formControlName="notificationMethod"
                />
                <heart-beat-radio
                  id="notify-push"
                  name="notificationMethod"
                  value="push"
                  label="Push notifications"
                  formControlName="notificationMethod"
                />
                <heart-beat-radio
                  id="notify-none"
                  name="notificationMethod"
                  value="none"
                  label="No notifications"
                  formControlName="notificationMethod"
                />
              </form>
              @if (radioForm.get('notificationMethod')?.value) {
              <p class="mt-2 text-xs text-success-500">
                ✓ You selected: {{ radioForm.get('notificationMethod')?.value }}
              </p>
              }
            </div>

            <!-- Disabled Radio Options -->
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-3">Disabled State</h3>
              <div class="space-y-3">
                <heart-beat-radio
                  id="disabled-1"
                  name="disabled-group"
                  value="available"
                  label="Available option"
                />
                <heart-beat-radio
                  id="disabled-2"
                  name="disabled-group"
                  value="unavailable"
                  label="Unavailable option (disabled)"
                  [disabled]="true"
                />
                <heart-beat-radio
                  id="disabled-3"
                  name="disabled-group"
                  value="coming-soon"
                  label="Coming soon (disabled)"
                  [disabled]="true"
                />
              </div>
            </div>

            <!-- Payment Method Selection -->
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-3">Payment Method</h3>
              <form [formGroup]="paymentForm" class="space-y-3">
                <heart-beat-radio
                  id="payment-card"
                  name="paymentMethod"
                  value="credit-card"
                  label="Credit Card"
                  formControlName="paymentMethod"
                />
                <heart-beat-radio
                  id="payment-paypal"
                  name="paymentMethod"
                  value="paypal"
                  label="PayPal"
                  formControlName="paymentMethod"
                />
                <heart-beat-radio
                  id="payment-bank"
                  name="paymentMethod"
                  value="bank-transfer"
                  label="Bank Transfer"
                  formControlName="paymentMethod"
                />
              </form>
              @if (paymentForm.get('paymentMethod')?.invalid && paymentForm.get('paymentMethod')?.touched) {
              <p class="mt-2 text-xs text-error-500">
                Please select a payment method
              </p>
              }
            </div>

            <!-- Size Options -->
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-3">Product Size</h3>
              <div class="space-y-3">
                <heart-beat-radio
                  id="size-small"
                  name="size"
                  value="small"
                  label="Small (S)"
                />
                <heart-beat-radio
                  id="size-medium"
                  name="size"
                  value="medium"
                  label="Medium (M)"
                />
                <heart-beat-radio
                  id="size-large"
                  name="size"
                  value="large"
                  label="Large (L)"
                />
                <heart-beat-radio
                  id="size-xl"
                  name="size"
                  value="extra-large"
                  label="Extra Large (XL)"
                />
              </div>
            </div>

            <!-- Horizontal Radio Group with RadioGroupComponent -->
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-3">
                Horizontal Layout (Radio Group)
              </h3>
              <heart-beat-radio-group
                name="horizontal-example"
                orientation="horizontal"
                [options]="horizontalOptions"
                (valueChange)="onHorizontalRadioChange($event)"
              />
              @if (horizontalRadioValue()) {
              <p class="mt-2 text-xs text-gray-600 dark:text-gray-400">
                Selected: <strong>{{ horizontalRadioValue() }}</strong>
              </p>
              }
            </div>

            <!-- Vertical Radio Group with Form Control -->
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-3">
                Vertical Layout with Form (Radio Group)
              </h3>
              <form [formGroup]="layoutForm">
                <heart-beat-radio-group
                  name="layout-preference"
                  orientation="vertical"
                  gap="md"
                  [options]="layoutOptions"
                  formControlName="layout"
                />
              </form>
              @if (layoutForm.get('layout')?.value) {
              <p class="mt-2 text-xs text-success-500">
                ✓ Selected layout: {{ layoutForm.get('layout')?.value }}
              </p>
              }
            </div>

            <!-- Horizontal Theme Selection -->
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-3">
                Theme Selection (Horizontal)
              </h3>
              <form [formGroup]="themeForm">
                <heart-beat-radio-group
                  name="theme"
                  orientation="horizontal"
                  gap="lg"
                  [options]="themeOptions"
                  formControlName="theme"
                />
              </form>
            </div>

            <!-- Subscription Plans -->
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-3">Subscription Plan</h3>
              <form [formGroup]="subscriptionForm" class="space-y-3">
                <heart-beat-radio
                  id="plan-free"
                  name="plan"
                  value="free"
                  label="Free - $0/month"
                  formControlName="plan"
                />
                <heart-beat-radio
                  id="plan-basic"
                  name="plan"
                  value="basic"
                  label="Basic - $9.99/month"
                  formControlName="plan"
                />
                <heart-beat-radio
                  id="plan-pro"
                  name="plan"
                  value="pro"
                  label="Pro - $19.99/month"
                  formControlName="plan"
                />
                <heart-beat-radio
                  id="plan-enterprise"
                  name="plan"
                  value="enterprise"
                  label="Enterprise - Contact us"
                  formControlName="plan"
                />
              </form>
            </div>
          </div>
        </details>

        <!-- Button Component Examples -->
        <details class="group border border-gray-300 dark:border-gray-700 rounded-lg" open>
          <summary
            class="cursor-pointer bg-gray-50 dark:bg-gray-800 px-6 py-4 font-semibold text-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-between"
          >
            <span>Button Components</span>
            <span class="transform group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <div class="p-6 space-y-8">
            <!-- Button Variants -->
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-3">Button Variants</h3>
              <div class="flex flex-wrap gap-3">
                <heart-beat-button variant="primary">Primary</heart-beat-button>
                <heart-beat-button variant="secondary">Secondary</heart-beat-button>
                <heart-beat-button variant="outline">Outline</heart-beat-button>
                <heart-beat-button variant="ghost">Ghost</heart-beat-button>
                <heart-beat-button variant="danger">Danger</heart-beat-button>
              </div>
            </div>

            <!-- Button Sizes -->
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-3">Button Sizes</h3>
              <div class="flex flex-wrap items-center gap-3">
                <heart-beat-button size="xs">Extra Small</heart-beat-button>
                <heart-beat-button size="sm">Small</heart-beat-button>
                <heart-beat-button size="md">Medium</heart-beat-button>
                <heart-beat-button size="lg">Large</heart-beat-button>
                <heart-beat-button size="xl">Extra Large</heart-beat-button>
              </div>
            </div>

            <!-- Buttons with Icons -->
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-3">Buttons with Icons</h3>
              <div class="flex flex-wrap gap-3">
                <heart-beat-button iconStart="lucidePlus">Add Item</heart-beat-button>
                <heart-beat-button variant="secondary" iconStart="lucideDownload">
                  Download
                </heart-beat-button>
                <heart-beat-button variant="outline" iconEnd="lucideArrowRight">
                  Next
                </heart-beat-button>
                <heart-beat-button variant="ghost" iconStart="lucideSettings">
                  Settings
                </heart-beat-button>
                <heart-beat-button variant="danger" iconStart="lucideTrash">
                  Delete
                </heart-beat-button>
              </div>
            </div>

            <!-- Icon Only Buttons -->
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-3">Icon Only Buttons</h3>
              <div class="flex flex-wrap gap-3">
                <heart-beat-button iconStart="lucideEdit" size="sm" />
                <heart-beat-button iconStart="lucideSearch" variant="secondary" />
                <heart-beat-button iconStart="lucideHeart" variant="outline" />
                <heart-beat-button iconStart="lucideShare2" variant="ghost" />
                <heart-beat-button iconStart="lucideX" variant="danger" size="sm" />
              </div>
            </div>

            <!-- Disabled Buttons -->
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-3">Disabled State</h3>
              <div class="flex flex-wrap gap-3">
                <heart-beat-button [disabled]="true">Disabled Primary</heart-beat-button>
                <heart-beat-button variant="secondary" [disabled]="true">
                  Disabled Secondary
                </heart-beat-button>
                <heart-beat-button variant="outline" [disabled]="true" iconStart="lucideLock">
                  Disabled with Icon
                </heart-beat-button>
              </div>
            </div>

            <!-- Full Width Button -->
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-3">Full Width Button</h3>
              <heart-beat-button [fullWidth]="true" iconStart="lucideCheck">
                Full Width Button
              </heart-beat-button>
            </div>

            <!-- Button with Click Handler -->
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-3">Interactive Button</h3>
              <heart-beat-button
                variant="primary"
                iconStart="lucideBell"
                (btnClick)="onButtonClick()"
              >
                Click Me
              </heart-beat-button>
              @if (buttonClicked()) {
              <p class="mt-2 text-sm text-success-500">
                ✓ Button clicked {{ buttonClickCount() }} time(s)!
              </p>
              }
            </div>

            <!-- Loading Button Example -->
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-3">Loading State (Disabled)</h3>
              <heart-beat-button [disabled]="true" iconStart="lucideLoader2">
                Processing...
              </heart-beat-button>
            </div>

            <!-- Button Groups -->
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-3">Button Groups</h3>
              <div class="flex gap-2">
                <heart-beat-button variant="outline" iconStart="lucideBold" size="sm" />
                <heart-beat-button variant="outline" iconStart="lucideItalic" size="sm" />
                <heart-beat-button variant="outline" iconStart="lucideUnderline" size="sm" />
              </div>
            </div>

            <!-- Action Buttons -->
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-3">Action Buttons</h3>
              <div class="flex flex-wrap gap-3">
                <heart-beat-button iconStart="lucideSave">Save</heart-beat-button>
                <heart-beat-button variant="secondary" iconStart="lucideX">
                  Cancel
                </heart-beat-button>
                <heart-beat-button variant="outline" iconStart="lucideRefreshCw">
                  Refresh
                </heart-beat-button>
                <heart-beat-button variant="ghost" iconStart="lucideMoreHorizontal" />
              </div>
            </div>
          </div>
        </details>

        <!-- Theme Toggle Component Examples -->
        <details class="group border border-gray-300 dark:border-gray-700 rounded-lg" open>
          <summary
            class="cursor-pointer bg-gray-50 dark:bg-gray-800 px-6 py-4 font-semibold text-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-between"
          >
            <span>Theme Toggle Components</span>
            <span class="transform group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <div class="p-6 space-y-8">
            <!-- Default Theme Toggle -->
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-3">Default Theme Toggle</h3>
              <heart-beat-theme-toggle />
            </div>

            <!-- Different Variants -->
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-3">Theme Toggle Variants</h3>
              <div class="flex flex-wrap items-center gap-4">
                <div class="text-center">
                  <heart-beat-theme-toggle variant="primary" />
                  <p class="text-xs text-gray-500 mt-2">Primary</p>
                </div>
                <div class="text-center">
                  <heart-beat-theme-toggle variant="secondary" />
                  <p class="text-xs text-gray-500 mt-2">Secondary</p>
                </div>
                <div class="text-center">
                  <heart-beat-theme-toggle variant="outline" />
                  <p class="text-xs text-gray-500 mt-2">Outline</p>
                </div>
                <div class="text-center">
                  <heart-beat-theme-toggle variant="ghost" />
                  <p class="text-xs text-gray-500 mt-2">Ghost</p>
                </div>
              </div>
            </div>

            <!-- Different Sizes -->
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-3">Theme Toggle Sizes</h3>
              <div class="flex flex-wrap items-center gap-4">
                <div class="text-center">
                  <heart-beat-theme-toggle size="xs" />
                  <p class="text-xs text-gray-500 mt-2">Extra Small</p>
                </div>
                <div class="text-center">
                  <heart-beat-theme-toggle size="sm" />
                  <p class="text-xs text-gray-500 mt-2">Small</p>
                </div>
                <div class="text-center">
                  <heart-beat-theme-toggle size="md" />
                  <p class="text-xs text-gray-500 mt-2">Medium</p>
                </div>
                <div class="text-center">
                  <heart-beat-theme-toggle size="lg" />
                  <p class="text-xs text-gray-500 mt-2">Large</p>
                </div>
                <div class="text-center">
                  <heart-beat-theme-toggle size="xl" />
                  <p class="text-xs text-gray-500 mt-2">Extra Large</p>
                </div>
              </div>
            </div>

            <!-- Combination Examples -->
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-3">Size & Variant Combinations</h3>
              <div class="flex flex-wrap items-center gap-4">
                <heart-beat-theme-toggle size="sm" variant="secondary" />
                <heart-beat-theme-toggle size="md" variant="outline" />
                <heart-beat-theme-toggle size="lg" variant="ghost" />
              </div>
            </div>

            <!-- In Navigation Bar Example -->
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-3">In Navigation Bar</h3>
              <div class="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                <span class="font-semibold text-gray-900 dark:text-white">My Application</span>
                <heart-beat-theme-toggle size="sm" variant="ghost" />
              </div>
            </div>

            <!-- With Custom Styling -->
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-3">With Custom Classes</h3>
              <heart-beat-theme-toggle className="shadow-lg ring-2 ring-brand-300 dark:ring-brand-700" />
            </div>
          </div>
        </details>

        <!-- Basic Label Usage -->
        <details class="group border border-gray-300 dark:border-gray-700 rounded-lg" open>
          <summary
            class="cursor-pointer bg-gray-50 dark:bg-gray-800 px-6 py-4 font-semibold text-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-between"
          >
            <span>Basic Label Usage</span>
            <span class="transform group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <div class="p-6 space-y-6">
            <!-- Simple Label -->
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-2">Simple Label</h3>
              <heart-beat-label for="email">Email Address</heart-beat-label>
              <input
                id="email"
                type="email"
                placeholder="example@domain.com"
                class="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <!-- Label with Text Input -->
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-2">Text Input</h3>
              <heart-beat-label for="firstName">First Name</heart-beat-label>
              <input
                id="firstName"
                type="text"
                placeholder="John"
                class="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <!-- Label with Number Input -->
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-2">Number Input</h3>
              <heart-beat-label for="age">Age</heart-beat-label>
              <input
                id="age"
                type="number"
                placeholder="25"
                min="0"
                max="120"
                class="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </details>

        <!-- Required & Optional Fields -->
        <details class="group border border-gray-300 dark:border-gray-700 rounded-lg">
          <summary
            class="cursor-pointer bg-gray-50 dark:bg-gray-800 px-6 py-4 font-semibold text-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-between"
          >
            <span>Required & Optional Fields</span>
            <span class="transform group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <div class="p-6 space-y-6">
            <!-- Required Field -->
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-2">Required Field (with asterisk)</h3>
              <heart-beat-label for="password" [required]="true">Password</heart-beat-label>
              <input
                id="password"
                type="password"
                placeholder="Enter password"
                class="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <!-- Optional Field -->
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-2">Optional Field</h3>
              <heart-beat-label for="phone" [optional]="true">Phone Number</heart-beat-label>
              <input
                id="phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                class="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <!-- Multiple Required Fields -->
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-2">Full Name (Required)</h3>
              <heart-beat-label for="fullName" [required]="true">Full Name</heart-beat-label>
              <input
                id="fullName"
                type="text"
                placeholder="John Doe"
                class="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </details>

        <!-- Labels with Hints -->
        <details class="group border border-gray-300 dark:border-gray-700 rounded-lg">
          <summary
            class="cursor-pointer bg-gray-50 dark:bg-gray-800 px-6 py-4 font-semibold text-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-between"
          >
            <span>Labels with Hint Text</span>
            <span class="transform group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <div class="p-6 space-y-6">
            <!-- Simple Hint -->
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-2">Username with Hint</h3>
              <heart-beat-label for="username" hint="Must be 3-20 characters long">
                Username
              </heart-beat-label>
              <input
                id="username"
                type="text"
                placeholder="johndoe123"
                class="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <!-- Required with Hint -->
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-2">Required Field with Hint</h3>
              <heart-beat-label
                for="legalName"
                [required]="true"
                hint="Enter your full legal name as it appears on your ID"
              >
                Legal Name
              </heart-beat-label>
              <input
                id="legalName"
                type="text"
                placeholder="John Michael Doe"
                class="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <!-- Optional with Hint -->
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-2">Optional Field with Hint</h3>
              <heart-beat-label for="website" [optional]="true" hint="Include https:// or http://">
                Website
              </heart-beat-label>
              <input
                id="website"
                type="url"
                placeholder="https://example.com"
                class="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </details>

        <!-- Advanced Features -->
        <details class="group border border-gray-300 dark:border-gray-700 rounded-lg">
          <summary
            class="cursor-pointer bg-gray-50 dark:bg-gray-800 px-6 py-4 font-semibold text-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-between"
          >
            <span>Advanced Features</span>
            <span class="transform group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <div class="p-6 space-y-6">
            <!-- Disabled State -->
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-2">Disabled Field</h3>
              <heart-beat-label for="accountType" [disabled]="true">
                Account Type
              </heart-beat-label>
              <input
                id="accountType"
                type="text"
                value="Premium"
                disabled
                class="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 opacity-50 cursor-not-allowed"
              />
            </div>

            <!-- Custom Classes -->
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-2">
                Custom Styling (Large, Bold, Blue)
              </h3>
              <heart-beat-label for="title" class="text-lg font-bold text-blue-600">
                Project Title
              </heart-beat-label>
              <input
                id="title"
                type="text"
                placeholder="My Awesome Project"
                class="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <!-- Date Input -->
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-2">Date Input</h3>
              <heart-beat-label for="birthdate" [required]="true" hint="Must be 18 years or older">
                Date of Birth
              </heart-beat-label>
              <input
                id="birthdate"
                type="date"
                class="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </details>

        <!-- Different Input Types -->
        <details class="group border border-gray-300 dark:border-gray-700 rounded-lg">
          <summary
            class="cursor-pointer bg-gray-50 dark:bg-gray-800 px-6 py-4 font-semibold text-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-between"
          >
            <span>Different Input Types</span>
            <span class="transform group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <div class="p-6 space-y-6">
            <!-- Textarea -->
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-2">Textarea</h3>
              <heart-beat-label
                for="bio"
                [optional]="true"
                hint="Tell us about yourself (max 500 characters)"
              >
                Biography
              </heart-beat-label>
              <textarea
                id="bio"
                rows="4"
                placeholder="I am a software developer..."
                class="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>

            <!-- Select Dropdown -->
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-2">Select Dropdown</h3>
              <heart-beat-label
                for="country"
                [required]="true"
                hint="Select your country of residence"
              >
                Country
              </heart-beat-label>
              <select
                id="country"
                class="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a country</option>
                <option value="us">United States</option>
                <option value="uk">United Kingdom</option>
                <option value="ca">Canada</option>
                <option value="au">Australia</option>
                <option value="de">Germany</option>
                <option value="fr">France</option>
              </select>
            </div>

            <!-- Checkbox -->
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-2">Checkbox</h3>
              <div class="flex items-center gap-3">
                <input
                  id="terms"
                  type="checkbox"
                  class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
                <heart-beat-label for="terms" [required]="true" class="mb-0">
                  I agree to the terms and conditions
                </heart-beat-label>
              </div>
            </div>

            <!-- Radio Buttons -->
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-2">Radio Buttons</h3>
              <heart-beat-label [required]="true" hint="Choose your preferred contact method">
                Contact Preference
              </heart-beat-label>
              <div class="space-y-2 mt-2">
                <div class="flex items-center gap-3">
                  <input
                    id="contact-email"
                    type="radio"
                    name="contact"
                    value="email"
                    class="w-4 h-4 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-500"
                  />
                  <label for="contact-email" class="text-sm text-gray-700 dark:text-gray-400">
                    Email
                  </label>
                </div>
                <div class="flex items-center gap-3">
                  <input
                    id="contact-phone"
                    type="radio"
                    name="contact"
                    value="phone"
                    class="w-4 h-4 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-500"
                  />
                  <label for="contact-phone" class="text-sm text-gray-700 dark:text-gray-400">
                    Phone
                  </label>
                </div>
                <div class="flex items-center gap-3">
                  <input
                    id="contact-sms"
                    type="radio"
                    name="contact"
                    value="sms"
                    class="w-4 h-4 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-500"
                  />
                  <label for="contact-sms" class="text-sm text-gray-700 dark:text-gray-400">
                    SMS
                  </label>
                </div>
              </div>
            </div>

            <!-- File Input -->
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-2">File Upload</h3>
              <heart-beat-label for="avatar" [optional]="true" hint="PNG, JPG or GIF (max 2MB)">
                Profile Picture
              </heart-beat-label>
              <input
                id="avatar"
                type="file"
                accept="image/*"
                class="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <!-- Range Slider -->
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-2">Range Slider</h3>
              <heart-beat-label for="volume" hint="Adjust the volume level">
                Volume
              </heart-beat-label>
              <input
                id="volume"
                type="range"
                min="0"
                max="100"
                value="50"
                class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
            </div>

            <!-- Color Picker -->
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-2">Color Picker</h3>
              <heart-beat-label for="color" hint="Choose your favorite color">
                Theme Color
              </heart-beat-label>
              <input
                id="color"
                type="color"
                value="#3b82f6"
                class="h-10 w-20 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
              />
            </div>
          </div>
        </details>

        <!-- Complete Form Example -->
        <details class="group border border-gray-300 dark:border-gray-700 rounded-lg">
          <summary
            class="cursor-pointer bg-gray-50 dark:bg-gray-800 px-6 py-4 font-semibold text-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-between"
          >
            <span>Complete Form Example</span>
            <span class="transform group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <div class="p-6">
            <form class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <heart-beat-label for="form-firstName" [required]="true">
                    First Name
                  </heart-beat-label>
                  <input
                    id="form-firstName"
                    type="text"
                    class="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <heart-beat-label for="form-lastName" [required]="true">
                    Last Name
                  </heart-beat-label>
                  <input
                    id="form-lastName"
                    type="text"
                    class="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <heart-beat-label
                  for="form-email"
                  [required]="true"
                  hint="We'll never share your email"
                >
                  Email Address
                </heart-beat-label>
                <input
                  id="form-email"
                  type="email"
                  class="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <heart-beat-label for="form-phone" [optional]="true">
                  Phone Number
                </heart-beat-label>
                <input
                  id="form-phone"
                  type="tel"
                  class="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <heart-beat-label for="form-message" [required]="true" hint="Minimum 10 characters">
                  Message
                </heart-beat-label>
                <textarea
                  id="form-message"
                  rows="4"
                  class="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              <div class="flex items-center gap-3">
                <input
                  id="form-newsletter"
                  type="checkbox"
                  class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
                <heart-beat-label for="form-newsletter" [optional]="true" class="mb-0">
                  Subscribe to newsletter
                </heart-beat-label>
              </div>

              <div class="pt-4">
                <button
                  type="submit"
                  class="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Submit Form
                </button>
              </div>
            </form>
          </div>
        </details>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemoControllsComponent {
  private fb = new FormBuilder();

  // Reactive form
  userForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    name: ['', [Validators.required, Validators.minLength(3)]],
    age: [null, [Validators.required, Validators.min(18), Validators.max(120)]],
    phone: [''],
    password: ['', [Validators.required, Validators.minLength(8)]],
    username: ['', [Validators.required, Validators.minLength(3)]],
    accountType: [{ value: 'Premium', disabled: true }],
    terms: [false, [Validators.requiredTrue]],
    newsletter: [false],
  });

  radioForm = this.fb.group({
    notificationMethod: ['email'],
  });

  paymentForm = this.fb.group({
    paymentMethod: ['', [Validators.required]],
  });

  subscriptionForm = this.fb.group({
    plan: ['basic'],
  });

  // Signals for state
  formSubmitted = signal(false);
  formValue = signal<any>(null);
  searchValue = signal<string | number>('');
  checkboxValue = signal<boolean>(false);
  buttonClicked = signal<boolean>(false);
  buttonClickCount = signal<number>(0);
  radioValue = signal<string>('');
  horizontalRadioValue = signal<string>('');

  // Radio Group options
  horizontalOptions = [
    { label: 'Small', value: 'sm' },
    { label: 'Medium', value: 'md' },
    { label: 'Large', value: 'lg' },
  ];

  layoutOptions = [
    { label: 'Compact View', value: 'compact' },
    { label: 'Comfortable View', value: 'comfortable' },
    { label: 'Spacious View', value: 'spacious' },
  ];

  layoutForm = this.fb.group({
    layout: ['comfortable'],
  });

  themeOptions = [
    { label: '🌞 Light', value: 'light' },
    { label: '🌙 Dark', value: 'dark' },
    { label: '🎨 Auto', value: 'auto' },
  ];

  themeForm = this.fb.group({
    theme: ['auto'],
  });

  onSubmit(): void {
    if (this.userForm.valid) {
      this.formValue.set(this.userForm.getRawValue());
      this.formSubmitted.set(true);

      // Reset after 5 seconds
      setTimeout(() => {
        this.formSubmitted.set(false);
      }, 5000);
    }
  }

  resetForm(): void {
    this.userForm.reset({
      accountType: { value: 'Premium', disabled: true },
      terms: false,
      newsletter: false,
    });
    this.formSubmitted.set(false);
    this.formValue.set(null);
  }

  onHorizontalRadioChange(value: string): void {
    this.horizontalRadioValue.set(value);
  }

  onSearchChange(value: string | number): void {
    this.searchValue.set(value);
  }

  onCheckboxChange(checked: boolean): void {
    this.checkboxValue.set(checked);
  }

  onButtonClick(): void {
    this.buttonClicked.set(true);
    this.buttonClickCount.update((count) => count + 1);

    // Reset after 3 seconds
    setTimeout(() => {
      this.buttonClicked.set(false);
    }, 3000);
  }

  onRadioChange(value: string): void {
    this.radioValue.set(value);
  }

  getEmailHint(): string {
    return "We'll never share your email";
  }
}
