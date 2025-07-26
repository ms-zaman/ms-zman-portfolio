import React from 'react';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-primary-50 to-white">
        <div className="container-max">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Crafting digital experiences that feel like home
            </h1>
            <p className="text-xl text-gray-600 mb-4">
              Frontend Developer • UI Enthusiast • Curious Human
            </p>
            <p className="text-lg text-gray-700 mb-8 max-w-3xl mx-auto">
              Hi, I'm Sharfuzzaman – a frontend developer who believes great code should feel as good as it looks. 
              I build interfaces that aren't just pixel-perfect, but human-perfect.
            </p>
            <button className="btn-primary text-lg">
              Let's Create Something Beautiful →
            </button>
          </div>
        </div>
      </section>

      {/* About Me Preview */}
      <section className="section-padding">
        <div className="container-max">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">About Me</h2>
            <p className="text-lg text-gray-700 mb-6">
              I'm the kind of person who gets genuinely excited about a perfectly aligned button, 
              but I'm equally thrilled by a perfectly timed six over long-on.
            </p>
            <p className="text-lg text-gray-700 mb-8">
              As a frontend developer, I spend my days bringing designs to life with React, styling with 
              Tailwind's elegant utility classes, and crafting WordPress experiences that don't feel like WordPress. 
              I have this thing for building interfaces that not only look stunning but actually feel right in your hands.
            </p>
            <button className="btn-secondary">
              Learn More About Me →
            </button>
          </div>
        </div>
      </section>

      {/* Work Preview */}
      <section className="section-padding bg-gray-50">
        <div className="container-max">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">My Work</h2>
            <p className="text-xl text-gray-600 mb-8">
              Building digital experiences that bridge the gap between beautiful and functional
            </p>
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">React & Modern JavaScript</h3>
                <p className="text-gray-600">
                  Building dynamic, responsive applications with clean, maintainable code that scales with your ambitions.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Tailwind CSS Magic</h3>
                <p className="text-gray-600">
                  Creating stunning, consistent designs without the bloat – just pure, efficient styling.
                </p>
              </div>
            </div>
            <button className="btn-primary">
              View My Work →
            </button>
          </div>
        </div>
      </section>

      {/* Beyond Code Preview */}
      <section className="section-padding">
        <div className="container-max">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Beyond Code</h2>
            <p className="text-xl text-gray-600 mb-8">Where passion meets pixels</p>
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div className="text-center">
                <div className="text-4xl mb-4">🏏</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Cricket Chronicles</h3>
                <p className="text-gray-600">Strategy, patience, and those moments when everything clicks.</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">✍️</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Writing Thoughts</h3>
                <p className="text-gray-600">Documenting learnings and exploring tech intersections.</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🌍</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Wanderlust & Wonder</h3>
                <p className="text-gray-600">Collecting moments that inspire creative work.</p>
              </div>
            </div>
            <button className="btn-secondary">
              Explore Beyond Code →
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-primary-600">
        <div className="container-max">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-6">Let's build something that matters</h2>
            <p className="text-xl text-primary-100 mb-8">
              I'm always excited to collaborate on projects that challenge me, push boundaries, 
              and hopefully make a positive impact.
            </p>
            <button className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-colors duration-200">
              Get in Touch →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
