import { Shield, Star, Users } from "lucide-react";

const badges = [
  { icon: Shield, text: "Verified Apartments" },
  { icon: Star, text: "4.9 Average Rating" },
  { icon: Users, text: "500+ Guests Hosted" },
];

export default function AboutHero() {
  return (
    <section className="bg-charcoal text-white py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-0.5 bg-gold" />
            <span className="text-gold text-sm font-medium tracking-widest uppercase">
              About Haven Shortlets
            </span>
          </div>

          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Port Harcourt&apos;s{" "}
            <span className="italic text-gold">Most Trusted</span> Short-Let
            Operator
          </h1>

          <p className="text-white/60 text-lg leading-relaxed mb-10">
            We started Haven Shortlets because we were frustrated with the Port
            Harcourt short-let experience — misleading photos, power cuts that
            were not disclosed, hosts who disappeared after payment. We built
            the service we wished existed.
          </p>

          <div className="flex flex-wrap gap-4">
            {badges.map((badge) => (
              <div
                key={badge.text}
                className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2"
              >
                <badge.icon className="w-4 h-4 text-gold shrink-0" />
                <span className="text-white text-xs font-medium">
                  {badge.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
