import { useSavePreferences } from '@/features/appearance/hooks/use-appearance'
import { useAppearanceEditorStore } from '@/features/appearance/store/appearance-editor-store'
import { Button } from '@/shared/components/ui/button'

export function SaveBar() {
  const isDirty = useAppearanceEditorStore((s) => s.isDirty)
  const discard = useAppearanceEditorStore((s) => s.discard)
  const saveMutation = useSavePreferences()

  return (
    <div className="flex items-center gap-2">
      {isDirty && (
        <Button
          type="button"
          variant="outline"
          onClick={discard}
          disabled={saveMutation.isPending}
          className="border-[#331400]/20 text-[#331400] dark:border-[#F5EEE4]/20 dark:text-[#F5EEE4]"
        >
          Discard
        </Button>
      )}
      <Button
        type="button"
        onClick={() => saveMutation.mutate()}
        disabled={!isDirty || saveMutation.isPending}
        className="bg-[#FED45C] text-[#331400] hover:bg-[#FED45C]/90"
      >
        {saveMutation.isPending ? 'Saving…' : 'Save Changes'}
      </Button>
    </div>
  )
}
