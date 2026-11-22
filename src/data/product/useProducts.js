import { useEffect, useState } from 'react'
import { requestProduct } from './api'

export default function useProducts(path = '') {
  const [attempt, setAttempt] = useState(0)
  const [state, setState] = useState({
    path,
    pending: true,
    data: null,
    error: null,
  })

  useEffect(() => {
    const controller = new AbortController()
    setState({ path, pending: true, data: null, error: null })
    requestProduct(path, { signal: controller.signal })
      .then((data) => {
        if (!controller.signal.aborted)
          setState({ path, pending: false, data, error: null })
      })
      .catch((error) => {
        if (!controller.signal.aborted)
          setState({ path, pending: false, data: null, error })
      })
    return () => controller.abort()
  }, [path, attempt])

  return {
    ...(state.path === path
      ? state
      : { pending: true, data: null, error: null }),
    reload: () => setAttempt((current) => current + 1),
  }
}
