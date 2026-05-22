import { clsx } from 'clsx';
import type { InputHTMLAttributes, TextareaHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  className?: string;
  icon?: ReactNode;
}

export function Input({ label, className = '', icon, ...props }: InputProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-black/60">{label}</label>
      )}
      <div className={clsx('relative', icon && 'pl-10')}>
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40">
            {icon}
          </div>
        )}
        <input
          className={clsx(
            'w-full px-4 py-3 bg-gray-50 border border-black/10 rounded-xl text-black placeholder-black/30 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black/20 transition-all duration-200',
            className
          )}
          {...props}
        />
      </div>
    </div>
  );
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  className?: string;
}

export function Textarea({ label, className = '', ...props }: TextareaProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-black/60">{label}</label>
      )}
      <textarea
        className={clsx(
          'w-full px-4 py-3 bg-gray-50 border border-black/10 rounded-xl text-black placeholder-black/30 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black/20 transition-all duration-200 resize-none',
          className
        )}
        {...props}
      />
    </div>
  );
}
