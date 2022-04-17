function App() {
  const wave = () => {
    alert('Messaggio inviato');
  };

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">👋 Hey there!</div>

        <div className="bio">Collega il tuo wallet Ethereum e inviami un messaggio!</div>

        <button type="button" className="waveButton" onClick={wave}>
          send your wish
        </button>
      </div>
    </div>
  );
}

export default App;
