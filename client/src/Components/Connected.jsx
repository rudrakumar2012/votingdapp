const Connected = (props) => {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 to-pink-500 flex flex-col justify-center items-center">
        <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
          <h1 className="text-4xl font-extrabold text-center text-purple-600 mb-8">Welcome to Voting Dapp</h1>
          <p className="mb-4">Metamask Account: {props.account}</p>
        </div>
      </div>
    );
  };
  
  export default Connected;