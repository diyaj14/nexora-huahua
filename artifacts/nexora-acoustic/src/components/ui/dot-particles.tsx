import React, { useEffect, useRef, useCallback } from "react"

export interface DotParticleCanvasProps {
  backgroundColor?: string
  particleColor?: string
  animationSpeed?: number
  className?: string
}

export const DotParticleCanvas = ({
  backgroundColor = "transparent",
  particleColor = "80, 68, 55",
  animationSpeed = 0.006,
  className = "",
}: DotParticleCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const requestIdRef = useRef<number | null>(null)
  const timeRef = useRef<number>(0)
  const mouseRef = useRef({ x: 0, y: 0 })
  const dprRef = useRef<number>(1)
  const particles = useRef<
    Array<{
      x: number
      y: number
      vx: number
      vy: number
      life: number
      maxLife: number
      size: number
      angle: number
      speed: number
    }>
  >([])

  const lastPosRef = useRef({ x: 0, y: 0 })

  const spawnAmbientParticle = useCallback((width: number, height: number) => {
    const angle = Math.random() * Math.PI * 2
    const speed = 0.12 + Math.random() * 0.35
    particles.current.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 0,
      maxLife: 2600 + Math.random() * 3000,
      size: 1.1 + Math.random() * 1.5,
      angle: angle,
      speed: speed,
    })
  }, [])

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const dpr = window.devicePixelRatio || 1
    dprRef.current = dpr

    const rect = canvas.getBoundingClientRect()
    const displayWidth = Math.max(rect.width, canvas.parentElement?.clientWidth || window.innerWidth)
    const displayHeight = Math.max(rect.height, canvas.parentElement?.clientHeight || window.innerHeight)

    canvas.width = Math.floor(displayWidth * dpr)
    canvas.height = Math.floor(displayHeight * dpr)

    canvas.style.width = displayWidth + "px"
    canvas.style.height = displayHeight + "px"

    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.scale(dpr, dpr)
    }

    if (particles.current.length < 8 && displayWidth > 0 && displayHeight > 0) {
      for (let i = 0; i < 8; i++) {
        spawnAmbientParticle(displayWidth, displayHeight)
      }
    }
  }, [spawnAmbientParticle])

  // Responsive, subtle hover effect: emits a single delicate dot on movement with distance threshold
  const handlePointerMove = useCallback((e: PointerEvent | MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const currentX = e.clientX - rect.left
    const currentY = e.clientY - rect.top

    const dx = currentX - lastPosRef.current.x
    const dy = currentY - lastPosRef.current.y
    const dist = Math.hypot(dx, dy)

    mouseRef.current.x = currentX
    mouseRef.current.y = currentY

    // Only emit a dot when mouse has moved noticeably, with a low spawn rate and hard cap
    if (dist > 22 && Math.random() < 0.4 && particles.current.length < 18) {
      lastPosRef.current = { x: currentX, y: currentY }
      const angle = Math.random() * Math.PI * 2
      const speed = 0.35 + Math.random() * 0.9

      particles.current.push({
        x: currentX + (Math.random() - 0.5) * 4,
        y: currentY + (Math.random() - 0.5) * 4,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.1,
        life: 0,
        maxLife: 1200 + Math.random() * 1200,
        size: 1.1 + Math.random() * 1.6,
        angle: angle,
        speed: speed,
      })
    }
  }, [])

  const animate = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    timeRef.current += animationSpeed

    const width = canvas.clientWidth || canvas.offsetWidth
    const height = canvas.clientHeight || canvas.offsetHeight

    if (backgroundColor && backgroundColor !== "transparent") {
      ctx.fillStyle = backgroundColor
      ctx.fillRect(0, 0, width, height)
    } else {
      ctx.clearRect(0, 0, width, height)
    }

    // Maintain a minimal, calm ambient particle presence
    if (particles.current.length < 8 && Math.random() < 0.03 && width > 0 && height > 0) {
      spawnAmbientParticle(width, height)
    }

    particles.current = particles.current.filter((particle) => {
      particle.life += 16
      particle.x += particle.vx
      particle.y += particle.vy

      particle.vy += 0.015
      particle.vx *= 0.99
      particle.vy *= 0.99

      const organicX = Math.sin(timeRef.current + particle.angle) * 0.22
      const organicY = Math.cos(timeRef.current + particle.angle * 0.7) * 0.18
      particle.x += organicX
      particle.y += organicY

      const lifeProgress = particle.life / particle.maxLife
      const alpha = Math.max(0, (1 - lifeProgress) * 0.85)
      const currentSize = particle.size * (1 - lifeProgress * 0.3)

      if (alpha > 0) {
        ctx.fillStyle = `rgba(${particleColor}, ${alpha})`
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, Math.max(0.5, currentSize), 0, 2 * Math.PI)
        ctx.fill()
      }

      return (
        particle.life < particle.maxLife &&
        particle.x > -60 &&
        particle.x < width + 60 &&
        particle.y > -60 &&
        particle.y < height + 60
      )
    })

    requestIdRef.current = requestAnimationFrame(animate)
  }, [backgroundColor, particleColor, animationSpeed, spawnAmbientParticle])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    resizeCanvas()

    const handleResize = () => resizeCanvas()
    window.addEventListener("resize", handleResize)

    // Listen on the enclosing card/box element for hover motions ONLY (no click effect)
    const boxContainer =
      canvas.closest('[data-testid="about-tabs-box"]') ||
      canvas.parentElement?.parentElement ||
      canvas.parentElement ||
      canvas

    boxContainer.addEventListener("pointermove", handlePointerMove as EventListener)

    animate()

    return () => {
      window.removeEventListener("resize", handleResize)
      boxContainer.removeEventListener("pointermove", handlePointerMove as EventListener)

      if (requestIdRef.current) {
        cancelAnimationFrame(requestIdRef.current)
        requestIdRef.current = null
      }
      timeRef.current = 0
      particles.current = []
    }
  }, [animate, resizeCanvas, handlePointerMove])

  return (
    <div
      className={`absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-10 ${className}`}
      style={{ backgroundColor: backgroundColor !== "transparent" ? backgroundColor : undefined }}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  )
}

export default DotParticleCanvas
