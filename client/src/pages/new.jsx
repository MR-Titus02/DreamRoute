// Updated icon components with white stroke for circle display

  // In your component:
  <section className="py-16 px-4 bg-white/5 backdrop-blur-sm">
    <div className="max-w-4xl mx-auto">
      {/* ... header code ... */}
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {processSteps.map((step, i) => (
          <motion.div key={i} className="flex flex-col items-center text-center">
            <div className="relative mb-4 p-4 rounded-full bg-gradient-to-br from-[#00ADB5] to-[#00C4CC] shadow-lg">
              <div className="w-10 h-10 flex items-center justify-center">
                {React.cloneElement(step.icon, { 
                  white: true, // This will make the icon white
                  strokeWidth: "2",
                  className: "w-6 h-6"
                })}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-white text-cyan-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-sm">
                {i+1}
              </div>
            </div>
            {/* ... rest of the card ... */}
          </motion.div>
        ))}
      </div>
    </div>
  </section>