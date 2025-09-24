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
      font-size: 14px;
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

export const GraficosContainer = styled.div`
  .Title {
    font-size: 18px;
    padding-bottom: 10px;
    border-bottom: 2px solid #ddd;
    margin-top: 20px;
    margin-bottom: 20px;
  }

  select {
    padding: 8px;
    border: none;
    border-bottom: 1px solid #444;
    border-radius: 4px;
    margin-left: 10px;
    font-size: 16px;
    &:focus {
      outline: none;
    }
  }

  > div {
    display: flex;
    flex-direction: column;
    gap: 20px;
    justify-content: center;
    align-items: center;
    padding-bottom: 20px;
    border-bottom: 2px solid #ddd;

    > p {
      line-height: 22px;
      text-align: justify;
      width: 80%;
    }
  }
`
