import  useAuthStore from "../store/auth.store";

const Testing = () => {
  const { signup, signin, isAuth, error } = useAuthStore();

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <button
        className="px-5 py-2 rounded-md bg-amber-400"
        onClick={() =>
          signup({
            name: "Test User",
            email: "test@convoc.com",
            password: "123456",
          })
        }
      >
        Signup
      </button>

      {isAuth && <p>Logged in</p>}
      {error && <p>{error}</p>}
    </div>
  );
};


export default Testing