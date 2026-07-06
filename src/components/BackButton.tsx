import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  label?: string;
  onClick: () => void;
}

export default function BackButton({ label = '返回大厅', onClick }: BackButtonProps) {
  return (
    <button className="ghost-button back-button" type="button" onClick={onClick}>
      <ArrowLeft size={18} aria-hidden="true" />
      <span>{label}</span>
    </button>
  );
}
