const Login = (props) => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <div className="w-full max-w-md p-8 bg-FFD0EC shadow-lg rounded-lg">
        <h1 className="text-4xl font-extrabold text-center text-1F2544 mb-8">
          Welcome to Voting Dapp
        </h1>
        <button
          onClick={props.connectWallet}
          className="w-full py-2 px-4 bg-1F2544 hover:bg-474F7A text-white font-bold rounded focus:outline-none focus:ring-2 focus:ring-1F2544 focus:ring-opacity-50"
        >
          Connect Wallet
        </button>
      </div>
    </div>
  );
};

export default Login;
