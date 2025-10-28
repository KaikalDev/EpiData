import styled, { createGlobalStyle } from 'styled-components'

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    list-style: none;
    font-family: "Libre Baskerville", serif;
  }

  .Container {
    max-width: 1024px;
    width: 100%;
    margin: 0 auto;
  }
`

export const SurtosContainer = styled.div`
  margin-top: 2rem;
  padding: 1.8rem;
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease-in-out;

  &:hover {
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  }

  .surtos-title {
    font-size: 1.4rem;
    font-weight: 700;
    color: #1a1a1a;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .surtos-legenda {
    display: flex;
    justify-content: flex-start;
    gap: 1rem;
    margin-bottom: 1.2rem;

    .legenda-item {
      font-size: 0.9rem;
      font-weight: 600;
      padding: 0.3rem 0.6rem;
      border-radius: 5px;
    }
  }

  /* LISTA AJUSTADA COM GRID FIXO */
  .surtos-list {
    list-style: none;
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: repeat(5, auto); /* força 5 linhas */
    grid-auto-flow: column; /* preenche verticalmente */
    column-gap: 20px;
    row-gap: 12px;
    margin: 0;
    padding: 0;
  }

  .surtos-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.8rem 0;
    border-bottom: 1px solid #e9e9e9;
    transition: background 0.2s;

    &:hover {
      background-color: #f9f9f9;
    }

    .surtos-info {
      display: flex;
      align-items: center;
      gap: 0.8rem;

      .surtos-rank {
        font-weight: 700;
        color: #777;
        width: 35px;
        text-align: right;
      }

      .surtos-nome {
        font-weight: 500;
        color: #222;
      }
    }

    .surtos-status {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      margin-left: 25px;

      .surtos-classificacao {
        font-size: 0.95rem;
        font-weight: 700;
        padding: 0.3rem 0.7rem;
        border-radius: 6px;
        text-transform: uppercase;
        text-align: center;
      }

      .surtos-pontuacao {
        font-size: 0.85rem;
        color: #555;
        margin-top: 0.2rem;
      }
    }
  }

  .risco-alto {
    color: #b91c1c;
    background-color: #fee2e2;
  }

  .risco-moderado {
    color: #92400e;
    background-color: #fef3c7;
  }

  .risco-baixo {
    color: #166534;
    background-color: #dcfce7;
  }
`

export default GlobalStyles
