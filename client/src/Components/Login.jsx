const Login = (props) => {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 flex flex-col justify-center items-center">
        <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
          <h1 className="text-4xl font-extrabold text-center text-blue-900 mb-8">Welcome to Voting Dapp</h1>
          <button
            onClick={props.connectWallet}
            className="w-full py-2 px-4 bg-blue-900 hover:bg-blue-700 text-white font-bold rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Connect Wallet
          </button>
        </div>
      </div>
    );
  };
  
  export default Login;