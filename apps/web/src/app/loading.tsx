import { StateCard } from "@/shared/ui/state-card";

export default function Loading() {
  return (
    <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4">
      <StateCard
        title="Загрузка приложения"
        description="Подготавливаем интерфейс и состояние сессии."
        icon="⏳"
      />
    </div>
  );
}
