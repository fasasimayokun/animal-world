import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="bg-base-100 text-base-content">
      {/* Hero Section */}
      <section
        className="relative min-h-[80vh] flex flex-col items-center justify-center text-center px-4 text-primary-content bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=1350&q=80')",
        }}
      >
        {/* <div className="absolute inset-0 bg-black bg-opacity-60" /> */}
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to Animal Kingdom</h1>
          <p className="text-lg">
            Discover fascinating facts about animals, learn about your favorites, and share new ones with the world!
          </p>
          <div className="mt-6 flex gap-4 justify-center">
            <Link
              to="/signup"
              className="bg-base-100 text-primary px-6 py-2 rounded-lg font-semibold shadow-md hover:bg-base-300 transition"
            >
              Sign Up
            </Link>
            <Link
              to="/login"
              className="bg-transparent border border-base-100 text-base-100 px-6 py-2 rounded-lg font-semibold hover:bg-base-100 hover:text-primary transition"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6">Why Choose Animal Kingdom?</h2>
        <p className="text-lg mb-10 text-secondary">
          Our platform helps you explore the animal world — from common house pets to rare jungle creatures.
        </p>

        <div className="grid md:grid-cols-3 gap-10 text-left">
          <div className="p-6 bg-base-200 rounded-lg shadow hover:shadow-md transition">
            <h3 className="text-xl font-semibold mb-2">🐾 Learn About Animals</h3>
            <p>
              Read posts about your favorite animals, their habits, habitats, diets, and more.
            </p>
          </div>

          <div className="p-6 bg-base-200 rounded-lg shadow hover:shadow-md transition">
            <h3 className="text-xl font-semibold mb-2">🦁 Share New Creatures</h3>
            <p>
              Know an animal others should too? Add new entries and contribute to the growing animal kingdom!
            </p>
          </div>

          <div className="p-6 bg-base-200 rounded-lg shadow hover:shadow-md transition">
            <h3 className="text-xl font-semibold mb-2">💬 Comment & Explore</h3>
            <p>
              Comment on animal posts, interact with others, and build a vibrant animal-loving community.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 text-center bg-base-300">
        <h2 className="text-2xl font-semibold mb-4">Ready to Explore the Animal World?</h2>
        <Link
          to="/register"
          className="inline-block mt-2 bg-primary text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-primary-focus transition"
        >
          Get Started for Free
        </Link>
      </section>
    </div>
  );
};

export default LandingPage;
