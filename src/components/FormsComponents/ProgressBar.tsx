import { motion } from 'framer-motion';

interface ProgressBarProps {
  steps: string[];
  currentStep: number;
}

const ProgressBar = ({ steps, currentStep }: ProgressBarProps) => {
  return (
    <div className="w-full mb-10">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="relative">
              <motion.div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  index < currentStep
                    ? 'bg-primary-600 border-primary-600 text-white'
                    : index === currentStep
                    ? 'border-primary-600 text-primary-600'
                    : 'border-neutral-300 text-neutral-400'
                }`}
                whileHover={{ scale: index <= currentStep ? 1.1 : 1 }}
                transition={{ duration: 0.2 }}
              >
                {index < currentStep ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <span>{index + 1}</span>
                )}
              </motion.div>
              {index < steps.length - 1 && (
                <div className="absolute top-1/2 -right-full w-full h-0.5 bg-neutral-200">
                  {index < currentStep - 1 && (
                    <motion.div
                      className="h-full bg-primary-600"
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    />
                  )}
                  {index === currentStep - 1 && (
                    <motion.div
                      className="h-full bg-primary-600"
                      initial={{ width: 0 }}
                      animate={{ width: '50%' }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    />
                  )}
                </div>
              )}
            </div>
            <span className={`mt-2 text-sm ${
              index <= currentStep ? 'text-primary-700 font-medium' : 'text-neutral-500'
            }`}>
              {step}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;