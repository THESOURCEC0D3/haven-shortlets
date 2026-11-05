const milestones = [
  {
    year: "2019",
    title: "Founded in Port Harcourt",
    description:
      "Haven Shortlets launched with two apartments in GRA Phase 2 after our founder experienced firsthand how unreliable the Port Harcourt short-let market was for visiting professionals.",
  },
  {
    year: "2021",
    title: "Expanded to Woji",
    description:
      "Growing demand from oil services contractors and mid-level professionals pushed us to expand into Woji — bringing the Haven standard to a more accessible price point.",
  },
  {
    year: "2023",
    title: "500 Guests Milestone",
    description:
      "Crossed 500 successful guest stays with a 4.9 average rating and a 73% return guest rate — the clearest proof that our approach works.",
  },
  {
    year: "2024",
    title: "Direct Booking Platform",
    description:
      "Launched our direct booking website so guests could save the 15-25% Airbnb service fee. Our guests keep that money. We keep the relationship.",
  },
];

export default function OurStory() {
  return (
    <section className="py-20 bg-ivory">
      <div data-reveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Story Text */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-0.5 bg-gold" />
              <span className="text-gold-text text-sm font-medium tracking-widest uppercase">
                Our Story
              </span>
            </div>
            <h2 className="font-display text-4xl font-bold text-charcoal leading-tight mb-6">
              Built Out of{" "}
              <span className="italic text-gold-text">Frustration.</span> Run With
              Pride.
            </h2>
            <div className="flex flex-col gap-4 text-slate-600 leading-relaxed">
              <p>
                In 2019 our founder flew into Port Harcourt for a two-week work
                rotation. The apartment he booked on a popular platform looked
                nothing like the photos. The generator ran for four hours a day.
                The host stopped responding after check-in.
              </p>
              <p>
                He spent that two weeks promising himself he would build
                something better. Haven Shortlets is that something better.
              </p>
              <p>
                Every decision we make — from which apartments we operate to how
                we handle a 2am power complaint — comes from that original
                frustration. We know exactly what a guest needs because we have
                been that guest.
              </p>
              <p>
                Five years later we have hosted over 500 guests, maintained a
                4.9 average rating, and watched 73% of our guests come back. We
                are not the biggest short-let operator in Port Harcourt. We are
                the most reliable one.
              </p>
            </div>
          </div>

          {/* Timeline */}
          <div>
            <div className="flex items-center gap-2 mb-8">
              <div className="w-8 h-0.5 bg-gold" />
              <span className="text-gold-text text-sm font-medium tracking-widest uppercase">
                Our Journey
              </span>
            </div>
            <div className="flex flex-col gap-0">
              {milestones.map((milestone, index) => (
                <div key={milestone.year} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-charcoal text-white flex items-center justify-center shrink-0">
                      <span className="font-display text-xs font-bold">
                        {milestone.year.slice(2)}
                      </span>
                    </div>
                    {index < milestones.length - 1 && (
                      <div className="w-0.5 bg-slate-200 flex-1 my-1" />
                    )}
                  </div>
                  <div className="pb-8">
                    <p className="text-xs text-slate-600 mb-0.5">
                      {milestone.year}
                    </p>
                    <h3 className="font-semibold text-charcoal mb-1">
                      {milestone.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {milestone.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
