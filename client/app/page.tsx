import Image from "next/image";
import Link from "next/link";

const highlights = [
  {
    title: "Workout Timer",
    description:
      "Stay locked in during every set. Our workout timer handles the math for you. It helps you maintain balance between working out and resting, so that you get enough of both.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="13" r="7" />
        <path d="M12 13V9" />
        <path d="M12 13L15 15" />
        <path d="M9 2h6" />
        <path d="M17.5 5.5l1 1" />
      </svg>
    ),
  },
  {
    title: "Calorie Tracker",
    description:
      "Know exactly how to fuel your body. Our calorie tracker lets you let go of the guesswork. It lets you log meals in seconds and stay in line with your nutrition plan effortlessly.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
        <path d="M13.5 2.5c.4 2.8-.8 4.7-2.1 6.4-1.2 1.5-2.4 2.9-2.4 5 0 2.9 2.2 5.1 5.1 5.1s5.4-2.3 5.4-5.8c0-4.8-3.2-8.1-6-10.7ZM11 21c-3.3 0-6-2.5-6-5.8 0-2.7 1.5-4.5 2.8-6.2.8-1 1.5-2 1.8-3.2 4.1 2.8 7.4 6.4 7.4 10.8 0 2.6-2.4 4.4-6 4.4Z" />
      </svg>
    ),
  },
  {
    title: "Progress Monitoring",
    description:
      "Easily see how far you’ve come. Track your stats over time with awesome charts that show actual growth. Nothing hits harder than knowing your hard work is paying off.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
        <path d="M4 19.5V4h2v13.5h14v2H4Zm4.2-3.3 3.2-4 2.7 2.4 4.8-6.1 1.6 1.2-6.1 7.8-2.8-2.5-2.2 2.8-1.2-1.6Z" />
      </svg>
    ),
  },
];

export default function HomePage() {

  return (
    <main className="h-screen overflow-hidden bg-black text-white">
      <div className="relative flex h-screen w-full flex-col px-6 pt-5 md:px-10 xl:px-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_35%,rgba(132,255,0,0.12),transparent_22%),radial-gradient(circle_at_88%_30%,rgba(132,255,0,0.08),transparent_20%)]" />

        <header className="relative z-10 grid grid-cols-3 items-center">
          <div className="text-xl font-medium tracking-tight">ByteFitness</div>

          <nav className="hidden justify-center gap-8 text-xs text-white/60 md:flex">

          </nav>

          <div className="flex justify-end">
            <Link
              href="/login"
              className="rounded-xl bg-lime-400 px-7 py-3 text-sm font-semibold text-black transition hover:bg-lime-300"
            >
              Log in
            </Link>
          </div>
        </header>

        <section className="relative z-10 grid flex-1 items-center gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="max-w-[600px]">
            <h1 className="text-5xl font-bold leading-[0.95] tracking-tight xl:text-7xl">
              The only fitness app
              <br />
              you’ll ever need
            </h1>

            <div className="mt-3 h-5 w-[260px] max-w-full">
              <svg
                viewBox="0 0 340 30"
                className="h-full w-full"
                preserveAspectRatio="none"
              >
                <path
                  d="M4 19C58 11 113 10 166 12C216 14 266 18 336 24C270 10 216 5 163 4C108 3 57 7 4 19Z"
                  fill="#9BE61A"
                />
              </svg>
            </div>

            <Link
              href="/register"
              className="mt-8 inline-flex rounded-xl bg-lime-400 px-8 py-3 text-base font-semibold text-black transition hover:bg-lime-300"
            >
              Get started!
            </Link>
          </div>

          <div className="relative hidden h-full items-end justify-end lg:flex -ml-16 xl:-ml-24">
            <div className="relative h-[520px] w-[520px] xl:h-[700px] xl:w-[700px]">
              <Image
                src="/fitness-hero.png"
                alt="Fitness model holding dumbbells"
                fill
                priority
                className="object-contain object-bottom"
              />
            </div>
          </div>
        </section>

        <section className="relative z-10 pb-6">
          <h2 className="mb-5 text-4xl font-semibold tracking-tight">Highlights</h2>

          <div className="grid gap-4 lg:grid-cols-3">
            {highlights.map((item, index) => (
              <div
                key={index}
                className="group relative rounded-2xl border border-white/10 bg-white/[0.02] p-5 pt-12 transition duration-200 hover:border-lime-400"
              >
                <div className="absolute -top-3 right-4 flex h-11 w-11 items-center justify-center rounded-xl bg-lime-400 text-black">
                  {item.icon}
                </div>

                <h3 className="text-xl font-medium">{item.title}</h3>
                <p className="mt-3 text-base leading-8 text-white/65">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}