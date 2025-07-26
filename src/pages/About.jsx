import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <section className="section-padding bg-gradient-to-br from-primary-50 to-white">
        <div className="container-max">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              From curious coder to frontend craftsman
            </h1>
            <p className="text-xl text-gray-600">
              The journey of turning curiosity into clean code
            </p>
          </div>
        </div>
      </section>

      {/* My Story */}
      <section className="section-padding">
        <div className="container-max">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">My Story</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-gray-700 mb-6">
                You know how some people collect vinyl records or vintage cameras? Well, I collect "aha!" moments – 
                those satisfying instances when a tricky piece of code finally clicks into place, or when a design 
                element transforms from concept to pixel-perfect reality.
              </p>
              <p className="text-lg text-gray-700 mb-6">
                My journey into frontend development wasn't exactly linear. It started with tinkering (like most of us), 
                breaking things just to see if I could fix them again. What began as casual curiosity slowly evolved 
                into genuine passion, and eventually into a career where I get to build things that matter, one line of code at a time.
              </p>
              <p className="text-lg text-gray-700 mb-8">
                I've learned that being a frontend developer isn't just about knowing the latest frameworks or writing 
                flawless JavaScript (though that helps). It's about understanding people – how they think, how they interact, 
                what frustrates them, and what delights them. Every project teaches me something new about the beautiful 
                complexity of human experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* My Approach */}
      <section className="section-padding bg-gray-50">
        <div className="container-max">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">My Approach</h2>
            <p className="text-lg text-gray-700 mb-8">
              I believe the best digital experiences are built on a foundation of empathy, curiosity, and attention to detail. 
              Here's how I approach my work:
            </p>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Start with Why</h3>
                <p className="text-gray-700">
                  Before I write a single line of code, I ask: Who is this for? What problem are we solving? 
                  How can this make someone's day just a little bit better?
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Build with Intention</h3>
                <p className="text-gray-700">
                  Every design decision, every line of code, every interaction – nothing happens by accident. 
                  I craft interfaces that feel intentional and purposeful.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Embrace the Details</h3>
                <p className="text-gray-700">
                  That perfectly timed animation, the subtle hover effect, the way a form feels when it just works – 
                  these details aren't just polish, they're poetry.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Stay Curious</h3>
                <p className="text-gray-700">
                  Technology evolves fast, and I wouldn't have it any other way. I'm always experimenting, learning, 
                  and pushing myself to grow as a developer and as a creator.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Beyond the Code */}
      <section className="section-padding">
        <div className="container-max">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Beyond the Code</h2>
            <p className="text-lg text-gray-700 mb-6">
              When I'm not building interfaces, you'll still find me building – just in different ways. Whether I'm 
              strategizing my next cricket innings, crafting thoughts in my notebook, or mapping out my next adventure, 
              I'm always creating something.
            </p>
            <p className="text-lg text-gray-700 mb-6">
              These experiences don't just fill my time – they inform my work. The patience I learn from watching a 
              20-over innings translates to debugging complex components. The storytelling instincts from my writing 
              help me create more intuitive user flows. The problem-solving mindset from travel mishaps (yes, those 
              teach you a lot!) helps me architect better solutions.
            </p>
            <p className="text-lg text-gray-700 mb-8">
              I've come to realize that being a well-rounded person makes me a better developer, and vice versa.
            </p>
          </div>
        </div>
      </section>

      {/* Let's Connect */}
      <section className="section-padding bg-primary-600">
        <div className="container-max">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-6">Let's Connect</h2>
            <p className="text-xl text-primary-100 mb-8">
              I'm always excited to meet fellow creators, collaborate on interesting projects, or simply chat about 
              the intersection of technology and human experience.
            </p>
            <p className="text-lg text-primary-100 mb-8">
              Whether you're looking to bring a digital vision to life, need a fresh perspective on an existing project, 
              or just want to talk about the latest in frontend development – I'd love to hear from you.
            </p>
            <button className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-colors duration-200">
              Let's Have a Conversation →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
