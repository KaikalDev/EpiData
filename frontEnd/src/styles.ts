import { createGlobalStyle } from 'styled-components'

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    list-style: none;
  }

  .Container {
    max-width: 1024px;
    width: 100%;
    margin: 0 auto;
  }
`

export default GlobalStyles
