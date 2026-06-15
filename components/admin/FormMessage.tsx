import type { ActionState } from "@/app/admin/actions";

export function FormMessage({ state }: { state: ActionState }) {
  if (!state) return null;
  if (state.error) {
    return <p className="text-sm text-red-600">{state.error}</p>;
  }
  if (state.success) {
    return <p className="text-sm text-green-600">{state.success}</p>;
  }
  return null;
}
