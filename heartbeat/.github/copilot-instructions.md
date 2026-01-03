# Angular Best Practices Guide

Expert guidelines for TypeScript, Angular, and scalable web application development. Write functional, maintainable, performant, and accessible code following Angular and TypeScript best practices.

## Table of Contents

- [TypeScript Best Practices](#typescript-best-practices)
- [Angular Core Principles](#angular-core-principles)
- [Accessibility Requirements](#accessibility-requirements)
- [Component Development](#component-development)
- [State Management](#state-management)
- [Templates](#templates)
- [Services](#services)
- [Dependency Injection](#dependency-injection)
- [Routing](#routing)
- [HTTP and API Calls](#http-and-api-calls)
- [Forms](#forms)
- [RxJS Best Practices](#rxjs-best-practices)
- [Error Handling](#error-handling)
- [Security](#security)
- [Performance Optimization](#performance-optimization)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Styling and CSS](#styling-and-css)
- [Build and Deployment](#build-and-deployment)

---

## TypeScript Best Practices

### Type Safety

- Use strict type checking in `tsconfig.json`
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain
- Use union types instead of `any` when multiple types are possible
- Leverage TypeScript utility types (`Partial`, `Pick`, `Omit`, `Record`, etc.)

### Interfaces and Types

```typescript
// Prefer interfaces for object shapes
interface User {
  id: string;
  name: string;
  email: string;
}

// Use type aliases for unions, intersections, or primitives
type Status = 'pending' | 'active' | 'inactive';
type Result = Success | Error;
```

### Naming Conventions

- Use PascalCase for classes, interfaces, and types
- Use camelCase for variables, functions, and methods
- Prefix interface names with `I` only when necessary (not common in modern TS)
- Use descriptive names that convey intent

---

## Angular Core Principles

### Standalone Components

- **Always use standalone components** over NgModules
- **Must NOT set `standalone: true`** inside Angular decorators (it's the default in Angular v20+)
- Import dependencies directly in the component

```typescript
@Component({
  selector: 'app-user-profile',
  imports: [CommonModule, FormsModule, UserCardComponent],
  templateUrl: './user-profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfileComponent {}
```

### Modern Angular Features

- Use signals for state management
- Use the `inject()` function instead of constructor injection
- Use native control flow (`@if`, `@for`, `@switch`)
- Use `input()` and `output()` functions instead of decorators
- Implement lazy loading for feature routes

### Deprecated Patterns to Avoid

- **Do NOT use** `@HostBinding` and `@HostListener` decorators
  - Put host bindings inside the `host` object of the decorator instead
- **Do NOT use** `ngClass` - use `class` bindings instead
- **Do NOT use** `ngStyle` - use `style` bindings instead
- **Do NOT use** `mutate` on signals - use `update` or `set` instead

---

## Accessibility Requirements

### Mandatory Standards

- **MUST pass all AXE checks** without violations
- **MUST follow all WCAG AA minimums**, including:
  - Focus management and keyboard navigation
  - Color contrast ratios (4.5:1 for normal text, 3:1 for large text)
  - ARIA attributes where necessary
  - Screen reader compatibility

### Best Practices

- Use semantic HTML elements
- Provide meaningful alt text for images
- Ensure all interactive elements are keyboard accessible
- Use `aria-label` and `aria-describedby` appropriately
- Test with screen readers and keyboard-only navigation
- Manage focus states properly
- Provide skip navigation links

```typescript
@Component({
  selector: 'app-modal',
  template: `
    <dialog role="dialog" aria-labelledby="modal-title" aria-modal="true">
      <h2 id="modal-title">{{ title() }}</h2>
      <button aria-label="Close modal" (click)="close()">×</button>
    </dialog>
  `
})
```

---

## Component Development

### Component Structure

- Keep components small and focused on a single responsibility
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorator
- Prefer inline templates for small components (< 10 lines)
- Use external templates/styles with paths relative to the component TS file
- Order class members: signals, inputs, outputs, computed, lifecycle hooks, methods

```typescript
@Component({
  selector: 'app-user-card',
  template: `
    <div class="user-card" [class.active]="isActive()">
      <h3>{{ user().name }}</h3>
      <p>{{ user().email }}</p>
      <button (click)="handleClick()">View Profile</button>
    </div>
  `,
  styles: [
    `
      .user-card {
        padding: 1rem;
        border: 1px solid #ccc;
      }
      .user-card.active {
        border-color: #007bff;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserCardComponent {
  // Signals
  user = input.required<User>();
  isActive = input(false);

  // Outputs
  profileClick = output<string>();

  // Computed signals
  displayName = computed(() => this.user().name.toUpperCase());

  // Methods
  handleClick(): void {
    this.profileClick.emit(this.user().id);
  }
}
```

### Host Bindings

```typescript
@Component({
  selector: 'app-button',
  template: `<ng-content></ng-content>`,
  host: {
    '[class.disabled]': 'disabled()',
    '[attr.aria-disabled]': 'disabled()',
    '(click)': 'handleClick($event)',
  },
})
export class ButtonComponent {
  disabled = input(false);

  handleClick(event: MouseEvent): void {
    if (this.disabled()) {
      event.preventDefault();
      event.stopPropagation();
    }
  }
}
```

### Images

- Use `NgOptimizedImage` for all static images
- Note: `NgOptimizedImage` does not work for inline base64 images

```typescript
@Component({
  selector: 'app-hero',
  imports: [NgOptimizedImage],
  template: `
    <img ngSrc="/assets/hero.jpg"
         alt="Hero image"
         width="800"
         height="600"
         priority>
  `
})
```

---

## State Management

### Signal-Based State

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Use `update()` or `set()` instead of `mutate()`

```typescript
export class TodoListComponent {
  // Base signals
  todos = signal<Todo[]>([]);
  filter = signal<'all' | 'active' | 'completed'>('all');

  // Computed signals (derived state)
  filteredTodos = computed(() => {
    const allTodos = this.todos();
    const currentFilter = this.filter();

    switch (currentFilter) {
      case 'active':
        return allTodos.filter((t) => !t.completed);
      case 'completed':
        return allTodos.filter((t) => t.completed);
      default:
        return allTodos;
    }
  });

  activeCount = computed(() => this.todos().filter((t) => !t.completed).length);

  // State mutations
  addTodo(title: string): void {
    this.todos.update((todos) => [...todos, { id: Date.now(), title, completed: false }]);
  }

  toggleTodo(id: number): void {
    this.todos.update((todos) =>
      todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }

  removeTodo(id: number): void {
    this.todos.update((todos) => todos.filter((t) => t.id !== id));
  }
}
```

### Service-Level State

```typescript
@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSignal = signal<User | null>(null);
  private loadingSignal = signal(false);

  // Expose read-only signals
  user = this.userSignal.asReadonly();
  loading = this.loadingSignal.asReadonly();
  isAuthenticated = computed(() => this.user() !== null);

  login(credentials: Credentials): void {
    this.loadingSignal.set(true);
    // ... API call
    this.userSignal.set(user);
    this.loadingSignal.set(false);
  }

  logout(): void {
    this.userSignal.set(null);
  }
}
```

---

## Templates

### Template Syntax

- Keep templates simple and avoid complex logic
- Use native control flow instead of structural directives
- Use the async pipe to handle observables
- Do not assume globals like `Date` are available
- Do not write arrow functions in templates (not supported)

```typescript
@Component({
  template: `
    <!-- Use @if instead of *ngIf -->
    @if (user()) {
      <p>Welcome, {{ user()!.name }}</p>
    } @else {
      <p>Please log in</p>
    }

    <!-- Use @for instead of *ngFor -->
    @for (item of items(); track item.id) {
      <app-item [data]="item" />
    } @empty {
      <p>No items found</p>
    }

    <!-- Use @switch instead of *ngSwitch -->
    @switch (status()) {
      @case ('loading') {
        <app-spinner />
      }
      @case ('success') {
        <app-content [data]="data()" />
      }
      @case ('error') {
        <app-error [message]="errorMessage()" />
      }
    }

    <!-- Use class/style bindings -->
    <div [class.active]="isActive()"
         [style.color]="textColor()">
    </div>

    <!-- Async pipe for observables -->
    @if (user$ | async; as user) {
      <p>{{ user.name }}</p>
    }
  `
})
```

### Track Functions

Always provide track functions in `@for` loops for performance:

```typescript
@Component({
  template: `
    @for (item of items(); track item.id) {
      <app-item [data]="item" />
    }

    <!-- For arrays without IDs, use index -->
    @for (item of simpleArray(); track $index) {
      <p>{{ item }}</p>
    }
  `
})
```

---

## Services

### Service Design

- Design services around a single responsibility
- Use `providedIn: 'root'` for singleton services
- Use the `inject()` function instead of constructor injection
- Keep services stateless when possible or use signals for state

```typescript
@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private router = inject(Router);

  getUser(id: string): Observable<User> {
    return this.http.get<User>(`/api/users/${id}`);
  }

  updateUser(id: string, data: Partial<User>): Observable<User> {
    return this.http.patch<User>(`/api/users/${id}`, data);
  }
}
```

### Feature-Scoped Services

```typescript
// Provide at component level for non-singleton services
@Component({
  selector: 'app-user-form',
  providers: [FormValidationService],
})
export class UserFormComponent {
  private validator = inject(FormValidationService);
}
```

---

## Dependency Injection

### Modern Injection

Use `inject()` function instead of constructor injection:

```typescript
@Component({
  selector: 'app-dashboard',
})
export class DashboardComponent {
  // Modern approach
  private userService = inject(UserService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // Can use in initializers
  user = toSignal(this.userService.getCurrentUser());
}
```

### Injection Tokens

```typescript
// Define injection token
export const API_URL = new InjectionToken<string>('API_URL');

// Provide in app config
export const appConfig: ApplicationConfig = {
  providers: [{ provide: API_URL, useValue: 'https://api.example.com' }],
};

// Inject in service
@Injectable({ providedIn: 'root' })
export class ApiService {
  private apiUrl = inject(API_URL);
}
```

---

## Routing

### Route Configuration

```typescript
export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'users',
    loadComponent: () => import('./users/user-list.component').then((m) => m.UserListComponent),
  },
  {
    path: 'users/:id',
    loadComponent: () => import('./users/user-detail.component').then((m) => m.UserDetailComponent),
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    loadChildren: () => import('./admin/admin.routes').then((m) => m.ADMIN_ROUTES),
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];
```

### Functional Guards

```typescript
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url },
  });
};
```

### Route Parameters

```typescript
@Component({
  selector: 'app-user-detail',
})
export class UserDetailComponent {
  private route = inject(ActivatedRoute);
  private userService = inject(UserService);

  userId = toSignal(this.route.paramMap.pipe(map((params) => params.get('id')!)));

  user = toSignal(toObservable(this.userId).pipe(switchMap((id) => this.userService.getUser(id))));
}
```

---

## HTTP and API Calls

### HTTP Client

```typescript
@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = '/api';

  getItems<T>(endpoint: string): Observable<T[]> {
    return this.http.get<T[]>(`${this.baseUrl}/${endpoint}`).pipe(catchError(this.handleError));
  }

  getItem<T>(endpoint: string, id: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${endpoint}/${id}`).pipe(catchError(this.handleError));
  }

  createItem<T>(endpoint: string, data: Partial<T>): Observable<T> {
    return this.http
      .post<T>(`${this.baseUrl}/${endpoint}`, data)
      .pipe(catchError(this.handleError));
  }

  updateItem<T>(endpoint: string, id: string, data: Partial<T>): Observable<T> {
    return this.http
      .patch<T>(`${this.baseUrl}/${endpoint}/${id}`, data)
      .pipe(catchError(this.handleError));
  }

  deleteItem(endpoint: string, id: string): Observable<void> {
    return this.http
      .delete<void>(`${this.baseUrl}/${endpoint}/${id}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Server returned code ${error.status}: ${error.message}`;
    }

    return throwError(() => new Error(errorMessage));
  }
}
```

### Interceptors

```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(req);
};

// Provide in app config
export const appConfig: ApplicationConfig = {
  providers: [provideHttpClient(withInterceptors([authInterceptor]))],
};
```

---

## Forms

### Reactive Forms

Prefer Reactive Forms over Template-driven Forms:

```typescript
@Component({
  selector: 'app-user-form',
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
      <label for="name">Name:</label>
      <input id="name" formControlName="name" />
      @if (userForm.get('name')?.invalid && userForm.get('name')?.touched) {
      <span class="error">Name is required</span>
      }

      <label for="email">Email:</label>
      <input id="email" type="email" formControlName="email" />
      @if (userForm.get('email')?.invalid && userForm.get('email')?.touched) {
      <span class="error">Valid email is required</span>
      }

      <button type="submit" [disabled]="userForm.invalid">Submit</button>
    </form>
  `,
})
export class UserFormComponent {
  private fb = inject(FormBuilder);

  userForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    age: [null, [Validators.min(0), Validators.max(120)]],
  });

  onSubmit(): void {
    if (this.userForm.valid) {
      console.log(this.userForm.value);
    }
  }
}
```

### Custom Validators

```typescript
export function passwordStrengthValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null;
    }

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumeric = /[0-9]/.test(value);
    const hasSpecialChar = /[!@#$%^&*]/.test(value);

    const passwordValid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecialChar;

    return !passwordValid ? { passwordStrength: true } : null;
  };
}
```

---

## RxJS Best Practices

### Subscription Management

Always unsubscribe from observables:

```typescript
@Component({
  selector: 'app-user-list',
})
export class UserListComponent implements OnDestroy {
  private destroy$ = new Subject<void>();
  private userService = inject(UserService);

  users = signal<User[]>([]);

  ngOnInit(): void {
    this.userService
      .getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe((users) => this.users.set(users));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

### Prefer Signals with toSignal

```typescript
@Component({
  selector: 'app-user-profile',
})
export class UserProfileComponent {
  private userService = inject(UserService);

  // Automatically unsubscribes when component is destroyed
  user = toSignal(this.userService.getCurrentUser());
}
```

### Common Operators

```typescript
// Debounce user input
searchTerm$.pipe(
  debounceTime(300),
  distinctUntilChanged(),
  switchMap((term) => this.search(term))
);

// Combine multiple observables
combineLatest([users$, filter$]).pipe(
  map(([users, filter]) => users.filter((u) => u.status === filter))
);

// Handle errors
this.http.get(url).pipe(
  retry(3),
  catchError((error) => of([]))
);
```

---

## Error Handling

### Global Error Handler

```typescript
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private notificationService = inject(NotificationService);

  handleError(error: Error): void {
    console.error('Global error:', error);

    const message = error.message || 'An unexpected error occurred';
    this.notificationService.showError(message);
  }
}

// Provide in app config
export const appConfig: ApplicationConfig = {
  providers: [{ provide: ErrorHandler, useClass: GlobalErrorHandler }],
};
```

### Component-Level Error Handling

```typescript
@Component({
  selector: 'app-data-view',
})
export class DataViewController {
  private dataService = inject(DataService);

  data = signal<Data[]>([]);
  error = signal<string | null>(null);
  loading = signal(false);

  loadData(): void {
    this.loading.set(true);
    this.error.set(null);

    this.dataService
      .getData()
      .pipe(
        catchError((err) => {
          this.error.set(err.message);
          return of([]);
        }),
        finalize(() => this.loading.set(false))
      )
      .subscribe((data) => this.data.set(data));
  }
}
```

---

## Security

### XSS Prevention

- Angular sanitizes values by default
- Never use `innerHTML` with user-generated content
- Use `DomSanitizer` only when absolutely necessary

```typescript
@Component({
  template: `
    <!-- Safe: Angular escapes this -->
    <p>{{ userInput }}</p>

    <!-- Dangerous: Only use with trusted content -->
    <div [innerHTML]="trustedHtml"></div>
  `,
})
export class SafeComponent {
  private sanitizer = inject(DomSanitizer);

  trustedHtml = this.sanitizer.sanitize(SecurityContext.HTML, this.rawHtml);
}
```

### CSRF Protection

- Use Angular's `HttpClient` which handles CSRF tokens automatically
- Ensure your API sends proper CSRF tokens

### Authentication

```typescript
@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenKey = 'auth_token';

  storeToken(token: string): void {
    // Use sessionStorage for sensitive data
    sessionStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.tokenKey);
  }

  clearToken(): void {
    sessionStorage.removeItem(this.tokenKey);
  }
}
```

---

## Performance Optimization

### Change Detection

- Use `OnPush` change detection strategy
- Use signals for reactive state updates
- Avoid unnecessary computations in templates

```typescript
@Component({
  selector: 'app-optimized',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Computed values are memoized -->
    <p>{{ expensiveComputation() }}</p>
  `,
})
export class OptimizedComponent {
  data = input.required<Data>();

  // Only recomputes when data changes
  expensiveComputation = computed(() => {
    return this.data().items.reduce((sum, item) => sum + item.value, 0);
  });
}
```

### Lazy Loading

```typescript
// Lazy load routes
{
  path: 'admin',
  loadChildren: () => import('./admin/admin.routes')
}

// Lazy load components
@Component({
  template: `
    @defer (on viewport) {
      <app-heavy-component />
    } @placeholder {
      <p>Loading...</p>
    }
  `
})
```

### TrackBy Functions

```typescript
@Component({
  template: `
    @for (item of items(); track item.id) {
      <app-item [data]="item" />
    }
  `
})
```

### Virtual Scrolling

```typescript
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

@Component({
  imports: [CdkVirtualScrollViewport],
  template: `
    <cdk-virtual-scroll-viewport itemSize="50" class="list">
      @for (item of items(); track item.id) {
        <div class="item">{{ item.name }}</div>
      }
    </cdk-virtual-scroll-viewport>
  `
})
```

---

## Testing

### Component Testing

```typescript
describe('UserComponent', () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;
  });

  it('should display user name', () => {
    const user = { id: '1', name: 'John Doe' };
    fixture.componentRef.setInput('user', user);
    fixture.detectChanges();

    const element = fixture.nativeElement.querySelector('h3');
    expect(element.textContent).toBe('John Doe');
  });
});
```

### Service Testing

```typescript
describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch users', () => {
    const mockUsers = [{ id: '1', name: 'John' }];

    service.getUsers().subscribe((users) => {
      expect(users).toEqual(mockUsers);
    });

    const req = httpMock.expectOne('/api/users');
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });
});
```

---

## Project Structure

### Recommended Structure

```
src/
├── app/
│   ├── core/                  # Singleton services, guards, interceptors
│   │   ├── services/
│   │   ├── guards/
│   │   └── interceptors/
│   ├── shared/                # Shared components, directives, pipes
│   │   ├── components/
│   │   ├── directives/
│   │   └── pipes/
│   ├── features/              # Feature modules
│   │   ├── users/
│   │   │   ├── components/
│   │   │   ├── services/
│   │   │   └── users.routes.ts
│   │   └── products/
│   │       ├── components/
│   │       ├── services/
│   │       └── products.routes.ts
│   ├── app.component.ts
│   ├── app.config.ts
│   └── app.routes.ts
├── assets/
├── styles/
└── environments/
```

### File Naming

- Component: `user-profile.component.ts`
- Service: `user.service.ts`
- Directive: `highlight.directive.ts`
- Pipe: `currency-format.pipe.ts`
- Guard: `auth.guard.ts`
- Interceptor: `auth.interceptor.ts`

---

## Styling and CSS

### Component Styles

```typescript
@Component({
  selector: 'app-card',
  styles: [`
    :host {
      display: block;
      border: 1px solid #ccc;
      border-radius: 4px;
      padding: 1rem;
    }

    :host(.highlighted) {
      border-color: #007bff;
    }

    .card-title {
      font-size: 1.5rem;
      font-weight: bold;
    }
  `]
})
```

### Global Styles

- Keep global styles minimal
- Use CSS custom properties for theming
- Consider using Tailwind CSS or similar utility framework

```css
/* styles.css */
:root {
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  --spacing-unit: 0.5rem;
}

* {
  box-sizing: border-box;
}
```

---

## Build and Deployment

### Production Build

```bash
# Build for production
ng build --configuration production

# Analyze bundle size
ng build --stats-json
npx webpack-bundle-analyzer dist/stats.json
```

### Environment Configuration

```typescript
// environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
};

// environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.example.com',
};
```

### Optimization Checklist

- Enable production mode
- Use AOT compilation
- Enable build optimizer
- Configure lazy loading
- Implement code splitting
- Optimize images and assets
- Enable gzip compression
- Configure caching headers
- Monitor bundle sizes

---

## Additional Resources

- [Angular Documentation](https://angular.dev)
- [Angular Style Guide](https://angular.dev/style-guide)
- [RxJS Documentation](https://rxjs.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
