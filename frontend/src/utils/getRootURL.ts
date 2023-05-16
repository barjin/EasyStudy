export function getURL(pathname: string) {
    pathname = pathname.replace(/^\/+/, '');

    return process.env.NODE_ENV !== 'development' ? `/${pathname}` : `http://localhost:5555/${pathname}`
}