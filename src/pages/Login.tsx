import Header from "../components/Header";
import PhoneAuth from "../components/auth/PhoneAuth";

const Login = () => {
  return (
    <main className="flex items-center justify-center min-h-screen">
      <section className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
        <Header
          heading="Login to your account"
          paragraph="Signin with your mobile number"
          linkName=""
          linkUrl=""
        />
        <PhoneAuth />
      </section>
    </main>
  );
};

export default Login;