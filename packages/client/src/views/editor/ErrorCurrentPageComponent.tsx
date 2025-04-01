
import { useNavigate } from 'react-router-dom';

export const ErrorCurrentPageComponent = () => {
  const navigate = useNavigate();
  return (
    <div className="error-state">
      <div className="error-container">
        <h2>Could not load page</h2>
        <p>The page or root component could not be loaded. Please try again or create a new page.</p>
        <button onClick={() => navigate('/pages')} className="reload-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          Back to Pages
        </button>
      </div>
    </div>
  )
}
