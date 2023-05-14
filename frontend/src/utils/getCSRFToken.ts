export async function getCSRFToken(): Promise<string> {
    const response = await fetch('http://localhost:5555/csrf', { 
      credentials: 'include',
    });
    const data = await response.json()
    return data['csrfToken'];
}