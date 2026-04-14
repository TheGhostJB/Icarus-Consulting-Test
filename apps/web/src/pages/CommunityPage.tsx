import Navbar from "../components/layout/Navbar";

function CommunityPage() {
  return (
    <div className="min-h-screen bg-[#F4F5F7]">
      <main className="mx-auto w-full max-w-[1400px] p-6">
        <Navbar />

        <section className="mb-9 flex flex-col items-center justify-center gap-4 rounded-[28px] bg-[linear-gradient(90deg,#0B2A55_0%,#1D4E89_50%,#60A5FA_100%)] px-10 py-20 text-center text-white shadow-[0_10px_24px_rgba(0,0,0,0.12)]">
          <p className="m-0 text-sm font-bold tracking-[0.2em] text-white/80 uppercase">
            Community
          </p>
          <h1 className="m-0 text-4xl font-black tracking-tight sm:text-5xl">Coming soon</h1>
          <p className="m-0 max-w-lg text-base leading-relaxed text-white/90">
            We are preparing forums, challenges and spaces to connect with other Titans Crew fans. 
            Come back soon.
          </p>
        </section>
      </main>
    </div>
  );
}

export default CommunityPage;
