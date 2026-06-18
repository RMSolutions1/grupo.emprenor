/** Campo oculto anti-spam (honeypot). Los bots suelen completarlo. */
export default function HoneypotField() {
  return (
    <input
      type="text"
      name="_hp"
      tabIndex={-1}
      autoComplete="off"
      aria-hidden="true"
      className="absolute opacity-0 pointer-events-none h-0 w-0 overflow-hidden"
    />
  )
}
