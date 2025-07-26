import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    // You can integrate with your preferred form handling service
  };

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <section className="section-padding bg-gradient-to-br from-primary-50 to-white">
        <div className="container-max">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Let's create something meaningful together
            </h1>
            <p className="text-xl text-gray-600">
              Because the best projects start with a conversation
            </p>
          </div>
        </div>
      </section>

      {/* Collaboration Mindset */}
      <section className="section-padding">
        <div className="container-max">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">The Collaboration Mindset</h2>
            <p className="text-lg text-gray-700 mb-6">
              I believe the most rewarding work happens when curious, passionate people come together to solve interesting problems. 
              Whether you have a startup idea that needs bringing to life, an existing product that needs a fresh perspective, 
              or just want to chat about the intersection of technology and human experience – I'm all ears.
            </p>
            <p className="text-lg text-gray-700 mb-8">
              I don't just build websites – I collaborate on digital experiences that people actually enjoy using. That means 
              listening carefully to understand your vision, asking the right questions to uncover hidden opportunities, 
              and communicating clearly throughout the entire process.
            </p>
          </div>
        </div>
      </section>

      {/* What I Can Help With */}
      <section className="section-padding bg-gray-50">
        <div className="container-max">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">What I Can Help You With</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">New Project Development</h3>
                <p className="text-gray-700">
                  Ready to bring your digital vision to life? I'll work with you to understand your goals, plan the technical approach, 
                  and build something that not only looks great but actually works for your users.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Existing Project Enhancement</h3>
                <p className="text-gray-700">
                  Got an existing website or application that needs improvement? I can help optimize performance, enhance user experience, 
                  or add new features that take your project to the next level.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Technical Consultation</h3>
                <p className="text-gray-700">
                  Need a second opinion on your frontend architecture? Want to explore new technologies for your stack? 
                  I'm happy to provide insights and recommendations based on real-world experience.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Code Review & Optimization</h3>
                <p className="text-gray-700">
                  Sometimes a fresh pair of eyes is exactly what your project needs. I can review your codebase and suggest 
                  improvements for performance, maintainability, and best practices.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="section-padding">
        <div className="container-max">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Let's Start the Conversation</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="John Doe"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="john@example.com"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Project Collaboration"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Tell me about your project or what you'd like to discuss..."
                    />
                  </div>
                  
                  <button type="submit" className="btn-primary w-full">
                    Send Message →
                  </button>
                </form>
              </div>

              {/* Contact Info & Approach */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">My Approach to Working Together</h3>
                
                <div className="space-y-6 mb-8">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Transparent Communication</h4>
                    <p className="text-gray-700">
                      I believe in keeping you informed every step of the way. No jargon, no mystery – just clear, 
                      honest communication about progress, challenges, and next steps.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Realistic Timelines</h4>
                    <p className="text-gray-700">
                      I'll give you honest estimates and stick to them. Because respect for your time is just as 
                      important as respect for your project.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Quality Focus</h4>
                    <p className="text-gray-700">
                      I don't just make things work – I make them work well. Every line of code I write is crafted 
                      with attention to detail and a commitment to excellence.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Continuous Collaboration</h4>
                    <p className="text-gray-700">
                      This isn't a drop-it-in-my-lap-and-forget-about-it situation. I believe in working together 
                      throughout the process, incorporating your feedback and ensuring we're building exactly what you need.
                    </p>
                  </div>
                </div>

                {/* Contact Details */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Other Ways to Connect</h4>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <span className="text-primary-600 mr-3">📧</span>
                      <span className="text-gray-700">sharfuzzaman@example.com</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-primary-600 mr-3">💼</span>
                      <span className="text-gray-700">LinkedIn: /in/sharfuzzaman</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-primary-600 mr-3">🐦</span>
                      <span className="text-gray-700">Twitter: @sharfuzzaman</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-primary-600 mr-3">💻</span>
                      <span className="text-gray-700">GitHub: /sharfuzzaman</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-gray-600 italic">
                    Always curious, always learning, always up for an interesting conversation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-max">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Still Have Questions?</h2>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">What's your typical timeline for projects?</h3>
                <p className="text-gray-700">
                  It depends on the scope, but I'll always provide a realistic timeline upfront and keep you updated 
                  on progress throughout the process.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">What's your process for handling revisions?</h3>
                <p className="text-gray-700">
                  I include revision rounds in every project timeline. Clear communication upfront usually minimizes 
                  major revisions, but I'm always happy to make sure we get it right.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Do you work with other developers or designers?</h3>
                <p className="text-gray-700">
                  Absolutely! I love collaborating with talented designers, backend developers, and other frontend specialists. 
                  Great projects are team efforts.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">What if I'm not sure what I need?</h3>
                <p className="text-gray-700">
                  That's totally fine! We can start with a conversation to explore your goals and figure out the best approach together.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
