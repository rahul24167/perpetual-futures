export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { resolveLoopback }= await import('@/lib/resolveLoopback')
    await resolveLoopback();
  }

//   if (process.env.NEXT_RUNTIME === 'edge') {
//     await import('./instrumentation-edge')
//   }
}