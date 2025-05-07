type FetchOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
	body?: unknown;
	headers?: Record<string, string>;
	formData?: FormData;
};

export async function apiFetch<T>(
	endpoint: string,
	options: FetchOptions = {}
): Promise<T> {
	const { method = 'GET', body, formData, headers = {} } = options;

	const fetchOptions: RequestInit = {
		method,
		headers: formData ? {} : {
			'Content-Type': 'application/json',
			...headers,
		},
		credentials: 'include',
	};

	if (body && !formData) {
		fetchOptions.body = JSON.stringify(body);
	}

	if (formData) {
		fetchOptions.body = formData;
	}

	const response = await fetch(`/api/${endpoint}`, fetchOptions);

	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		throw new Error(
			errorData.error || `API request failed with status ${response.status}`
		);
	}

	if (response.status === 204) {
		return {} as T;
	}

	return await response.json();
}