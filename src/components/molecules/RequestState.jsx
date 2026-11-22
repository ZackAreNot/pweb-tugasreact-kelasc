import Button from '../atoms/Button'

export default function RequestState({ pending, error, onRetry }) {
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-8 text-center">
      {pending ? (
        <p role="status" className="text-stone-600">
          Memuat produk…
        </p>
      ) : (
        <>
          <p role="alert" className="text-red-700">
            {error.message}
          </p>
          <Button className="mt-4" onClick={onRetry}>
            Coba lagi
          </Button>
        </>
      )}
    </div>
  )
}
