import { getCSRFToken } from "./getCSRFToken";

export async function asyncSubmitForm(endpoint: string, data: Record<string, string>) {
    const csrfToken = await getCSRFToken();

    const out = (new FormData());

    for (const [key, value] of Object.entries(data)) {
        out.append(key, value);
    }

    out.append('csrf_token', csrfToken);
    
    await fetch(endpoint, {
      method: 'POST',
      headers: {
        'X-CSRFToken': csrfToken,
      },
      body: out,
      credentials: 'include',
      redirect: 'follow'
    }).then(async response => {
      if (response.redirected) {
        window.location.href = response.url;
      } else {
        throw await response.json();
      }
    });
}