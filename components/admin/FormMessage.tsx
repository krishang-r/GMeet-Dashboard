import type { ActionState } from "@/app/admin/actions";

export function FormMessage({ state }: { state: ActionState }) {
  if (!state) return null;
  if (state.error) {
    return <p className="text-sm text-danger">{state.error}</p>;
  }
  if (state.success) {
    return <p className="text-sm text-success">{state.success}</p>;
  }
  return null;
}
