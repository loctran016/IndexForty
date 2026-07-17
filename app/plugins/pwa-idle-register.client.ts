export default defineNuxtPlugin(() => {
  const register = () => {
    if (!('serviceWorker' in navigator)) return
    navigator.serviceWorker.register(
      import.meta.env.MODE === 'production' ? '/sw.js' : '/dev-sw.js?dev-sw',
    )
  }

  // requestIdleCallback isn't available in Safari — setTimeout is the standard fallback
  if ('requestIdleCallback' in window) {
    ;(window as any).requestIdleCallback(register, { timeout: 4000 })
  } else {
    setTimeout(register, 2000)
  }
})
