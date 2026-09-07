import { useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import "./motion-shared-layout-animation-utils/index.css"

const foods = [
  { icon: "🍅", label: "Tomato" },
  { icon: "🥬", label: "Lettuce" },
  { icon: "🧀", label: "Cheese" },
] as const

type Food = (typeof foods)[number]

export function SharedLayoutAnimation() {
  const [selected, setSelected] = useState<Food>(foods[0])

  return (
    <div className="shared-layout-card">
      <nav className="shared-layout-card__nav">
        <ul className="shared-layout-card__tabs">
          {foods.map((item) => (
            <motion.li
              key={item.label}
              initial={false}
              animate={{ backgroundColor: item === selected ? "hsl(var(--muted))" : "transparent" }}
              className="shared-layout-card__tab"
              onClick={() => setSelected(item)}
            >
              {`${item.icon} ${item.label}`}
              {item === selected ? (
                <motion.div
                  className="shared-layout-card__underline"
                  layoutId="underline"
                  id="underline"
                />
              ) : null}
            </motion.li>
          ))}
        </ul>
      </nav>
      <main className="shared-layout-card__main">
        <AnimatePresence mode="wait">
          <motion.div
            key={selected ? selected.label : "empty"}
            className="shared-layout-card__icon"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {selected ? selected.icon : "😋"}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}

export default SharedLayoutAnimation
