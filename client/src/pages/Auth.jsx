import AuthCard from '../components/AuthCard'

const Auth = () => {
  return (
    <div className="relative h-screen bg-black flex items-center justify-center overflow-hidden">
      <div
        className="absolute left-1/2 top-1/2 h-300 w-300 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-25 blur-[120px]"
        style={{
          background:
            'radial-gradient(70.71% 70.71% at 50% 50%, rgba(43, 127, 255, 0.8) 0%, rgba(59, 130, 246, 0.4) 40%, rgba(0, 0, 0, 0) 70%)',
        }}
      />
      <AuthCard />
    </div>
  );
};

export default Auth