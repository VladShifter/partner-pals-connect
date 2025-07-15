import { forwardRef, useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const formats = [
  'header', 'bold', 'italic', 'underline', 'strike',
  'list', 'bullet', 'indent', 'link', 'blockquote', 'align', 'image'
];

const RichTextEditor = forwardRef<ReactQuill, RichTextEditorProps>(
  ({ value, onChange, placeholder, className }, ref) => {
    const quillRef = useRef<ReactQuill>(null);
    const { toast } = useToast();

    // Image upload handler
    const imageHandler = () => {
      const input = document.createElement('input');
      input.setAttribute('type', 'file');
      input.setAttribute('accept', 'image/*');
      input.click();

      input.onchange = async () => {
        const file = input.files?.[0];
        if (!file) return;

        try {
          console.log('Starting image upload...', file.name);
          
          // Upload image to Supabase storage
          const fileExt = file.name.split('.').pop();
          const fileName = `${Math.random()}.${fileExt}`;
          
          console.log('Uploading to storage...', fileName);
          const { data, error } = await supabase.storage
            .from('editor-images')
            .upload(fileName, file);

          if (error) {
            console.error('Storage upload error:', error);
            throw error;
          }

          console.log('Upload successful:', data);

          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from('editor-images')
            .getPublicUrl(fileName);

          console.log('Public URL:', publicUrl);

          // Insert image into editor with safer approach
          const quill = quillRef.current?.getEditor();
          if (quill) {
            try {
              // Get current selection or set to end if no selection
              let range = quill.getSelection();
              if (!range) {
                // If no selection, insert at the end of the document
                range = { index: quill.getLength(), length: 0 };
              }
              
              console.log('Inserting image at range:', range);
              
              // Focus the editor first to ensure it's active
              quill.focus();
              
              // Small delay to ensure focus is set
               setTimeout(() => {
                 try {
                   quill.insertEmbed(range!.index, 'image', publicUrl);
                   // Move cursor after the image
                   quill.setSelection({ index: range!.index + 1, length: 0 });
                 } catch (embedError) {
                   console.error('Error inserting embed:', embedError);
                   // Fallback: just append to the end
                   const length = quill.getLength();
                   quill.insertEmbed(length - 1, 'image', publicUrl);
                 }
               }, 100);
            } catch (error) {
              console.error('Error with range selection:', error);
              // Fallback: insert at the end
              const length = quill.getLength();
              quill.insertEmbed(length - 1, 'image', publicUrl);
            }
          } else {
            console.error('Quill editor not found');
          }

          toast({
            title: "Изображение загружено",
            description: "Изображение успешно добавлено в текст",
          });
        } catch (error) {
          console.error('Error uploading image:', error);
          toast({
            title: "Ошибка загрузки",
            description: "Не удалось загрузить изображение",
            variant: "destructive",
          });
        }
      };
    };

    const modules = {
      toolbar: {
        container: [
          [{ 'header': [1, 2, 3, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          [{ 'indent': '-1'}, { 'indent': '+1' }],
          ['link', 'image', 'blockquote'],
          [{ 'align': [] }],
          ['clean']
        ],
        handlers: {
          image: imageHandler
        }
      }
    };

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