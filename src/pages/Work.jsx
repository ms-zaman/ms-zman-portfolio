import React from 'react';

const Work = () => {
  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <section className="section-padding bg-gradient-to-br from-primary-50 to-white">
        <div className="container-max">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Where ideas meet implementation
            </h1>
            <p className="text-xl text-gray-600">
              Crafting digital solutions that solve real problems
            </p>
          </div>
        </div>
      </section>

      {/* My Process */}
      <section className="section-padding">
        <div className="container-max">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">My Process</h2>
            <p className="text-lg text-gray-700 mb-8">
              Great work doesn't happen by accident – it's the result of thoughtful planning, intentional execution, 
              and genuine care for the end user. Here's how I approach every project:
            </p>
            
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-semibold">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Understanding First</h3>
                  <p className="text-gray-700">
                    Every project begins with a deep dive into the problem we're solving. I collaborate closely with 
                    clients to understand not just what they want, but why they want it, and who it's for.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-semibold">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Design Collaboration</h3>
                  <p className="text-gray-700">
                    I work hand-in-hand with designers to ensure the final product honors the original vision while 
                    adding that extra polish that makes interfaces truly shine.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-semibold">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Clean, Maintainable Code</h3>
                  <p className="text-gray-700">
                    I don't just make things work – I make them work well. My code is clean, well-documented, 
                    and built to scale. Because tomorrow's features shouldn't suffer because of today's deadlines.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-semibold">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Testing & Refinement</h3>
                  <p className="text-gray-700">
                    The devil is in the details, and I'm on a first-name basis with most of them. Every project 
                    goes through rigorous testing to ensure it works flawlessly across devices and browsers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="section-padding bg-gray-50">
        <div className="container-max">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Featured Projects</h2>
            
            <div className="space-y-12">
              {/* Project 1 */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="md:flex">
                  <div className="md:w-1/2 bg-gradient-to-br from-blue-100 to-blue-200 p-8 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl text-blue-600 mb-4">🚀</div>
                      <p className="text-blue-800 font-medium">Project Screenshot Coming Soon</p>
                    </div>
                  </div>
                  <div className="md:w-1/2 p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">E-Commerce Platform</h3>
                    <p className="text-gray-600 mb-4">
                      A modern e-commerce solution built with React and integrated payment systems.
                    </p>
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">The Challenge:</h4>
                      <p className="text-gray-600 text-sm">Creating a seamless shopping experience with complex product variations and real-time inventory.</p>
                    </div>
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Tech Stack:</h4>
                      <p className="text-gray-600 text-sm">React, TanStack Query, Tailwind CSS, Stripe API</p>
                    </div>
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-2">The Outcome:</h4>
                      <p className="text-gray-600 text-sm">40% increase in conversion rate and significantly improved user experience.</p>
                    </div>
                    <button className="btn-secondary text-sm">View Project →</button>
                  </div>
                </div>
              </div>

              {/* Project 2 */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="md:flex">
                  <div className="md:w-1/2 bg-gradient-to-br from-green-100 to-green-200 p-8 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl text-green-600 mb-4">📊</div>
                      <p className="text-green-800 font-medium">Project Screenshot Coming Soon</p>
                    </div>
                  </div>
                  <div className="md:w-1/2 p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Analytics Dashboard</h3>
                    <p className="text-gray-600 mb-4">
                      A comprehensive analytics platform with real-time data visualization and reporting.
                    </p>
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">The Challenge:</h4>
                      <p className="text-gray-600 text-sm">Displaying complex data in an intuitive, actionable format for non-technical users.</p>
                    </div>
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Tech Stack:</h4>
                      <p className="text-gray-600 text-sm">React, D3.js, TanStack Table, WebSocket API</p>
                    </div>
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-2">The Outcome:</h4>
                      <p className="text-gray-600 text-sm">Reduced decision-making time by 60% and improved data accessibility across teams.</p>
                    </div>
                    <button className="btn-secondary text-sm">View Project →</button>
                  </div>
                </div>
              </div>

              {/* Project 3 */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="md:flex">
                  <div className="md:w-1/2 bg-gradient-to-br from-purple-100 to-purple-200 p-8 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl text-purple-600 mb-4">🎨</div>
                      <p className="text-purple-800 font-medium">Project Screenshot Coming Soon</p>
                    </div>
                  </div>
                  <div className="md:w-1/2 p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Creative Portfolio Site</h3>
                    <p className="text-gray-600 mb-4">
                      A stunning portfolio website for a creative agency with custom animations and interactions.
                    </p>
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">The Challenge:</h4>
                      <p className="text-gray-600 text-sm">Balancing creative expression with performance and accessibility requirements.</p>
                    </div>
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Tech Stack:</h4>
                      <p className="text-gray-600 text-sm">React, Framer Motion, Tailwind CSS, Headless CMS</p>
                    </div>
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-2">The Outcome:</h4>
                      <p className="text-gray-600 text-sm">300% increase in client inquiries and industry recognition for design excellence.</p>
                    </div>
                    <button className="btn-secondary text-sm">View Project →</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technologies */}
      <section className="section-padding">
        <div className="container-max">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Technologies I Work With</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Frontend Magic</h3>
                <p className="text-gray-600">React, JavaScript (ES6+), HTML5, CSS3, Tailwind CSS, Sass</p>
              </div>
              
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">WordPress Wizardry</h3>
                <p className="text-gray-600">Custom theme development, Elementor mastery, plugin integration, performance optimization</p>
              </div>
              
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Tools & Workflow</h3>
                <p className="text-gray-600">Git, Webpack, Figma, Adobe XD, VS Code, npm/yarn</p>
              </div>
            </div>
            
            <p className="text-center text-gray-700 mt-8">
              I'm always excited to learn new technologies, but I've found that mastering the fundamentals and 
              understanding when to use the right tool for the job is what truly makes the difference.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-primary-600">
        <div className="container-max">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-6">Ready to Start Your Project?</h2>
            <p className="text-xl text-primary-100 mb-8">
              Every project is an opportunity to create something meaningful. Whether you're launching a new product, 
              redesigning an existing website, or need help with a specific technical challenge – I'd love to help 
              bring your vision to life.
            </p>
            <button className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-colors duration-200">
              Let's Build Something Amazing →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Work;
