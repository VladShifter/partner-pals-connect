import React, { forwardRef, useEffect, useRef, useCallback, memo } from 'react';
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

const RichTextEditor = memo(forwardRef<ReactQuill, RichTextEditorProps>(
  ({ value, onChange, placeholder, className }, ref) => {
    const quillRef = useRef<ReactQuill>(null);
    const timeoutRef = useRef<NodeJS.Timeout>();
    const { toast } = useToast();

    // Debounced onChange to prevent rapid re-renders
    const debouncedOnChange = useCallback((content: string) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        onChange(content);
      }, 300);
    }, [onChange]);

    const imageHandler = useCallback(() => {
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

          // Insert image into editor with simplified approach
          const quill = quillRef.current?.getEditor();
          if (quill) {
            try {
              // Get current content length
              const length = quill.getLength();
              // Insert image at the end to avoid selection issues
              quill.insertEmbed(length - 1, 'image', publicUrl);
              console.log('Image inserted successfully at position:', length - 1);
              
              // Force update the content to trigger onChange immediately
              const newContent = quill.root.innerHTML;
              console.log('Forcing content update:', newContent);
              
              // Clear any pending debounced call and call onChange immediately
              if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
              }
              onChange(newContent);
              
            } catch (error) {
              console.error('Error inserting image:', error);
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
    }, [toast]);

    // Cleanup timeout on unmount
    useEffect(() => {
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }, []);

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
          value={value || ''}
          onChange={debouncedOnChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
          preserveWhitespace
        />
      </div>
    );
  }
));

RichTextEditor.displayName = 'RichTextEditor';

export { RichTextEditor };