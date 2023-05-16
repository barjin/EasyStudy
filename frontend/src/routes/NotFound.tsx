import { Link } from "react-router-dom";

export function NotFound() {
    return (
        <div>
            <h1>404 Not Found</h1>
            <p>Sorry, we could not find the page you were looking for. <Link to='/'>Go home?</Link></p>
        </div>
    );
}