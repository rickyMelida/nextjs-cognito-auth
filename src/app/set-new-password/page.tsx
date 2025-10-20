import { Suspense } from 'react';
import SetNewPasswordForm from '@/components/SetNewPasswordForm';

export default function SetNewPasswordPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <SetNewPasswordForm />
    </Suspense>
  );
}