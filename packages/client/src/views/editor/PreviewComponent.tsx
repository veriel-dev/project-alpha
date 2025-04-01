import { Page } from "@web-builder/shared/src/types";
import { PagePreview } from "../../components/PagePreview"
import useEditorStore from "../../stores/editorStore";

interface Props {
  handleSavePage: () => Promise<void>
}
export const PreviewComponent = ({ handleSavePage }: Props) => {
  const { togglePreviewMode, currentPage, saving } = useEditorStore();
  return (
    <div className="preview-mode">
      <div className="preview-header">
        <button onClick={togglePreviewMode} className="preview-close-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
          Exit Preview
        </button>
        <div className="preview-title">{currentPage?.title} - Preview</div>
        <div className="preview-actions">
          <button onClick={handleSavePage} className="preview-save-btn" disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
      <div className="preview-content">
        <PagePreview page={currentPage as Page} />
      </div>
    </div>
  )
}
