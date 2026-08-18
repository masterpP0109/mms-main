export default function About() {
  return (
    <div className="min-h-screen bg-[#050507] text-[#f4ebd0] p-8">
      <header className="max-w-3xl mx-auto text-center mb-8">
        <h1 className="text-3xl font-serif">We help organisations deliver important events professionally.</h1>
        <p className="mt-3 text-[#f4ebd0]/80">Mosi Media Solutions is a Victoria Falls-based conference and media production company supporting institutions that need their events to be professionally presented, documented and shared. Our core work focuses on conferences, seminars, workshops and institutional gatherings for government, development, professional and corporate organisations.</p>
      </header>

      <main className="max-w-4xl mx-auto space-y-8">
        <section>
          <h2 className="text-xl font-semibold">Who We Are</h2>
          <p className="text-[#f4ebd0]/80">We are a small, professional production team specialising in institutional events and conference delivery. We prioritise preparation, discretion and reliable technical delivery.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">What We Specialise In</h2>
          <ul className="list-disc ml-6 text-[#f4ebd0]/80">
            <li>End-to-end conference production</li>
            <li>Live streaming and hybrid conferencess</li>
            <li>Event photography and documentation</li>
            <li>Multi-camera video coverage and editing</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Why Victoria Falls</h2>
          <p className="text-[#f4ebd0]/80">Victoria Falls offers strategic proximity to regional events and unique venues. Our local knowledge helps us deliver seamless logistics and production for visiting delegations and institutions.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Our Values</h2>
          <div className="grid grid-cols-2 gap-4 text-[#f4ebd0]/80">
            <div>Professionalism</div>
            <div>Reliability</div>
            <div>Preparation</div>
            <div>Discretion</div>
            <div>Quality</div>
            <div>Partnership</div>
          </div>
        </section>

        <div className="text-center">
          <a href="/conference-production#enquiry" className="inline-flex px-5 py-3 rounded-full bg-[#b48a3d] text-[#050507] font-semibold">Plan a Conference</a>
        </div>
      </main>
    </div>
  );
}
