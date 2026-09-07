import { KineticText } from "@/registry/magicui/kinetic-text";

export function KineticTextDemo() {
  return (
    <div className="relative flex justify-center">
      <KineticText
        text="Nostalgia"
        className="text-[6rem] tracking-[-5%] [font-optical-sizing:auto]"
      />
    </div>
  );
}

export default KineticTextDemo;
