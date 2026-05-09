import React, { useState } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

function ResumeBuilder() {
  const [activeStep, setActiveStep] = useState(1);
  const steps = ['Personal Info', 'Experience', 'Education', 'Skills'];

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6">
      {/* Form Sidebar */}
      <div className="w-1/2 flex flex-col">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Resume Builder</h1>
          <p className="text-sm text-slate-400">Fill in your details to generate your resume.</p>
        </div>
        
        {/* Stepper */}
        <div className="flex justify-between mb-8 relative before:absolute before:inset-0 before:top-1/2 before:-translate-y-1/2 before:h-0.5 before:w-full before:bg-slate-800 before:z-0">
          {steps.map((step, index) => (
            <div key={step} className="relative z-10 flex flex-col items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                activeStep >= index + 1 ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
              }`}>
                {index + 1}
              </div>
              <span className={`text-xs ${activeStep >= index + 1 ? 'text-blue-400' : 'text-slate-500'}`}>
                {step}
              </span>
            </div>
          ))}
        </div>

        <Card className="flex-1 overflow-y-auto">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">{steps[activeStep - 1]}</h2>
            
            {activeStep === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm text-slate-300">First Name</label>
                    <Input placeholder="John" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-slate-300">Last Name</label>
                    <Input placeholder="Doe" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-300">Professional Title</label>
                  <Input placeholder="Software Engineer" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm text-slate-300">Email</label>
                    <Input placeholder="john@example.com" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-slate-300">Phone</label>
                    <Input placeholder="+1 234 567 890" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-300">Summary</label>
                  <textarea 
                    className="w-full rounded-lg border border-slate-700 bg-slate-900/50 px-3 py-2 text-sm text-slate-100 min-h-[100px] focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Brief overview of your career..."
                  />
                </div>
              </div>
            )}
            
            {activeStep > 1 && (
              <div className="py-12 text-center text-slate-400 border-2 border-dashed border-slate-700 rounded-lg">
                <p>Mock Form Fields for {steps[activeStep - 1]}</p>
                <Button variant="secondary" size="sm" className="mt-4">Add Entry</Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        <div className="mt-6 flex justify-between">
          <Button 
            variant="secondary" 
            disabled={activeStep === 1}
            onClick={() => setActiveStep(s => Math.max(1, s - 1))}
          >
            Previous
          </Button>
          <Button 
            onClick={() => setActiveStep(s => Math.min(steps.length, s + 1))}
          >
            {activeStep === steps.length ? 'Finish' : 'Next Step'}
          </Button>
        </div>
      </div>

      {/* Live Preview Pane */}
      <div className="w-1/2 bg-slate-800 rounded-xl p-4 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-medium text-slate-400">Live Preview</span>
          <Button variant="secondary" size="sm">Download PDF</Button>
        </div>
        <div className="flex-1 bg-white rounded-lg p-8 text-slate-900 overflow-y-auto shadow-inner">
          <div className="max-w-2xl mx-auto space-y-6">
            <header className="text-center border-b border-slate-200 pb-6">
              <h1 className="text-3xl font-bold uppercase tracking-wider text-slate-800">John Doe</h1>
              <p className="text-lg text-blue-600 font-medium mt-1">Software Engineer</p>
              <div className="flex items-center justify-center gap-4 text-sm text-slate-500 mt-3">
                <span>john@example.com</span> • <span>+1 234 567 890</span> • <span>San Francisco, CA</span>
              </div>
            </header>
            
            <section>
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest border-b border-slate-200 pb-2 mb-3">Professional Summary</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Dedicated software engineer with 5+ years of experience in full-stack web development. Passionate about building scalable applications and intuitive user interfaces using modern technologies.
              </p>
            </section>
            
            <section>
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest border-b border-slate-200 pb-2 mb-3">Experience</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between font-semibold text-slate-800">
                    <span>Senior Developer @ Acme Corp</span>
                    <span>2020 - Present</span>
                  </div>
                  <ul className="list-disc list-inside text-sm text-slate-600 mt-2 space-y-1">
                    <li>Led the migration of legacy architecture to modern React/Node stack.</li>
                    <li>Improved application performance by 40% through lazy loading.</li>
                  </ul>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResumeBuilder;
