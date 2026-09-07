import { Component } from "@/components/ui/testimonial";
import { CircularRevealHeading } from "@/components/ui/circular-reveal-heading";
import SharedLayoutAnimation from "@/components/ui/motion-shared-layout-animation";
import DotParticleCanvas from "@/components/ui/dot-particles";
import ArrowFillButton from "@/components/ui/arrow-fill-button";

export function ArrowFillButtonDemo() {
  return (
    <div className="flex min-h-64 w-full items-center justify-center p-12">
      <ArrowFillButton
        btnText="Hover me"
        href="https://vault.hyperiux.com"
        onClick={(event) => event.preventDefault()}
      />
    </div>
  );
}

export default function DemoOne() {

  return <Component />;
}

const items = [
  {
    text: "STRATEGY",
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80",
  },
  {
    text: "DESIGN",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
  },
  {
    text: "GROWTH",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
  },
  {
    text: "INNOVATION",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80",
  },
];

export function MediumCircularRevealHeadingDemo() {
  return (
    <div className="p-16 min-h-screen flex items-center justify-center">
      <CircularRevealHeading
        items={items}
        centerText={
          <div className="text-xl font-bold text-[#444444]">
            MISHRA HUB
          </div>
        }
        size="md"
      />
    </div>
  );
}

export function LargeCircularRevealHeadingDemo() {
  return (
    <div className="p-16 min-h-screen flex items-center justify-center">
      <CircularRevealHeading
        items={items}
        centerText={
          <div className="text-2xl font-bold text-[#444444]">
            MISHRA HUB
          </div>
        }
        size="lg"
      />
    </div>
  );
}

export function SmallCircularRevealHeadingDemo() {
  return (
    <div className="p-16 min-h-screen flex items-center justify-center">
      <CircularRevealHeading
        items={items}
        centerText={
          <div className="text-sm font-bold text-[#444444]">
            MISHRA HUB
          </div>
        }
        size="sm"
      />
    </div>
  );
}

export function SharedLayoutDemo() {
  return (
    <div className="motion-example flex w-full items-center justify-center p-6">
      <SharedLayoutAnimation />
    </div>
  );
}

export function TextEffectPerChar() {
  return (
    <TextEffect per="char" preset="fade">
      Animate your ideas with motion-primitives
    </TextEffect>
  );
}

export function TextEffectWithPreset() {
  return (
    <TextEffect per="word" as="h3" preset="slide">
      Animate your ideas with motion-primitives
    </TextEffect>
  );
}

export function TextEffectWithCustomVariants() {
  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const fancyVariants = {
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.05,
        },
      },
    },
    item: {
      hidden: () => ({
        opacity: 0,
        y: Math.random() * 100 - 50,
        rotate: Math.random() * 90 - 45,
        scale: 0.3,
        color: getRandomColor(),
      }),
      visible: {
        opacity: 1,
        y: 0,
        rotate: 0,
        scale: 1,
        color: getRandomColor(),
        transition: {
          type: 'spring' as const,
          damping: 12,
          stiffness: 200,
        },
      },
    },
  };

  return (
    <TextEffect per="word" variants={fancyVariants}>
      Animate your ideas with motion-primitives
    </TextEffect>
  );
}

export function TextEffectWithCustomDelay() {
  return (
    <div className="flex flex-col space-y-0">
      <TextEffect
        per="char"
        delay={0.5}
        variants={{
          container: {
            hidden: {
              opacity: 0,
            },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.05,
              },
            },
          },
          item: {
            hidden: {
              opacity: 0,
              rotateX: 90,
              y: 10,
            },
            visible: {
              opacity: 1,
              rotateX: 0,
              y: 0,
              transition: {
                duration: 0.2,
              },
            },
          },
        }}
      >
        Animate your ideas
      </TextEffect>
      <TextEffect per="char" delay={1.5}>
        with motion-primitives
      </TextEffect>
      <TextEffect
        per="char"
        delay={2.5}
        className="pt-12 text-xs"
        preset="blur"
      >
        (and delay!)
      </TextEffect>
    </div>
  );
}

export function TextEffectPerLine() {
  return (
    <TextEffect
      per="line"
      as="p"
      segmentWrapperClassName="overflow-hidden block"
      variants={{
        container: {
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 },
          },
        },
        item: {
          hidden: {
            opacity: 0,
            y: 40,
          },
          visible: {
            opacity: 1,
            y: 0,
            transition: {
              duration: 0.4,
            },
          },
        },
      }}
    >
      {`now live on motion-primitives!\nnow live on motion-primitives!\nnow live on motion-primitives!`}
    </TextEffect>
  );
}

export function TextEffectWithExit() {
  const [trigger, setTrigger] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setTrigger((prev) => !prev);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const blurSlideVariants = {
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: 0.01 },
      },
      exit: {
        transition: { staggerChildren: 0.01, staggerDirection: 1 },
      },
    },
    item: {
      hidden: {
        opacity: 0,
        filter: 'blur(10px) brightness(0%)',
        y: 0,
      },
      visible: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px) brightness(100%)',
        transition: {
          duration: 0.4,
        },
      },
      exit: {
        opacity: 0,
        y: -30,
        filter: 'blur(10px) brightness(0%)',
        transition: {
          duration: 0.4,
        },
      },
    },
  };

  return (
    <TextEffect
      className="inline-flex"
      per="char"
      variants={blurSlideVariants}
      trigger={trigger}
    >
      Animate your ideas with motion-primitives
    </TextEffect>
  );
}

export function DotParticleDemo() {
  return (
    <div className="relative w-full h-[400px] overflow-hidden rounded-xl border border-[hsl(var(--border))]">
      <DotParticleCanvas />
    </div>
  );
}



