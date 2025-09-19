import styled from 'styled-components'

export const NavegadorContainer = styled.nav`
  padding: 20px 0;
  ul {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: auto;
    width: 100%;
    list-style: none;
    padding: 0;
    margin: 0;
    align-items: center;

    li {
      padding: 8px;
      text-align: center;
      cursor: pointer;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      border-bottom: 2px gray solid;

      &.--active {
        border-bottom: 2px blue solid;
      }
    }
  }
`
