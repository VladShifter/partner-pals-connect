import { forwardRef, useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'indent': '-1'}, { 'indent': '+1' }],
    ['link', 'blockquote'],
    [{ 'align': [] }],
    ['clean']
  ],
};

const formats = [
  'header', 'bold', 'italic', 'underline', 'strike',
  'list', 'bullet', 'indent', 'link', 'blockquote', 'align'
];

const RichTextEditor = forwardRef<ReactQuill, RichTextEditorProps>(
  ({ value, onChange, placeholder, className }, ref) => {
    const quillRef = useRef<ReactQuill>(null);

    useEffect(() => {
      if (ref && typeof ref === 'object') {
        ref.current = quillRef.current;
      }
    }, [ref]);

    return (
      <div className={className}>
        <style>{`
          .ql-editor {
            min-height: 150px;
            font-size: 14px;
            line-height: 1.5;
          }
          .ql-toolbar {
            border-top: 1px solid #d1d5db;
            border-left: 1px solid #d1d5db;
            border-right: 1px solid #d1d5db;
            border-bottom: none;
            border-radius: 0.375rem 0.375rem 0 0;
          }
          .ql-container {
            border-left: 1px solid #d1d5db;
            border-right: 1px solid #d1d5db;
            border-bottom: 1px solid #d1d5db;
            border-top: none;
            border-radius: 0 0 0.375rem 0.375rem;
          }
          .ql-editor:focus {
            outline: none;
          }
        `}</style>
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
        />
      </div>
    );
  }
);

RichTextEditor.displayName = 'RichTextEditor';

export { RichTextEditor };