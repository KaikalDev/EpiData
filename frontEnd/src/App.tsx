import Page from './Pages'
import GlobalStyles from './styles'
import Logo from './imgs/nicoprea.jpeg'

function App() {
  return (
    <>
      <GlobalStyles />
      <img
        style={{
          position: 'absolute',
          top: 12,
          left: 12,
          width: '50px',
          height: 'auto'
        }}
        src={Logo}
        alt="Logo"
      />
      <Page />
    </>
  )
}

export default App
