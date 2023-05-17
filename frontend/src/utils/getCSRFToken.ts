import { getURL } from "./getRootURL";

export async function getCSRFToken(): Promise<string> {
    const response = await fetch(getURL('csrf'), { 
      credentials: 'include',
    });
    const data = await response.json()
    return data['csrfToken'];
}