# React Page Creation Prompt

Create a new React page component for [PAGE_DESCRIPTION] following these requirements.

Follow `AGENTS.md` and `.github/instructions/{architecture-guide,patterns}.instructions.md`. The points below are page-specific.

## Core Requirements

### 1. Page Structure

- Use the `.page.tsx` suffix; a plain function component with an inferred return type. Keep data/business logic in custom hooks.
- Import routing primitives from `#libs/router` (React Router 8); lazy-load routes. The route's
  `Layout:` field supplies the wrapping layout — pages never wrap themselves.

### 2. Data & state

- Type route params: `useParams<{ id: string }>()`. Get services/config via `useInjection(...)` from the relative `app.ioc.ts` (never hardcode config).
- Handle loading, error, and success states; manage URL state and navigation.

### 3. User experience

- Document title / SEO; responsive; accessible (semantic HTML, ARIA, keyboard).
- Loading indicators and an error boundary; handle auth/authorization where relevant.

### 4. Error handling

- Surface meaningful messages (catch param `error`); handle network/timeout failures; offer retry where useful.

## Implementation Patterns

### Basic Page Template

```tsx
import { useNavigate, useParams } from '#libs/router';

/**
 * [page description explaining purpose and functionality]
 * handles [specific features] with proper error handling and loading states.
 */
export const PageName = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();

	// page implementation — the layout wrapping this page is applied centrally
	// by the route's `Layout:` field in app.routes.tsx, not by the page itself
	return <section>{/* page content */}</section>;
};
```

### Page with Data Fetching

```tsx
import { useEffect, useState } from 'react';
import { useParams } from '#libs/router';
import { useInjection } from '../app.ioc.ts';
import { HttpClient } from '../services/http-client.service.ts';
import { type User } from './user.schema.ts';

export const UserPage = () => {
	const { id } = useParams<{ id: string }>();
	const httpClient = useInjection(HttpClient);

	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchUser = async () => {
			try {
				setIsLoading(true);
				setError(null);
				setUser(await httpClient.get<User>(`/users/${id}`));
			} catch (error) {
				setError(
					error instanceof Error
						? error.message
						: 'failed to load user',
				);
			} finally {
				setIsLoading(false);
			}
		};

		if (id) void fetchUser();
	}, [id, httpClient]);

	if (isLoading) return <LoadingSpinner />;
	if (error) return <ErrorMessage error={error} />;
	if (!user) return <NotFound />;

	return <UserProfile user={user} />;
};
```

### Page with Form Handling

```tsx
import { useState } from 'react';
import { useNavigate } from '#libs/router';
import { z } from 'zod';
import { useInjection } from '../app.ioc.ts';
import { HttpClient } from '../services/http-client.service.ts';

const FormSchema = z.object({
	title: z.string().min(1, 'title is required'),
	description: z.string().optional(),
});

type FormData = z.infer<typeof FormSchema>;

export const CreateItemPage = () => {
	const navigate = useNavigate();
	const httpClient = useInjection(HttpClient);

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (data: FormData) => {
		try {
			setIsSubmitting(true);
			setError(null);

			const item = await httpClient.post<{ id: string }>('/items', data);
			navigate(`/items/${item.id}`);
		} catch (error) {
			setError(
				error instanceof Error
					? error.message
					: 'failed to create item',
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<CreateItemForm
			onSubmit={handleSubmit}
			isSubmitting={isSubmitting}
			error={error}
		/>
	);
};
```

## Technical Checklist

- [ ] `.page.tsx` suffix; plain function component; registered under a route with a `Layout:`
- [ ] Typed `useParams`; navigation via `useNavigate`; routing primitives from `#libs/router`
- [ ] Services/config via `useInjection` (no hardcoded values); data/logic in custom hooks
- [ ] Loading/error/success states; error boundary; Zod for form validation
- [ ] Document title / SEO; responsive; accessible (ARIA, semantic HTML, keyboard)
- [ ] Auth/authorization handled where relevant; no sensitive data leaked
- [ ] Lazy-loaded route; effects cleaned up
- [ ] Tests cover render, data fetching, interactions, and error states

## Navigation Patterns

### Route Configuration

Register the page in `app.routes.tsx` as a lazy route (see **architecture-guide**):

```tsx
// inside the routes array (RouteDefinition[])
{
	path: 'users/:id',
	lazy: () => import('./pages/user/User.page.tsx'),
	ErrorBoundary: ErrorPage,
}
```

### Protected Routes

```tsx
import { useEffect } from 'react';
import { useNavigate } from '#libs/router';
import { useAuth } from '../hooks/use-auth.ts';

export const ProtectedPage = () => {
	const { isAuthenticated } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (!isAuthenticated) navigate('/login', { replace: true });
	}, [isAuthenticated, navigate]);

	if (!isAuthenticated) return <LoadingSpinner />;

	return <section>{/* protected content */}</section>;
};
```

Generate the page component following these patterns and ensure it integrates seamlessly with the existing architecture and routing system.
