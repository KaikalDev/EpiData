import styled from 'styled-components'

export const NavegadorContainer = styled.nav`
  padding: 20px 0;
  ul {
    display: flex;
    width: 100%;
    justify-content: space-between;
    border-bottom: 1px gray solid;

    li {
      padding: 8px;

      &.--active {
        border-bottom: 1px blue solid;
      }
    }
  }
`
