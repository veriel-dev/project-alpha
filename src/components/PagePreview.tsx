import React from "react";
import { renderer } from "../rendering/RenderEngine";

export const PagePreview: React.FC<{
  page: Page;
}> = ({ page }) => {
  // Renderizar la página en un iframe
  const htmlContent = renderer.renderPageToHtml(page);
  
  return (
    <div className="page-preview">
      <iframe
        title="Page Preview"
        srcDoc={htmlContent}
        style={{ width: '100%', height: '100%', border: 'none' }}
      />
    </div>
  );
};