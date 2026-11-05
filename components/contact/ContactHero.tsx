export default function ContactHero() {
  return (
    <section className="bg-charcoal text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl hero-enter">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-0.5 bg-gold" />
            <span className="text-gold text-sm font-medium tracking-widest uppercase">
              Get In Touch
            </span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
            Talk to a <span className="italic text-gold">Real Person.</span> Get
            a Real Answer.
          </h1>
          <p className="text-white/80 text-lg leading-relaxed">
            No bots, no ticketing systems, no 48-hour response windows. Send us
            a message and Chidi will respond personally within 30 minutes during
            business hours.
          </p>
        </div>
      </div>
    </section>
  );
}
